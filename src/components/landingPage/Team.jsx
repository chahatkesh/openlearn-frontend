import React from 'react';
import { Crown, Star, Users } from 'lucide-react';
import { FaLinkedinIn, FaXTwitter, FaInstagram } from 'react-icons/fa6';

// Modern Team Member Card with Enhanced UI/UX
const TeamMemberCard = ({ name, role, imageUrl, linkedin, twitter, instagram, level }) => {
  const getLevelStyles = () => {
    switch (level) {
      case 'grand':
        return {
          container: 'bg-gradient-to-br from-[#FFDE59] via-yellow-300 to-amber-400 p-6 shadow-md hover:shadow-lg border-2 border-yellow-400 hover:border-yellow-500 transform hover:-translate-y-2 hover:scale-[1.02] cursor-pointer transition-all duration-300 rounded-xl',
          image: 'w-24 h-24 ring-4 ring-black hover:ring-gray-800',
          nameSize: 'text-xl font-bold text-black mb-1',
          roleSize: 'text-sm font-semibold text-gray-800 mb-3',
          icon: <Crown size={20} className="text-black drop-shadow-sm" />,
          badge: 'bg-black text-[#FFDE59] px-3 py-1 text-xs font-bold rounded-full shadow-lg',
          socialContainer: 'bg-yellow-100 rounded-lg p-3 mt-4'
        };
      case 'chief':
        return {
          container: 'bg-white p-5 shadow-md hover:shadow-lg border-2 border-gray-200 hover:border-[#FFDE59] rounded-xl transform hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300',
          image: 'w-20 h-20 ring-3 ring-[#FFDE59] hover:ring-yellow-400',
          nameSize: 'text-lg font-bold text-gray-900 mb-1',
          roleSize: 'text-sm font-medium text-gray-600 mb-3',
          icon: <Star size={18} className="text-[#FFDE59] drop-shadow-sm" />,
          badge: 'bg-[#FFDE59] text-black px-3 py-1 text-xs font-bold rounded-full shadow-md',
          socialContainer: 'bg-gray-50 rounded-lg p-3 mt-4'
        };
      default:
        return {
          container: 'bg-white p-4 border border-gray-200 hover:border-gray-300 rounded-lg transform hover:-translate-y-1 transition-all duration-300',
          image: 'w-16 h-16 ring-2 ring-gray-300 hover:ring-[#FFDE59]',
          nameSize: 'text-base font-semibold text-gray-900 mb-1',
          roleSize: 'text-sm text-gray-600 mb-3',
          icon: <Users size={16} className="text-gray-500" />,
          badge: 'bg-gray-100 text-gray-700 px-2 py-1 text-xs font-medium rounded-full',
          socialContainer: 'bg-gray-50 rounded-lg p-2 mt-3'
        };
    }
  };

  const styles = getLevelStyles();

  return (
    <div className={`rounded-xl transition-all duration-500 ease-out group ${styles.container}`}>
      {/* Profile Section */}
      <div className="text-center my-4">
        <div className="relative inline-block mb-3">
          <img
            src={imageUrl || `https://ui-avatars.com/api/?name=${name}&background=${level === 'grand' ? '000000' : 'FFDE59'}&color=${level === 'grand' ? 'FFDE59' : '000000'}&bold=true&size=128`}
            alt={name}
            className={`${styles.image} rounded-lg mx-auto object-cover transition-all duration-300 group-hover:brightness-110`}
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${name}&background=${level === 'grand' ? '000000' : 'FFDE59'}&color=${level === 'grand' ? 'FFDE59' : '000000'}&bold=true&size=128`;
            }}
          />
          {/* Online indicator */}
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${level === 'grand' ? 'bg-green-500' : level === 'chief' ? 'bg-blue-500' : 'bg-gray-400'} shadow-lg`}></div>
        </div>
        
        <h3 className={`${styles.nameSize} transition-colors duration-300 group-hover:text-opacity-80`}>
          {name}
        </h3>
        <p className={styles.roleSize}>
          {role}
        </p>
      </div>

      {/* Social Links */}
      {(linkedin || twitter || instagram) && (
        <div className={styles.socialContainer}>
          <div className="flex justify-center space-x-3">
            {linkedin && (
              <a 
                href={linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`group/social flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 transform hover:scale-110 ${
                  level === 'grand'
                    ? 'bg-white hover:bg-blue-600 text-gray-600 hover:text-white shadow-md border border-gray-200'
                    : level === 'chief'
                    ? 'bg-white hover:bg-blue-600 text-gray-600 hover:text-white shadow-md border border-gray-200'
                    : 'bg-white hover:bg-blue-600 text-gray-600 hover:text-white shadow-sm border border-gray-200'
                }`}
                title="LinkedIn Profile"
              >
                <FaLinkedinIn size={16} className="transition-transform duration-300 group-hover/social:scale-110" />
              </a>
            )}
            {twitter && (
              <a 
                href={twitter} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`group/social flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 transform hover:scale-110 ${
                  level === 'grand'
                    ? 'bg-white hover:bg-black text-gray-600 hover:text-white shadow-md border border-gray-200'
                    : level === 'chief'
                    ? 'bg-white hover:bg-black text-gray-600 hover:text-white shadow-md border border-gray-200'
                    : 'bg-white hover:bg-black text-gray-600 hover:text-white shadow-sm border border-gray-200'
                }`}
                title="X (Twitter) Profile"
              >
                <FaXTwitter size={16} className="transition-transform duration-300 group-hover/social:scale-110" />
              </a>
            )}
            {instagram && (
              <a 
                href={instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`group/social flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 transform hover:scale-110 ${
                  level === 'grand'
                    ? 'bg-white hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 text-gray-600 hover:text-white shadow-md border border-gray-200'
                    : level === 'chief'
                    ? 'bg-white hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 text-gray-600 hover:text-white shadow-md border border-gray-200'
                    : 'bg-white hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 text-gray-600 hover:text-white shadow-sm border border-gray-200'
                }`}
                title="Instagram Profile"
              >
                <FaInstagram size={16} className="transition-transform duration-300 group-hover/social:scale-110" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Hover effect overlay */}
      <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none ${
        level === 'grand' ? 'bg-black' : level === 'chief' ? 'bg-[#FFDE59]' : 'bg-gray-900'
      }`}></div>
    </div>
  );
};

const Team = () => {
  // Team data - organized hierarchically
  const grandPathfinder = {
    name: "Vatsal Khanna",
    role: "Grand Pathfinder",
    imageUrl: "https://pbs.twimg.com/profile_images/1903807740192923648/im6TgSDi_400x400.jpg",
    linkedin: "https://www.linkedin.com/in/vatsalkhanna/",
    twitter: "https://x.com/vatsalkhanna55",
  };

  const departments = [
    {
      name: "Finance",
      chief: {
        name: "Rhythm Goyal",
        role: "Chief Finance Pathfinder",
        imageUrl: "https://pbs.twimg.com/profile_images/1912483598835261440/sn7EUmiA_400x400.jpg",
        linkedin: "https://www.linkedin.com/in/rhythm-goyal-a14a53263/",
        twitter: "https://x.com/RhythmGoyal90",
      },
      team: [
        {
          name: "Pratham",
          role: "Finance Pathfinder",
          imageUrl: "https://media.licdn.com/dms/image/v2/D4D03AQFgxvkhODCGCw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1687340486079?e=1755129600&v=beta&t=0ONStROffU6T6lRBcXlKTPoYzBRZovHHiXzh3B-HV-0",
          linkedin: "https://www.linkedin.com/in/prathamandotra/",
          twitter: "https://x.com/thisisPrathamA",
        },
        {
          name: "Tanveer",
          role: "Finance Pathfinder",
          imageUrl: "https://example.com/tanveer.jpg",
          linkedin: "",
          twitter: "",
        }
      ]
    },
    {
      name: "AI",
      chief: {
        name: "Ratinderdeep Singh",
        role: "Chief AI Pathfinder",
        imageUrl: "https://pbs.twimg.com/profile_images/1872598069209903104/5oF9lITe_400x400.jpg",
        linkedin: "https://www.linkedin.com/in/ratinderdeepsingh/",
        twitter: "https://x.com/Ratinder_999",
      },
      team: [
        {
          name: "Adesh",
          role: "AI Pathfinder",
          imageUrl: "https://media.licdn.com/dms/image/v2/D5635AQFPFG3L2CG6fA/profile-framedphoto-shrink_800_800/B56ZacRdGUG4Ak-/0/1746378546937?e=1750327200&v=beta&t=vQNjTfZf4A8ehuLfzX13hqFJ09_9GFog92OKzIcRcXI",
          linkedin: "https://www.linkedin.com/in/adesh-anurag-176a44254/",
          twitter: "https://x.com/adexxhhh",
        },
        {
          name: "Kunal",
          role: "AI Pathfinder",
          imageUrl: "https://example.com/kunal.jpg",
          linkedin: "",
          twitter: "",
        },
        {
          name: "Achintya",
          role: "AI Pathfinder",
          imageUrl: "https://media.licdn.com/dms/image/v2/D4D35AQGPp7GSbCZKKg/profile-framedphoto-shrink_800_800/B4DZbu_CP1H8Ag-/0/1747766224218?e=1750327200&v=beta&t=AmTyCDGeIf6qLFhFYeGQj2_84h-MFLWEoVyuoyYaxts",
          linkedin: "https://www.linkedin.com/in/achintyasharma47/",
          twitter: "",
        },
      ]
    },
    {
      name: "Creative",
      chief: {
        name: "Chahat Kesharwani",
        role: "Chief Creative Pathfinder",
        imageUrl: "https://pbs.twimg.com/profile_images/1912598869587730432/FDosdz9t_400x400.jpg",
        linkedin: "https://linkedin.com/in/chahatkesharwani",
        twitter: "https://x.com/chahatkesh",
        instagram: "https://instagram.com/chahat.kesharwanii",
      },
      team: [
        {
          name: "Rishi",
          role: "Creative Pathfinder",
          imageUrl: "https://media.licdn.com/dms/image/v2/D4E03AQG87n2sers9aA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1725363814807?e=1755129600&v=beta&t=9wo-YEMq1ekgXYrmJMpuS_eq9OimJs2NDU6kVMwiDNU",
          linkedin: "https://www.linkedin.com/in/rishi-ahuja-b1a224310/",
          twitter: "https://x.com/Rishi2220",
        },
        {
          name: "Achintya",
          role: "AI Pathfinder",
          imageUrl: "https://media.licdn.com/dms/image/v2/D4D35AQGPp7GSbCZKKg/profile-framedphoto-shrink_800_800/B4DZbu_CP1H8Ag-/0/1747766224218?e=1750327200&v=beta&t=AmTyCDGeIf6qLFhFYeGQj2_84h-MFLWEoVyuoyYaxts",
          linkedin: "https://www.linkedin.com/in/achintyasharma47/",
          twitter: "",
        },
      ]
    }
  ];

  return (
    <section id="team" className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-[#FFDE59] rounded-full opacity-5 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-[#FFDE59] to-yellow-300 rounded-full opacity-5 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gray-200 rounded-full opacity-10 blur-2xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        {/* Enhanced Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black leading-tight">
            Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFDE59] to-amber-500">Pathfinders</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Visionary leaders and dedicated team members driving OpenLearn's mission forward with passion and expertise.
          </p>
          <div className="mt-8 w-24 h-1 bg-gradient-to-r from-[#FFDE59] to-amber-500 mx-auto rounded-full"></div>
        </div>

        {/* Compact Hierarchy Layout */}
        <div className="space-y-10">
          {/* Level 1: Grand Pathfinder */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Crown size={18} className="text-[#FFDE59]" />
              <h3 className="text-xl font-bold text-gray-800">Grand Pathfinder</h3>
            </div>
            <div className="flex justify-center">
              <div className="w-full max-w-xs">
                <TeamMemberCard {...grandPathfinder} level="grand" />
              </div>
            </div>
          </div>

          {/* Level 2: Chief Pathfinders */}
          <div>
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Star size={18} className="text-[#FFDE59]" />
              <h3 className="text-xl font-bold text-gray-800">Chief Pathfinders</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {departments.map((dept, index) => (
                <TeamMemberCard key={index} {...dept.chief} level="chief" />
              ))}
            </div>
          </div>

          {/* Level 3: Department Teams */}
          <div className="space-y-6">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Users size={18} className="text-[#FFDE59]" />
              <h3 className="text-xl font-bold text-gray-800">Team Members</h3>
            </div>
            
            {(() => {
              // Sort departments by team size (smallest first)
              const sortedDepts = [...departments].sort((a, b) => a.team.length - b.team.length);
              
              // Function to calculate how many teams can fit in a row (max 4 members total)
              const getTeamsPerRow = (depts) => {
                const maxMembersPerRow = 4;
                let currentRow = [];
                let rows = [];
                let currentRowMemberCount = 0;
                
                for (let i = 0; i < depts.length; i++) {
                  const dept = depts[i];
                  const teamSize = dept.team.length;
                  
                  // Check if adding this team would exceed the 4-member limit
                  if (currentRowMemberCount + teamSize <= maxMembersPerRow) {
                    currentRow.push(i);
                    currentRowMemberCount += teamSize;
                  } else {
                    // Start a new row if current row has teams
                    if (currentRow.length > 0) {
                      rows.push([...currentRow]);
                    }
                    currentRow = [i];
                    currentRowMemberCount = teamSize;
                  }
                }
                
                // Add the last row if it has teams
                if (currentRow.length > 0) {
                  rows.push(currentRow);
                }
                
                return rows;
              };
              
              // Get team arrangement
              const teamRows = getTeamsPerRow(sortedDepts);
              
              return teamRows.map((rowIndices, rowIndex) => (
                <div key={rowIndex} className="grid gap-6" style={{
                  gridTemplateColumns: `repeat(${rowIndices.length}, 1fr)`
                }}>
                  {rowIndices.map((deptIndex) => {
                    const dept = sortedDepts[deptIndex];
                    const teamSize = dept.team.length;
                    
                    return (
                      <div key={dept.name} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="text-center mb-4">
                          <h4 className="text-base font-bold text-gray-800 mb-1">{dept.name} Team</h4>
                          <p className="text-xs text-gray-600">Led by {dept.chief.name}</p>
                        </div>
                        
                        <div className={`grid gap-3 ${
                          teamSize <= 2 ? 'grid-cols-2' :
                          teamSize <= 3 ? 'grid-cols-3' :
                          teamSize <= 4 ? 'grid-cols-2' :
                          'grid-cols-3'
                        }`}>
                          {dept.team.map((member, memberIndex) => (
                            <TeamMemberCard key={memberIndex} {...member} level="member" />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ));
            })()}
          </div>

          {/* Compact Statistics */}
          <div className="bg-black rounded-lg p-6 text-center">
            <div className="grid grid-cols-3 gap-6 text-[#FFDE59]">
              <div>
                <div className="text-2xl font-bold mb-1">
                  {1 + departments.reduce((acc, dept) => acc + dept.team.length + 1, 0)}
                </div>
                <div className="text-sm opacity-90">Total Members</div>
              </div>
              <div>
                <div className="text-2xl font-bold mb-1">{departments.length}</div>
                <div className="text-sm opacity-90">Departments</div>
              </div>
              <div>
                <div className="text-2xl font-bold mb-1">24/7</div>
                <div className="text-sm opacity-90">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Subtle Background Decorations */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFDE59] rounded-full -translate-y-1/2 translate-x-1/2 opacity-5"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gray-200 rounded-full translate-y-1/2 -translate-x-1/2 opacity-30"></div>
    </section>
  );
};

export default Team;