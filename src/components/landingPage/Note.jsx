import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Code } from 'lucide-react';

const Note = () => {
  // State to track if element is in viewport for animation
  const [isVisible, setIsVisible] = useState(false);

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
      className={`py-12 transition-opacity duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Horizontal divider */}
      <div className="max-w-4xl mx-auto px-4 mb-8">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <div className="inline-block mb-5">
          <span className="inline-flex items-center text-sm font-medium text-gray-500">
            Made with <span className="text-red-500 mx-1">❤️</span> by OpenLearn Tech Team
          </span>
        </div>
        
        <div className="text-xs text-gray-400 leading-relaxed mb-5">
          <p>This landing page is built using React.js, Tailwind CSS,</p>
          <p>Developed and maintained by members of the OpenLearn:</p>
          <div className="flex flex-wrap justify-center gap-3 mt-3">
            {developers.map((dev, index) => (
              <div key={index} className="inline-flex items-center">
                <span className="font-medium text-gray-500">{dev.name}</span>
                <div className="flex ml-1.5 space-x-1">
                  <a 
                    href={dev.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-400 hover:text-[#0077B5] transition-colors"
                    aria-label={`${dev.name}'s LinkedIn`}
                  >
                    <Linkedin size={13} />
                  </a>
                  <a 
                    href={dev.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-700 transition-colors"
                    aria-label={`${dev.name}'s GitHub`}
                  >
                    <Github size={13} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Open Source Badge */}
        <a 
          href="https://github.com/openlearnnitj/openlearn-frontend" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex items-center px-3 py-1 text-xs font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
        >
          <Code size={12} className="mr-1" />
          Open Source
        </a>
      </div>
    </section>
  );
};

export default Note;