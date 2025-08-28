import siteConfig from "@/content/siteConfig";
import { Linkedin, Github, Twitter, ExternalLink } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg">{siteConfig.fullName}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Full-stack web developer building modern applications with React, Next.js, and Node.js.
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Quick Links</h4>
            <div className="space-y-2 text-sm">
              <div><a href="/about" className="text-muted-foreground hover:text-foreground transition-colors">About</a></div>
              <div><a href="/services" className="text-muted-foreground hover:text-foreground transition-colors">Services</a></div>
              <div><a href="/projects" className="text-muted-foreground hover:text-foreground transition-colors">Portfolio</a></div>
              <div><a href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a></div>
            </div>
          </div>
          
          {/* Connect */}
          <div className="space-y-4">
            <h4 className="font-semibold">Let's Connect</h4>
            <div className="flex justify-center md:justify-start gap-4">
              <a 
                href={siteConfig.links.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm"
              >
                <Linkedin className="w-4 h-4" />
                <span className="hidden sm:inline">LinkedIn</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a 
                href={siteConfig.links.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a 
                href={siteConfig.links.twitter} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground">
              Available for projects • Response within 24h
            </p>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {year} {siteConfig.fullName} — Built with Next.js & TypeScript</p>
        </div>
      </div>
    </footer>
  );
}
