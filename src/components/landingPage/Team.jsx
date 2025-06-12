import React from 'react';
import { Linkedin, Twitter, Crown, Star, Users } from 'lucide-react';

// Modern Team Member Card
const TeamMemberCard = ({ name, role, imageUrl, linkedin, twitter, level }) => {
  const getLevelStyles = () => {
    switch (level) {
      case 'grand':
        return {
          container: 'bg-gradient-to-br from-[#FFDE59] via-yellow-300 to-amber-300 p-4 shadow-lg hover:shadow-xl',
          image: 'w-16 h-16 ring-3 ring-black',
          nameSize: 'text-lg font-bold text-black',
          roleSize: 'text-sm text-gray-800',
          icon: <Crown size={16} className="text-black" />
        };
      case 'chief':
        return {
          container: 'bg-white p-4 shadow-md hover:shadow-lg border border-gray-200',
          image: 'w-14 h-14 ring-2 ring-[#FFDE59]',
          nameSize: 'text-base font-semibold text-gray-900',
          roleSize: 'text-sm text-gray-600',
          icon: <Star size={14} className="text-[#FFDE59]" />
        };
      default:
        return {
          container: 'bg-white p-3 shadow-sm hover:shadow-md border border-gray-100',
          image: 'w-12 h-12 ring-2 ring-gray-300',
          nameSize: 'text-sm font-medium text-gray-900',
          roleSize: 'text-xs text-gray-600',
          icon: <Users size={12} className="text-gray-500" />
        };
    }
  };

  const styles = getLevelStyles();

  return (
    <div className={`rounded-lg transition-all duration-300 hover:-translate-y-1 ${styles.container}`}>
      {/* Level indicator */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-1">
          {styles.icon}
          <span className={`text-xs font-medium ${level === 'grand' ? 'text-gray-800' : 'text-gray-500'}`}>
            {level === 'grand' ? 'Leader' : level === 'chief' ? 'Head' : 'Member'}
          </span>
        </div>
      </div>

      {/* Profile section */}
      <div className="text-center mb-3">
        <img
          src={imageUrl || `https://ui-avatars.com/api/?name=${name}&background=${level === 'grand' ? '000000' : 'FFDE59'}&color=${level === 'grand' ? 'FFDE59' : '000000'}&bold=true&size=128`}
          alt={name}
          className={`${styles.image} rounded-lg mx-auto mb-2 object-cover`}
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${name}&background=${level === 'grand' ? '000000' : 'FFDE59'}&color=${level === 'grand' ? 'FFDE59' : '000000'}&bold=true&size=128`;
          }}
        />
        <h3 className={styles.nameSize}>{name}</h3>
        <p className={styles.roleSize}>{role}</p>
      </div>

      {/* Details */}
      <div className="space-y-2">
        {/* Social Links */}
        {(linkedin || twitter) && (
          <div className="flex justify-center space-x-2 pt-2 border-t border-gray-200 border-opacity-50">
            {linkedin && (
              <a 
                href={linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`p-1.5 rounded-md transition-colors ${
                  level === 'grand'
                    ? 'bg-black bg-opacity-20 hover:bg-opacity-30 text-[#FFDE59] hover:text-yellow-500'
                    : 'bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600'
                }`}
              >
                <Linkedin size={14} />
              </a>
            )}
            {twitter && (
              <a 
                href={twitter} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`p-1.5 rounded-md transition-colors ${
                  level === 'grand'
                    ? 'bg-black bg-opacity-20 hover:bg-opacity-30 text-[#FFDE59] hover:text-yellow-500'
                    : 'bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-400'
                }`}
              >
                <Twitter size={14} />
              </a>
            )}
          </div>
        )}
      </div>
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
          linkedin: "https://linkedin.com/in/kunal",
          twitter: "https://x.com/kunal",
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
    <section id="team" className="py-16 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">
            Meet the Pathfinders
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Visionary leaders and dedicated team members driving OpenLearn's mission.
          </p>
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