import { Mail, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 border-t bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold mb-2">Corposale</h3>
            <p className="text-muted-foreground">Idea Validation Prototype</p>
          </div>
          
          <div className="flex gap-4">
            <a
              href="mailto:contact@corposale.com"
              className="p-3 rounded-xl bg-card hover:bg-accent transition-smooth shadow-soft"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-card hover:bg-accent transition-smooth shadow-soft"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-card hover:bg-accent transition-smooth shadow-soft"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Corposale. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
