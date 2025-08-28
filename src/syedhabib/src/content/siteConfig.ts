import { Twitter, Github, Linkedin, Mail } from 'lucide-react';

interface SocialLink {
  name: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SiteConfig {
  shortName: string;
  fullName: string;
  title: string;
  description: string;
  url: string;
  email: string;
  location: string;
  links: {
    twitter: string;
    github: string;
    linkedin: string;
    email: string;
  };
  socialLinks: SocialLink[];
}

const siteConfig: SiteConfig = {
  shortName: "Syed",
  fullName: "Syed Habib",
  title: "Full-Stack Web Developer",
  description: "Full-stack web developer specializing in React, Next.js, and Node.js. Building modern, scalable web applications for businesses.",
  url: "https://syedhabib.com",
  email: "ahabibakik@gmail.com",
  location: "Dhaka, Bangladesh",
  links: {
    twitter: "https://twitter.com/ahsanhabibakik",
    github: "https://github.com/ahsanhabibakik",
    linkedin: "https://www.linkedin.com/comm/mynetwork/discovery-see-all?usecase=PEOPLE_FOLLOWS&followMember=ahsanhabibakik",
    email: "mailto:ahabibakik@gmail.com"
  },
  socialLinks: [
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/comm/mynetwork/discovery-see-all?usecase=PEOPLE_FOLLOWS&followMember=ahsanhabibakik",
      icon: Linkedin
    },
    {
      name: "GitHub",
      url: "https://github.com/ahsanhabibakik",
      icon: Github
    },
    {
      name: "Twitter",
      url: "https://twitter.com/ahsanhabibakik",
      icon: Twitter
    },
    {
      name: "Email",
      url: "mailto:ahabibakik@gmail.com",
      icon: Mail
    }
  ]
};

export default siteConfig;