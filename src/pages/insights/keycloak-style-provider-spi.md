---
layout: ../../layouts/ArticleLayout.astro
title: "A Keycloak-style provider SPI for multi-tenant notifications"
description: "How to let a notification engine take on new SMS, email, push and WhatsApp vendors as drop-in JARs — borrowing Keycloak's Provider/ProviderFactory model and the JDK's own ServiceLoader."
published: "2026-11-02"
topic: "Architecture"
readingTime: "8 min read"
---

A multi-tenant notification service sends SMS, email, push and WhatsApp messages on behalf of many
tenants. Each tenant wants its own vendors — Africa's Talking for SMS in one market, Twilio in
another, Mailgun or SES for email — and the list keeps growing.

In the first version of the engine I worked on, onboarding a new vendor meant changing the engine
itself:

1. add a constant to a `ProviderKey` enum,
2. write a new Spring `@Component` implementing the adapter interface,
3. redeploy.

The dispatcher collected every adapter bean at startup into an `EnumMap<ProviderKey, Adapter>`. It
worked, but the set of possible providers was **closed at compile time**. Every new vendor was a
change to core code, a full review and a release of the service everyone depends on.

## What Keycloak gets right

Keycloak has solved exactly this problem for identity providers, user storage, authenticators and
more. Its Service Provider Interface (SPI) rests on three ideas:

- **A `Provider` / `ProviderFactory` split.** The factory is a long-lived singleton that knows the
  provider's id and how to build instances; the provider does the actual work. One `oidc` factory
  backs many configured identity providers.
- **Discovery through `ServiceLoader`.** Extensions are JARs dropped into a `providers/` directory.
  Each declares its factories in `META-INF/services`, and Keycloak finds them at build/start time.
- **Self-describing configuration.** A factory can implement `ConfiguredProvider` and return its own
  list of config properties, so the admin console renders the right form for a provider it has
  never heard of.

Applied to notifications, the goal becomes: **a new vendor is a JAR in a configured directory,
picked up on restart, with its settings self-described — and zero changes to the dispatch or
routing code.**

## The contract

The adapter shrinks to the one thing it must do:

```java
public interface ChannelProviderAdapter {
    DispatchResult send(RenderedMessage message);
}
```

Everything about *which* provider it is moves to the factory:

```java
public interface ChannelProviderAdapterFactory {
    /** Stable id stored in tenant config, e.g. "AFRICAS_TALKING". */
    String getId();

    Channel getChannel();

    /** The settings this provider needs — rendered by the admin UI. */
    List<ProviderConfigProperty> getConfigProperties();

    /** One factory, many configured instances (one per tenant config). */
    ChannelProviderAdapter create(ProviderConfig config);
}

public record ProviderConfigProperty(
        String name, String label, String helpText,
        ProviderConfigPropertyType type, boolean required, String defaultValue) {}
```

Two details matter here. First, the provider id becomes a **string**, not an enum constant — an
enum can never contain a provider that didn't exist when the engine was compiled. Second,
`create(config)` takes the tenant's stored configuration, so a single factory serves every tenant
that uses that vendor, each with its own credentials.

## The registry

A small registry replaces the `EnumMap`. It starts with the built-in factories Spring already
knows about, then scans the plugins directory:

```java
for (Path jar : jarsIn(pluginsDir)) {
    var loader = new URLClassLoader(new URL[] { jar.toUri().toURL() }, getClass().getClassLoader());
    for (var factory : ServiceLoader.load(ChannelProviderAdapterFactory.class, loader)) {
        if (factories.putIfAbsent(factory.getId(), factory) != null) {
            log.warn("Duplicate provider id {} in {} — keeping the first", factory.getId(), jar);
        }
    }
}
```

A few deliberate choices:

- **Parent class loader = the application's.** The shared SPI types resolve to the same classes
  the engine uses, while each plugin's private dependencies stay inside its own loader.
- **First registration wins, built-ins first.** A plugin can't silently replace a built-in provider
  by reusing its id; the duplicate is logged and ignored.
- **No directory, no problem.** If the plugins path is unset or missing, the registry just uses
  the built-ins — local development needs no extra setup.
- **No new dependency.** `ServiceLoader` and `URLClassLoader` ship with the JDK. A plugin framework
  would add a dependency without adding anything this design needs.

The dispatcher no longer knows about concrete providers at all. For each routing candidate it asks
the registry for the factory by id and creates the adapter from the tenant's config.

## Making plugins visible, not just loaded

A plugin that loads silently is half a feature. Two small additions make it usable:

- **A catalog endpoint** — `GET /providers/catalog` — returns every registered factory's id,
  channel and config schema. The admin UI renders a form from that schema, so supporting a new
  vendor's fields needs no frontend change either.
- **Validation on write.** Creating a provider config or routing rule with an id the registry
  doesn't know returns `422 Unprocessable Content`: the request is well-formed, but there is no
  such provider.

## Moving off the enum without a data migration

The enum was persisted with `EnumType.STRING`, so the database already held values like
`"AFRICAS_TALKING"`. The built-in factories return those exact strings from `getId()`, which means
existing rows resolve unchanged. The only schema change is widening the column — plugin ids can be
longer than the old enum names — which is non-destructive.

## What this deliberately doesn't do

- **Hot reload.** Like Keycloak, new JARs are picked up on restart. Unloading class loaders safely
  at runtime is a lot of complexity for a capability nobody needs at deploy-time cadence.
- **Config-only onboarding.** Vendors that speak a common protocol (SMTP, a generic webhook) could
  be onboarded with configuration alone through a generic adapter. That is a separate,
  complementary feature — this one is about how adapters are *packaged and discovered*.
- **Provisioning the directory.** Whether plugins arrive via a mounted volume or an extra image
  layer is a deployment decision; the service only needs the path.
- **Untrusted plugins.** A JAR in that directory runs with the service's full privileges. The
  plugins directory is a reviewed deployment artifact, never something tenants can upload.

## Proving it works

The test that matters builds a plugin **at test time**. Using the JDK's own
`ToolProvider.findFirst("jar")`, the test compiles a tiny fake factory, packages it with its
`META-INF/services` entry into a JAR in a temporary directory, points the registry at that
directory and asserts the new id is discoverable — with no change to any dispatch or routing class.
No external tooling, no subprocess.

End to end, the check is the same story a vendor integration would follow: drop an example JAR in
the directory, restart, see it in the catalog, create a tenant config for it (`201`), and watch a
dispatch route through the plugin's `send()`.

## The takeaway

The interesting move isn't the class loading — it's **turning a closed enum into an open registry
of self-describing factories**. Once the engine depends only on the contract, adding a vendor
stops being a change to the system everyone relies on and becomes what it should have been all
along: a small, separately built, separately reviewed piece of code.
