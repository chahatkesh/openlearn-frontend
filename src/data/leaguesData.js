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
      startingDate: '30 August 2025',
      facilitatedBy: 'Finnest NITJ',
      team: {
        chiefPathfinder: {
          name: 'Arjun Sharma',
          linkedin: 'https://linkedin.com/in/arjun-sharma-finance'
        },
        pathfinders: [
          {
            name: 'Priya Gupta',
            linkedin: 'https://linkedin.com/in/priya-gupta-finance'
          },
          {
            name: 'Rohit Kumar',
            linkedin: 'https://linkedin.com/in/rohit-kumar-finance'
          },
          {
            name: 'Sneha Patel',
            linkedin: 'https://linkedin.com/in/sneha-patel-finance'
          }
        ]
      }
    },
    {
      id: 'quantum',
      name: 'Quantum',
      title: 'Quantum Computing League',
      description: 'Dive into quantum computing, quantum algorithms, and the future of computational science.',
      cover: '/leagues/quantum-cover.jpg',
      color: '#8B5CF6', // Purple
      startingDate: '5 September 2025',
      facilitatedBy: 'QMania',
      team: {
        chiefPathfinder: {
          name: 'Dr. Vikram Singh',
          linkedin: 'https://linkedin.com/in/vikram-singh-quantum'
        },
        pathfinders: [
          {
            name: 'Ananya Joshi',
            linkedin: 'https://linkedin.com/in/ananya-joshi-quantum'
          },
          {
            name: 'Karan Mehta',
            linkedin: 'https://linkedin.com/in/karan-mehta-quantum'
          },
          {
            name: 'Riya Sharma',
            linkedin: 'https://linkedin.com/in/riya-sharma-quantum'
          },
          {
            name: 'Aditya Verma',
            linkedin: 'https://linkedin.com/in/aditya-verma-quantum'
          }
        ]
      }
    },
    {
      id: 'ml',
      name: 'ML',
      title: 'Machine Learning League',
      description: 'Explore machine learning algorithms, deep learning, and AI applications in real-world projects.',
      cover: '/leagues/ml-cover.jpg',
      color: '#3B82F6', // Blue
      startingDate: '2 September 2025',
      facilitatedBy: 'OpenLearn',
      team: {
        chiefPathfinder: {
          name: 'Chahat Kesharwani',
          linkedin: 'https://linkedin.com/in/chahat-kesharwani'
        },
        pathfinders: [
          {
            name: 'Samaira Wahi',
            linkedin: 'https://linkedin.com/in/samaira-wahi-ml'
          },
          {
            name: 'Vatsal Khanna',
            linkedin: 'https://linkedin.com/in/vatsal-khanna-ml'
          },
          {
            name: 'Rishi Ahuja',
            linkedin: 'https://linkedin.com/in/rishi-ahuja-ml'
          }
        ]
      }
    },
    {
      id: 'soft-skills',
      name: 'Soft Skills',
      title: 'Soft Skills League',
      description: 'Develop communication, leadership, and interpersonal skills essential for professional success.',
      cover: '/leagues/soft-skills-cover.jpg',
      color: '#F59E0B', // Amber
      startingDate: '28 August 2025',
      facilitatedBy: 'Zeal Society',
      team: {
        chiefPathfinder: {
          name: 'Neha Agarwal',
          linkedin: 'https://linkedin.com/in/neha-agarwal-soft-skills'
        },
        pathfinders: [
          {
            name: 'Aman Gupta',
            linkedin: 'https://linkedin.com/in/aman-gupta-soft-skills'
          },
          {
            name: 'Divya Singh',
            linkedin: 'https://linkedin.com/in/divya-singh-soft-skills'
          },
          {
            name: 'Harsh Bansal',
            linkedin: 'https://linkedin.com/in/harsh-bansal-soft-skills'
          }
        ]
      }
    },
    {
      id: 'competitive-programming',
      name: 'Competitive Programming',
      title: 'Competitive Programming League',
      description: 'Sharpen your algorithmic thinking and problem-solving skills through competitive coding challenges.',
      cover: '/leagues/cp-cover.jpg',
      color: '#EF4444', // Red
      startingDate: '1 September 2025',
      facilitatedBy: 'Coding Club',
      team: {
        chiefPathfinder: {
          name: 'Davinder Singh',
          linkedin: 'https://linkedin.com/in/davinder-singh-cp'
        },
        pathfinders: [
          {
            name: 'Aryan Kumar',
            linkedin: 'https://linkedin.com/in/aryan-kumar-cp'
          },
          {
            name: 'Simran Kaur',
            linkedin: 'https://linkedin.com/in/simran-kaur-cp'
          },
          {
            name: 'Naman Jain',
            linkedin: 'https://linkedin.com/in/naman-jain-cp'
          },
          {
            name: 'Pooja Sharma',
            linkedin: 'https://linkedin.com/in/pooja-sharma-cp'
          }
        ]
      }
    },
    {
      id: 'iot',
      name: 'IoT',
      title: 'Internet of Things League',
      description: 'Build connected devices and smart systems using IoT technologies and embedded programming.',
      cover: '/leagues/iot-cover.jpg',
      color: '#06B6D4', // Cyan
      startingDate: '7 September 2025',
      facilitatedBy: 'Electronics Society',
      team: {
        chiefPathfinder: {
          name: 'Rajesh Patel',
          linkedin: 'https://linkedin.com/in/rajesh-patel-iot'
        },
        pathfinders: [
          {
            name: 'Meera Joshi',
            linkedin: 'https://linkedin.com/in/meera-joshi-iot'
          },
          {
            name: 'Akash Gupta',
            linkedin: 'https://linkedin.com/in/akash-gupta-iot'
          },
          {
            name: 'Kavya Reddy',
            linkedin: 'https://linkedin.com/in/kavya-reddy-iot'
          }
        ]
      }
    }
  ]
};

export default leaguesData;
