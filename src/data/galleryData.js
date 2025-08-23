// Gallery Data for OpenLearn Events
// This file contains all gallery images organized by event categories

const galleryData = {
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
    {
      id: 'hackathon-1',
      title: 'OpenLearn Hackathon 2024',
      category: 'Hackathon',
      date: '2024-09-20',
      description: 'A 48-hour coding marathon where teams built innovative solutions to real-world problems.',
      thumbnail: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop&q=80',
      images: [
        {
          id: 'hack1-1',
          url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop&q=80',
          alt: 'Teams brainstorming during hackathon',
          caption: '48 hours of innovation and collaboration'
        },
        {
          id: 'hack1-2',
          url: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&h=600&fit=crop&q=80',
          alt: 'Late night coding session',
          caption: 'Burning the midnight oil for great ideas'
        },
        {
          id: 'hack1-3',
          url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop&q=80',
          alt: 'Final presentations and judging',
          caption: 'Presenting solutions to expert judges'
        },
        {
          id: 'hack1-4',
          url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop&q=80',
          alt: 'Winning team celebration',
          caption: 'Celebrating the winning team'
        }
      ],
      featured: true,
      location: 'NIT Jalandhar Main Auditorium'
    },
    {
      id: 'study-group-1',
      title: 'Data Structures Study Session',
      category: 'Study Group',
      date: '2024-08-10',
      description: 'Weekly study group focusing on mastering data structures and algorithms through collaborative learning.',
      thumbnail: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&h=300&fit=crop&q=80',
      images: [
        {
          id: 'sg1-1',
          url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&h=600&fit=crop&q=80',
          alt: 'Students solving algorithm problems',
          caption: 'Tackling complex algorithm challenges together'
        },
        {
          id: 'sg1-2',
          url: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=800&h=600&fit=crop&q=80',
          alt: 'Whiteboard session explaining tree structures',
          caption: 'Visual learning with whiteboard explanations'
        }
      ],
      featured: false,
      location: 'Library Study Room'
    },
    {
      id: 'guest-lecture-1',
      title: 'Industry Expert Talk on AI/ML',
      category: 'Guest Lecture',
      date: '2024-07-25',
      description: 'Renowned AI researcher shared insights on the future of machine learning and its applications.',
      thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop&q=80',
      images: [
        {
          id: 'gl1-1',
          url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop&q=80',
          alt: 'Expert delivering presentation on AI trends',
          caption: 'Learning from industry leaders'
        },
        {
          id: 'gl1-2',
          url: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&h=600&fit=crop&q=80',
          alt: 'Q&A session with students',
          caption: 'Interactive discussion with the expert'
        },
        {
          id: 'gl1-3',
          url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=600&fit=crop&q=80',
          alt: 'Students networking after the session',
          caption: 'Networking and knowledge sharing'
        }
      ],
      featured: true,
      location: 'NIT Jalandhar Lecture Hall'
    },
    {
      id: 'project-showcase-1',
      title: 'Student Project Showcase',
      category: 'Showcase',
      date: '2024-06-15',
      description: 'Students presented their innovative projects and prototypes to peers and faculty members.',
      thumbnail: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&h=300&fit=crop&q=80',
      images: [
        {
          id: 'ps1-1',
          url: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&h=600&fit=crop&q=80',
          alt: 'Student demonstrating mobile app',
          caption: 'Showcasing innovative mobile applications'
        },
        {
          id: 'ps1-2',
          url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=600&fit=crop&q=80',
          alt: 'IoT project demonstration',
          caption: 'Hands-on IoT project demonstrations'
        },
        {
          id: 'ps1-3',
          url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop&q=80',
          alt: 'Panel of judges evaluating projects',
          caption: 'Expert evaluation and feedback'
        }
      ],
      featured: false,
      location: 'NIT Jalandhar Exhibition Hall'
    }
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

export default galleryData;
