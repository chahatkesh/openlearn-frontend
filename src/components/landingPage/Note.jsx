import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Code, Server, ExternalLink, Database, Cloud, Container } from 'lucide-react';

const Note = () => {
  // State to track if element is in viewport for animation
  const [isVisible, setIsVisible] = useState(false);
  // Technology stack information
  const techStack = [
    { name: 'React.js', icon: '⚛️', color: 'text-blue-500' },
    { name: 'Node.js', icon: '🟢', color: 'text-green-500' },
    { name: 'TypeScript', icon: '🔷', color: 'text-blue-600' },
    { name: 'Express', icon: '🚀', color: 'text-gray-600' },
    { name: 'Tailwind CSS', icon: '🎨', color: 'text-cyan-500' },
    { name: 'PostgreSQL', icon: '🐘', color: 'text-blue-700' },
    { name: 'Prisma', icon: '🔺', color: 'text-gray-700' },
    { name: 'Docker', icon: '🐳', color: 'text-blue-500' },
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
      className={`py-16 transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {/* Enhanced horizontal divider */}
      <div className="max-w-6xl mx-auto px-4 mb-12">
        <div className="relative">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          <div className="absolute inset-0 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent opacity-50"></div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 max-w-4xl">        <div className="text-center mb-8">
          {/* Technology Stack */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-600 mb-4">Built With</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {techStack.map((tech, index) => (
                <div 
                  key={index}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border rounded-full text-xs font-medium text-gray-600 hover:shadow-md transition-all duration-200 hover:scale-105"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span className="text-sm">{tech.icon}</span>
                  <span>{tech.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Developer Section */}
        <div className="text-center mb-8">
          <div className="text-sm text-gray-500 leading-relaxed mb-6">
            <p className="mb-2">Developed and maintained by members of the OpenLearn community</p>
            <div className="flex flex-wrap justify-center gap-6 mt-4">
              {developers.map((dev, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-3 p-3 bg-white rounded-lg border hover:shadow-md transition-all duration-200 hover:scale-105"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {dev.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="text-left">
                    <span className="font-medium text-gray-700 text-sm block">{dev.name}</span>
                    <div className="flex gap-2 mt-1">
                      <a 
                        href={dev.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-gray-400 hover:text-[#0077B5] transition-colors"
                        aria-label={`${dev.name}'s LinkedIn`}
                      >
                        <Linkedin size={14} />
                      </a>
                      <a 
                        href={dev.github} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-700 transition-colors"
                        aria-label={`${dev.name}'s GitHub`}
                      >
                        <Github size={14} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Enhanced Open Source Badge */}
        <div className="text-center">
          <a 
            href="https://github.com/openlearnnitj/openlearn-frontend" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-105 group"
          >
            <Code size={16} className="group-hover:rotate-12 transition-transform duration-200" />
            <span>Open Source</span>
            <ExternalLink size={14} className="group-hover:translate-x-0.5 transition-transform duration-200" />
          </a>
          
          {/* Additional links */}
          <div className="mt-4 flex justify-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Cloud size={12} />
              Hosted on Render & GCP
            </span>
            <span className="flex items-center gap-1">
              <Container size={12} />
              Containerized with Docker
            </span>
            <span className="flex items-center gap-1">
              <Database size={12} />
              Powered by PostgreSQL
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Note;