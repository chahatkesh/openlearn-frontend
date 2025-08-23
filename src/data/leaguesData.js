// Leagues Data for OpenLearn Platform
// This file contains all league information with covers and details

const leaguesData = {
  leagues: [
    {
      id: 'finance',
      name: 'Finance',
      title: 'Finance League',
      description: 'Master financial literacy, investment strategies, and economic principles through hands-on learning.',
      cover: '/leagues/finance-cover.jpg',
      color: '#10B981', // Green
      topics: ['Investment Banking', 'Portfolio Management', 'Financial Analysis', 'Risk Management']
    },
    {
      id: 'quantum',
      name: 'Quantum',
      title: 'Quantum Computing League',
      description: 'Dive into quantum computing, quantum algorithms, and the future of computational science.',
      cover: '/leagues/quantum-cover.jpg',
      color: '#8B5CF6', // Purple
      topics: ['Quantum Algorithms', 'Quantum Mechanics', 'Qiskit Programming', 'Quantum Cryptography']
    },
    {
      id: 'ml',
      name: 'ML',
      title: 'Machine Learning League',
      description: 'Explore machine learning algorithms, deep learning, and AI applications in real-world projects.',
      cover: '/leagues/ml-cover.jpg',
      color: '#3B82F6', // Blue
      topics: ['Neural Networks', 'Computer Vision', 'NLP', 'MLOps']
    },
    {
      id: 'soft-skills',
      name: 'Soft Skills',
      title: 'Soft Skills League',
      description: 'Develop communication, leadership, and interpersonal skills essential for professional success.',
      cover: '/leagues/soft-skills-cover.jpg',
      color: '#F59E0B', // Amber
      topics: ['Communication', 'Leadership', 'Team Management', 'Public Speaking']
    },
    {
      id: 'competitive-programming',
      name: 'Competitive Programming',
      title: 'Competitive Programming League',
      description: 'Sharpen your algorithmic thinking and problem-solving skills through competitive coding challenges.',
      cover: '/leagues/cp-cover.jpg',
      color: '#EF4444', // Red
      topics: ['Data Structures', 'Algorithms', 'Dynamic Programming', 'Graph Theory']
    },
    {
      id: 'iot',
      name: 'IoT',
      title: 'Internet of Things League',
      description: 'Build connected devices and smart systems using IoT technologies and embedded programming.',
      cover: '/leagues/iot-cover.jpg',
      color: '#06B6D4', // Cyan
      topics: ['Arduino Programming', 'Sensor Integration', 'Cloud Connectivity', 'Smart Systems']
    }
  ]
};

export default leaguesData;
