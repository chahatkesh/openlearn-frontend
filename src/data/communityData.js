// Community Data for OpenLearn Platform
// This file contains team information for Community Page

const communityData = {
  chiefPathfinders: [
    {
      id: 'finance',
      name: 'Pratham Andotra',
      league: 'Finance',
      role: 'Finance Chief Pathfinder',
      color: '#10B981', // Green
      linkedin: ''
    },
    {
      id: 'quantum',
      name: 'Guransh Singh',
      league: 'Quantum Computing League',
      role: 'Quantum Chief Pathfinder',
      color: '#8B5CF6', // Purple
      linkedin: ''
    },
    {
      id: 'ml',
      name: 'Ratinderdeep Singh',
      league: 'ML',
      role: 'ML Chief Pathfinder',
      color: '#3B82F6', // Blue
      linkedin: ''
    },
    {
      id: 'soft-skills',
      name: 'Samridhi Saini',
      league: 'Soft Skills',
      role: 'Soft Skills Chief Pathfinder',
      color: '#F59E0B', // Amber
      linkedin: ''
    },
    {
      id: 'competitive-programming',
      name: 'Naman Singh',
      league: 'Competitive Programming',
      role: 'Competitive Programming Chief Pathfinder',
      color: '#EF4444', // Red
      linkedin: ''
    },
    {
      id: 'iot',
      name: 'Shikhar Shrivastav',
      league: 'IoT League',
      role: 'IoT Chief Pathfinder',
      color: '#06B6D4', // Cyan
      linkedin: ''
    }
  ],
  pathfinders: [
    // Finance Pathfinders
    {
      id: 'finance-1',
      name: 'Priya Gupta',
      league: 'Finance',
      role: 'Finance Pathfinder',
      color: '#10B981',
      linkedin: ''
    },
    // Quantum Computing League Pathfinders
    {
      id: 'quantum-1',
      name: 'Gursimarpreet Singh',
      league: 'Quantum Computing League',
      role: 'Quantum Pathfinder',
      color: '#8B5CF6',
      linkedin: ''
    },
    {
      id: 'quantum-2',
      name: 'Aryan Sinha',
      league: 'Quantum Computing League',
      role: 'Quantum Pathfinder',
      color: '#8B5CF6',
      linkedin: ''
    },
    {
      id: 'quantum-3',
      name: 'Akanshaa',
      league: 'Quantum Computing League',
      role: 'Quantum Pathfinder',
      color: '#8B5CF6',
      linkedin: ''
    },
    {
      id: 'quantum-4',
      name: 'Tanveer Singh',
      league: 'Quantum Computing League',
      role: 'Quantum Pathfinder',
      color: '#8B5CF6',
      linkedin: ''
    },
    {
      id: 'quantum-5',
      name: 'Harsh',
      league: 'Quantum Computing League',
      role: 'Quantum Pathfinder',
      color: '#8B5CF6',
      linkedin: ''
    },
    {
      id: 'quantum-6',
      name: 'Piyush',
      league: 'Quantum Computing League',
      role: 'Quantum Pathfinder',
      color: '#8B5CF6',
      linkedin: ''
    },
    // ML Pathfinders
    {
      id: 'ml-1',
      name: 'Samaira Wahi',
      league: 'ML',
      role: 'ML Pathfinder',
      color: '#3B82F6',
      linkedin: ''
    },
    // Soft Skills Pathfinders
    {
      id: 'soft-skills-1',
      name: 'Aman Gupta',
      league: 'Soft Skills',
      role: 'Soft Skills Pathfinder',
      color: '#F59E0B',
      linkedin: ''
    },
    // Competitive Programming Pathfinders
    {
      id: 'cp-1',
      name: 'Aryan Kumar',
      league: 'Competitive Programming',
      role: 'Competitive Programming Pathfinder',
      color: '#EF4444',
      linkedin: ''
    },
    // IoT League Pathfinders
    {
      id: 'iot-1',
      name: 'Kapil Singh',
      league: 'IoT League',
      role: 'IoT Pathfinder',
      color: '#06B6D4',
      linkedin: ''
    },
    {
      id: 'iot-2',
      name: 'Ansh Srivastav',
      league: 'IoT League',
      role: 'IoT Pathfinder',
      color: '#06B6D4',
      linkedin: ''
    },
    {
      id: 'iot-3',
      name: 'Irfan Khan',
      league: 'IoT League',
      role: 'IoT Pathfinder',
      color: '#06B6D4',
      linkedin: ''
    },
    {
      id: 'iot-4',
      name: 'Keshav Jindal',
      league: 'IoT League',
      role: 'IoT Pathfinder',
      color: '#06B6D4',
      linkedin: ''
    },
  ],
  stats: {
    activeLeagues: 5,
    chiefPathfinders: 5,
    pathfinders: 24,
    activeStudents: '200+'
  }
};

// Helper functions to count team members
const countChiefPathfinders = () => {
  return communityData.chiefPathfinders.length;
};

const countPathfinders = () => {
  return communityData.pathfinders.length;
};

const countActiveLeagues = () => {
  // Count unique leagues from chief pathfinders
  const uniqueLeagues = new Set(communityData.chiefPathfinders.map(chief => chief.league));
  return uniqueLeagues.size;
};

// Update stats dynamically
communityData.stats.chiefPathfinders = countChiefPathfinders();
communityData.stats.pathfinders = countPathfinders();
communityData.stats.activeLeagues = countActiveLeagues();

export default communityData;
