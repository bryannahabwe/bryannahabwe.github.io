/* Change this file to get your personal Porfolio */

// Website related settings
const settings = {
  isSplash: false, // Change this to false if you don't want Splash screen.
};

//SEO Related settings
const seo = {
  title: "Brian's Portfolio",
  description:
    "Detail-oriented Software Engineer with over five years of experience in designing, developing, and implementing software solutions. Skilled in various programming languages and technologies, with a strong ability to solve problems and collaborate with cross-functional teams.",
  og: {
    title: "Nahabwe Brian Portfolio",
    type: "website",
    url: "https://bryannahabwe.github.io/",
  },
};

//Home Page
const greeting = {
  title: "Nahabwe Brian",
  logo_name: "NahabweBrian",
  nickname: "The Sasaki",
  subTitle:
    "Detail-oriented Software Engineer with over five years of experience in designing, developing, and implementing software solutions. Skilled in various programming languages and technologies, with a strong ability to solve problems and collaborate with cross-functional teams.",
  resumeLink:
    "https://drive.google.com/file/d/1Nmnc3s7Jvfuphh33D49PgP9Lk5azJ2gZ/view?usp=sharing",
  portfolio_repository:
    "https://github.com/bryannahabwe/cb-sacco-management-system",
  githubProfile: "https://github.com/bryannahabwe",
};

const socialMediaLinks = [
  {
    name: "Github",
    link: "https://github.com/bryannahabwe",
    fontAwesomeIcon: "fa-github", // Reference https://fontawesome.com/icons/github?style=brands
    backgroundColor: "#181717", // Reference https://simpleicons.org/?q=github
  },
  {
    name: "LinkedIn",
    link: "https://www.linkedin.com/in/nahabwe-brian-aaa790ba/",
    fontAwesomeIcon: "fa-linkedin-in", // Reference https://fontawesome.com/icons/linkedin-in?style=brands
    backgroundColor: "#0077B5", // Reference https://simpleicons.org/?q=linkedin
  },
  {
    name: "Gmail",
    link: "mailto:nahabwebrian@gmail.com",
    fontAwesomeIcon: "fa-google", // Reference https://fontawesome.com/icons/google?style=brands
    backgroundColor: "#D14836", // Reference https://simpleicons.org/?q=gmail
  },
  {
    name: "X-Twitter",
    link: "https://twitter.com/nahabwebryn",
    fontAwesomeIcon: "fa-x-twitter", // Reference https://fontawesome.com/icons/x-twitter?f=brands&s=solid
    backgroundColor: "#000000", // Reference https://simpleicons.org/?q=x
  },
];

const skills = {
  data: [
    {
      title: "Backend Development",
      fileName: "FullStackImg",
      skills: [
        "⚡ Building scalable backend platforms/systems",
        "⚡ Developing mobile applications using Flutter and solo android apps using Kotlin",
        "⚡ Creating application backend in Spring, Java, Python, Express, Django & FastAPI",
      ],
      softwareSkills: [
        {
          skillName: "Python",
          fontAwesomeClassname: "simple-icons:python",
          style: {
            color: "#E34F26",
          },
        },
        {
          skillName: "Java",
          fontAwesomeClassname: "logos-java",
          style: {
            color: "#1572B6",
          },
        },
        {
          skillName: "JavaScript",
          fontAwesomeClassname: "simple-icons:javascript",
          style: {
            backgroundColor: "#000000",
            color: "#F7DF1E",
          },
        },
        {
          skillName: "NodeJS",
          fontAwesomeClassname: "logos-nodejs-icon-alt",
          style: {
            color: "#339933",
          },
        },
        {
          skillName: "MySQL",
          fontAwesomeClassname: "simple-icons:mysql",
          style: {
            color: "#663399",
          },
        },
        {
          skillName: "Flutter",
          fontAwesomeClassname: "simple-icons:flutter",
          style: {
            color: "#02569B",
          },
        },
      ],
    },
    {
      title: "Cloud Infra-Architecture",
      fileName: "CloudInfraImg",
      skills: [
        "⚡ Experience working on multiple cloud platforms",
        "⚡ Hosting and maintaining websites on virtual machine instances along with integration of databases",
      ],
      softwareSkills: [
        {
          skillName: "Digital Ocean",
          fontAwesomeClassname: "simple-icons:digitalocean",
          style: {
            color: "#4285F4",
          },
        },
        {
          skillName: "AWS",
          fontAwesomeClassname: "simple-icons:amazonaws",
          style: {
            color: "#FF9900",
          },
        },
        {
          skillName: "Firebase",
          fontAwesomeClassname: "simple-icons:firebase",
          style: {
            color: "#FFCA28",
          },
        },
        {
          skillName: "PostgreSQL",
          fontAwesomeClassname: "simple-icons:postgresql",
          style: {
            color: "#336791",
          },
        },
        {
          skillName: "MongoDB",
          fontAwesomeClassname: "simple-icons:mongodb",
          style: {
            color: "#47A248",
          },
        },
        {
          skillName: "Docker",
          fontAwesomeClassname: "simple-icons:docker",
          style: {
            color: "#1488C6",
          },
        },
        {
          skillName: "Kubernetes",
          fontAwesomeClassname: "simple-icons:kubernetes",
          style: {
            color: "#326CE5",
          },
        },
      ],
    },
  ],
};

// Education Page
const competitiveSites = {
  competitiveSites: [
    {
      siteName: "HackerRank",
      iconifyClassname: "simple-icons:hackerrank",
      style: {
        color: "#2EC866",
      },
      profileLink: "https://www.hackerrank.com/profile/briannahabwe",
    },
    {
      siteName: "Hackerearth",
      iconifyClassname: "simple-icons:hackerearth",
      style: {
        color: "#323754",
      },
      profileLink: "https://www.hackerearth.com/@nahabwe1",
    },
    {
      siteName: "Kaggle",
      iconifyClassname: "simple-icons:kaggle",
      style: {
        color: "#20BEFF",
      },
      profileLink: "https://www.kaggle.com/nahabwebrian",
    },
  ],
};

const degrees = {
  degrees: [
    {
      title: "Makerere University, Kampala, Uganda",
      subtitle: "Bsc in Software Engineering",
      logo_path: "makerere.png",
      alt_name: "Makerere University",
      duration: "2013 - 2017",
      descriptions: [
        "⚡ I have studied basic software engineering subjects like DS, Algorithms, DBMS etc.",
        "⚡ Apart from this, I have done courses on Spring, Java, Data Science, Data Visualisation and Full Stack Development.",
      ],
      website_link: "https://www.mak.ac.ug/",
    },
  ],
};

const certifications = {
  certifications: [
    {
      title: "Python",
      subtitle: "- From Kaggle",
      logo_path: "Kaggle_logo.png",
      certificate_link:
        "https://www.kaggle.com/learn/certification/nahabwebrian/intro-to-programming",
      alt_name: "Kaggle",
      color_code: "#8C151599",
    },
    {
      title: "Spring Boot",
      subtitle: "- From Amigos",
      logo_path: "amigos.png",
      certificate_link: "https://app.amigoscode.com/courses/267273/certificate",
      alt_name: "deeplearning.ai",
      color_code: "#00000099",
    },
    {
      title: "SQL",
      subtitle: "- From Kaggle",
      logo_path: "Kaggle_logo.png",
      certificate_link:
        "https://www.kaggle.com/learn/certification/nahabwebrian/intro-to-sql",
      alt_name: "Kaggle",
      color_code: "#D83B0199",
    },
  ],
};

// Experience Page
const experience = {
  title: "Experience",
  subtitle: "Work, Internship and Volunteership",
  description:
    "I have worked with many evolving startups as Software Developer, Engineer and Data Analyst.",
  header_image_path: "experience.svg",
  sections: [
    {
      title: "Work",
      work: true,
      experiences: [
        {
          title: "Software Engineer",
          company: "XENO Investment",
          company_url: "https://myxeno.com/",
          logo_path: "xeno_logo.png",
          duration: "April 2022 - Present",
          location: "Kampala, Uganda",
          description: "I am working on finance products.",
          color: "#0879bf",
        },
        {
          title: "Software Developer",
          company: "Omnitech LTD",
          company_url: "https://omnitech.co.ug/",
          logo_path: "omnitech_logo.png",
          duration: "Jan 2018 - March 2022",
          location: "Kampala, Uganda",
          description: "",
          color: "#9b1578",
        },
      ],
    },
    {
      title: "Internships",
      experiences: [
        {
          title: "Software Developer",
          company: "WIMEA-ICT.",
          company_url: "https://wimea-ict.net/",
          logo_path: "wimea_logo.png",
          duration: "May 2017 - Aug 2017",
          location: "Kampala, Uganda",
          description: "",
          color: "#000000",
        },
      ],
    },
  ],
};

// Projects Page
const projectsHeader = {
  title: "Projects",
  description:
    "My projects makes use of vast variety of latest technology tools. My best experience is to create Web Application projects and deploy them to web applications using cloud infrastructure.",
  avatar_image_path: "projects_image.svg",
};

// Contact Page
const contactPageData = {
  contactSection: {
    title: "Contact Me",
    profile_image_path: "nahabwe.jpg",
    description:
      "I am available on almost every social media. You can message me, I will reply within 24 hours. I can help you with Spring Boot, Java, Python, Groovy, MYSQL, Flutter, Cloud and Opensource Development.",
  },
  addressSection: {
    title: "Address",
    subtitle: "Sebagala Road, Kisasi, Kampala Uganda",
    locality: "Kisasi",
    country: "UG",
    region: "Central",
    postalCode: "",
    streetAddress: "Sebagala Road",
    avatar_image_path: "address_image.svg",
    location_map_link: "https://maps.app.goo.gl/hP1DnrpQkUZNjZtz8",
  },
  phoneSection: {
    title: "",
    subtitle: "",
  },
};

export {
  settings,
  seo,
  greeting,
  socialMediaLinks,
  skills,
  competitiveSites,
  degrees,
  certifications,
  experience,
  projectsHeader,
  contactPageData,
};
