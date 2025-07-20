import React from 'react';
import { Code, Server, ExternalLink } from 'lucide-react';
import { 
  SiReact, 
  SiNodedotjs, 
  SiTypescript, 
  SiExpress, 
  SiTailwindcss, 
  SiPostgresql, 
  SiPrisma, 
  SiDocker,
  SiRedis,
} from 'react-icons/si';
import { MotionDiv, MotionA, MotionSection, MotionP } from '../common/MotionWrapper';


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
    { name: 'Redis', icon: SiRedis },
  ];

  return (
    <MotionSection 
      className="py-16 border-t border-gray-200"
      variants={sectionVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Made with love - Centered and minimal */}
        <MotionDiv className="text-center mb-12" variants={itemVariant}>
          <MotionP className="text-gray-600 mb-8" variants={itemVariant}>
            Made with <span className="text-red-500">❤️</span> by OpenLearn Tech Team
          </MotionP>
          
          {/* Technology Stack - Minimal horizontal list */}
          <MotionDiv 
            className="flex flex-wrap justify-center gap-6 mb-8"
            variants={itemVariant}
          >
            {techStack.map((tech, index) => {
              const IconComponent = tech.icon;
              return (
                <MotionDiv 
                  key={index}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors duration-200"
                  title={tech.name}
                  variants={techVariant}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconComponent className="text-lg" />
                  <span>{tech.name}</span>
                </MotionDiv>
              );
            })}
          </MotionDiv>

          {/* Action buttons - Minimal and balanced */}
          <MotionDiv 
            className="flex justify-center gap-4"
            variants={itemVariant}
          >
            <MotionA 
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
            </MotionA>
            <MotionA 
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
            </MotionA>
          </MotionDiv>
        </MotionDiv>
      </div>
    </MotionSection>
  );
};

export default Note;