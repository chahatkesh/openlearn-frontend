import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Code, Server, ExternalLink } from 'lucide-react';
import { 
  SiReact, 
  SiNodedotjs, 
  SiTypescript, 
  SiExpress, 
  SiTailwindcss, 
  SiPostgresql, 
  SiPrisma, 
  SiDocker 
} from 'react-icons/si';

const Note = () => {
  // State to track if element is in viewport for animation
  const [isVisible, setIsVisible] = useState(false);

  // Technology stack information
  const techStack = [
    { name: 'React.js', icon: SiReact },
    { name: 'Node.js', icon: SiNodedotjs },
    { name: 'TypeScript', icon: SiTypescript },
    { name: 'Express', icon: SiExpress },
    { name: 'Tailwind CSS', icon: SiTailwindcss },
    { name: 'PostgreSQL', icon: SiPostgresql },
    { name: 'Prisma', icon: SiPrisma },
    { name: 'Docker', icon: SiDocker },
  ];

  // Developer information
  const developers = [
    {
      name: "Chahat Kesharwani",
      linkedin: "https://linkedin.com/in/chahatkesharwani",
      github: "https://github.com/chahatkesh"
    },
    {
      name: "Rishi Ahuja",
      linkedin: "https://linkedin.com/in/rishi-ahuja-b1a224310",
      github: "https://github.com/rishiahuja"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );
    
    const element = document.getElementById('note-section');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  return (
    <section 
      id="note-section" 
      className={`py-16 border-t border-gray-200 transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Made with love - Centered and minimal */}
        <div className="text-center mb-12">
          <p className="text-gray-600 mb-8">
            Made with <span className="text-red-500">❤️</span> by OpenLearn Tech Team
          </p>
          
          {/* Technology Stack - Minimal horizontal list */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            {techStack.map((tech, index) => {
              const IconComponent = tech.icon;
              return (
                <div 
                  key={index}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors duration-200"
                  title={tech.name}
                >
                  <IconComponent className="text-lg" />
                  <span>{tech.name}</span>
                </div>
              );
            })}
          </div>

          {/* Developers - Simple horizontal layout */}
          <div className="flex justify-center gap-8 mb-8">
            {developers.map((dev, index) => (
              <div key={index} className="text-center">
                <p className="text-sm font-medium text-gray-800 mb-2">{dev.name}</p>
                <div className="flex justify-center gap-3">
                  <a 
                    href={dev.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-400 hover:text-[#0077B5] transition-colors duration-200"
                    aria-label={`${dev.name}'s LinkedIn`}
                  >
                    <Linkedin size={18} />
                  </a>
                  <a 
                    href={dev.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-black transition-colors duration-200"
                    aria-label={`${dev.name}'s GitHub`}
                  >
                    <Github size={18} />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Action buttons - Minimal and balanced */}
          <div className="flex justify-center gap-4">
            <a 
              href={`${import.meta.env.VITE_API_BASE_URL}/status-page`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:border-gray-400 hover:text-black transition-all duration-200"
            >
              <Server size={16} />
              <span>Server Status</span>
              <ExternalLink size={14} />
            </a>
            
            <a 
              href="https://github.com/openlearnnitj/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200"
            >
              <Code size={16} />
              <span>Open Source</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Note;