export interface ProjectImage {
  url: string;
  alt: string;
}

export interface ProjectLink {
  live?: string;
  github?: string;
  facebook?: string;
  instagram?: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  type: string;
  role: string;
  technologies: string[];
  features: string[];
  results?: string[];
  images: ProjectImage[];
  links: ProjectLink;
} 