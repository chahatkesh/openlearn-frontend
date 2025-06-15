import React from 'react';
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
import { motion } from 'framer-motion';

const Note = () => {
  // Animation variants
  const sectionVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariant = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  const techVariant = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 }
    }
  };

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

  return (
    <motion.section 
      className="py-16 border-t border-gray-200"
      variants={sectionVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Made with love - Centered and minimal */}
        <motion.div className="text-center mb-12" variants={itemVariant}>
          <motion.p className="text-gray-600 mb-8" variants={itemVariant}>
            Made with <span className="text-red-500">❤️</span> by OpenLearn Tech Team
          </motion.p>
          
          {/* Technology Stack - Minimal horizontal list */}
          <motion.div 
            className="flex flex-wrap justify-center gap-6 mb-8"
            variants={itemVariant}
          >
            {techStack.map((tech, index) => {
              const IconComponent = tech.icon;
              return (
                <motion.div 
                  key={index}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors duration-200"
                  title={tech.name}
                  variants={techVariant}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconComponent className="text-lg" />
                  <span>{tech.name}</span>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Developers - Simple horizontal layout */}
          <motion.div 
            className="flex justify-center gap-8 mb-8"
            variants={itemVariant}
          >
            {developers.map((dev, index) => (
              <motion.div 
                key={index} 
                className="text-center"
                variants={techVariant}
                whileHover={{ y: -2 }}
              >
                <p className="text-sm font-medium text-gray-800 mb-2">{dev.name}</p>
                <div className="flex justify-center gap-3">
                  <motion.a 
                    href={dev.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-400 hover:text-[#0077B5] transition-colors duration-200"
                    aria-label={`${dev.name}'s LinkedIn`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Linkedin size={18} />
                  </motion.a>
                  <motion.a 
                    href={dev.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-black transition-colors duration-200"
                    aria-label={`${dev.name}'s GitHub`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Github size={18} />
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Action buttons - Minimal and balanced */}
          <motion.div 
            className="flex justify-center gap-4"
            variants={itemVariant}
          >
            <motion.a 
              href={`${import.meta.env.VITE_API_BASE_URL}/status-page`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:border-gray-400 hover:text-black transition-all duration-200"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <Server size={16} />
              <span>Server Status</span>
              <ExternalLink size={14} />
            </motion.a>
            
            <motion.a 
              href="https://github.com/openlearnnitj/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200"
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <Code size={16} />
              <span>Open Source</span>
              <ExternalLink size={14} />
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Note;