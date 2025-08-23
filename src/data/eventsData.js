// Events Data for OpenLearn Platform
// This file contains all event information with images organized by categories

const eventsData = {
  events: [
    {
      id: 'workshop-1',
      title: 'Web Development Workshop',
      category: 'Workshop',
      date: '2024-10-15',
      description: 'A hands-on workshop where students learned modern web development techniques and built their first responsive websites.',
      thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop&q=80',
      images: [
        {
          id: 'ws1-1',
          url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop&q=80',
          alt: 'Students coding during web development workshop',
          caption: 'Students collaborating on their first web project'
        },
        {
          id: 'ws1-2', 
          url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=600&fit=crop&q=80',
          alt: 'Instructor explaining HTML concepts',
          caption: 'Learning HTML and CSS fundamentals'
        },
        {
          id: 'ws1-3',
          url: 'https://images.unsplash.com/photo-1515378791036-0648a814c963?w=800&h=600&fit=crop&q=80',
          alt: 'Group presentation of completed projects',
          caption: 'Presenting final web development projects'
        }
      ],
      featured: true,
      location: 'NIT Jalandhar Computer Lab'
    },
  ],

  // Simplified categories for filtering
  categories: [
    { id: 'all', name: 'All' },
    { id: 'workshop', name: 'Workshops' },
    { id: 'hackathon', name: 'Hackathons' },
    { id: 'study-group', name: 'Study Groups' },
    { id: 'guest-lecture', name: 'Talks' },
    { id: 'showcase', name: 'Showcases' }
  ]
};

export default eventsData;
