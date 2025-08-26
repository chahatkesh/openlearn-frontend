import { generateSequentialImages, getEventThumbnail } from '../utils/helpers/eventImageService.js';

// Helper function to create event with auto-generated paths
const createEvent = (eventData) => ({
  ...eventData,
  thumbnail: getEventThumbnail(eventData.id),
  images: generateSequentialImages(eventData.id) // Auto-detects up to 10 images
});

const eventsData = {
  events: [
    createEvent({
      id: 'accelerate-meet-1',
      title: 'Accelerate Program Meet',
      category: 'Accelerate Program',
      date: '2025-08-21',
      description: 'Initiated product determination, team formation guide for the Pioneers enrolled in the Accelerate Program.',
      featured: true,
      location: 'Science Block, NITJ'
    }),
    createEvent({
      id: 'openmic-1',
      title: 'OpenMic Session - Cohort 1.0',
      category: 'Cohort 1.0',
      date: '2025-08-15',
      description: 'Organized a fun session for the Pioneers of Cohort 1.0 after intense weekend of Capstone Project Submission Deadline.',
      featured: false,
      location: 'Community Hall, NITJ'
    }),
    createEvent({
      id: 'retreat-1',
      title: 'OpenLearn Cohort 1.0 Retreat',
      category: 'Cohort 1.0',
      date: '2025-07-31',
      description: 'Organized a retreat for Cohort 1.0 members, Launched the OpenLearn\'s Accelerate program.',
      featured: true,
      location: 'Science Block, NITJ'
    }),
    createEvent({
      id: 'build-along-sessions-1',
      title: 'Build Along Sessions',
      category: 'Cohort 1.0',
      date: '2025-07-27',
      description: 'Organized build along sessions for students struggling in Capstone Project. Helped them understand the process of building an ML Project, live with the experts.',
      featured: false,
      location: 'Online'
    }),
    createEvent({
      id: 'capstone-announcement-1',
      title: 'Capstone Project Announcement',
      category: 'Cohort 1.0',
      date: '2025-07-19',
      description: 'Briefed students about the Machine Learning Capstone project, explained them the methodology of working on Machine learning projects, deployment tasks and more.',
      featured: true,
      location: 'Online'
    }),
    createEvent({
      id: 'ml-mentorship-1',
      title: 'ML Mentorship Session',
      category: 'Cohort 1.0',
      date: '2025-06-21',
      description: 'Conducted the Machine Learning mentorship session for the cohort students. Mentored them through doubt resolutions, concept clarification, etc.',
      featured: false,
      location: 'Online'
    }),
    createEvent({
      id: 'cohort-orientation-1',
      title: 'Cohort 1.0 Orientation',
      category: 'Cohort 1.0',
      date: '2025-06-15',
      description: 'Conducted the first ever cohort orientation in online meetup, explained students about the fundamentals of Machine Learning, Finance and more. Made them aware about the process of learning.',
      featured: true,
      location: 'Online'
    }),
    createEvent({
      id: 'orientation-1',
      title: 'OpenLearn Orientation',
      category: 'Workshop',
      date: '2025-6-7',
      description: 'Conducted the first meet up with students to communicate the vision of OpenLearn initiative, upcoming cohorts, the cycle of OpenLearn.',
      featured: true,
      location: 'Online'
    })
  ]
};

export default eventsData;
