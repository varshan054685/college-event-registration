const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Event = require('./models/Event');

const UNSPLASH = {
  tech: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
  hack: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
  cultural: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
  sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
  workshop: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
  seminar: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
  music: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800',
  ai: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800',
};

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  await User.deleteMany({});
  await Event.deleteMany({});

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@college.edu',
    password: 'admin123',
    role: 'admin',
    college: 'Tech University',
  });

  await User.create({
    name: 'Alex Johnson',
    email: 'student@college.edu',
    password: 'student123',
    role: 'student',
    college: 'Tech University',
    year: '3rd',
  });

  const now = new Date();
  const future = (days) => new Date(now.getTime() + days * 86400000);

  const events = [
    {
      title: 'HackFest 2025 – 24hr Hackathon',
      description: 'The biggest hackathon of the year! Build innovative solutions in 24 hours. Compete across tracks: AI/ML, Web3, HealthTech, and FinTech. Top prizes worth ₹2,00,000 up for grabs. Form teams of 2-4 and bring your A-game.',
      shortDescription: 'Build. Innovate. Win. 24 hours. ₹2L prize pool.',
      category: 'Hackathon',
      date: future(15),
      endDate: future(16),
      venue: 'Main Auditorium & Tech Block',
      capacity: 200,
      price: 0,
      image: UNSPLASH.hack,
      tags: ['AI', 'Web3', 'HealthTech', 'FinTech', 'Prizes'],
      organizer: 'Computer Science Dept.',
      highlights: ['₹2L Prize Pool', 'Mentors from top MNCs', 'Free meals', 'Goodies for all'],
      status: 'upcoming',
      isFeatured: true,
      createdBy: admin._id,
    },
    {
      title: 'AI & Machine Learning Summit',
      description: 'A premier conference featuring keynotes from industry leaders, research paper presentations, and hands-on workshops. Topics include LLMs, Computer Vision, Reinforcement Learning, and AI Ethics.',
      shortDescription: 'Industry leaders. Research papers. Hands-on workshops.',
      category: 'Seminar',
      date: future(22),
      venue: 'Seminar Hall A, Block B',
      capacity: 300,
      price: 150,
      image: UNSPLASH.ai,
      tags: ['AI', 'ML', 'Deep Learning', 'LLMs'],
      organizer: 'AI Research Club',
      highlights: ['10+ industry speakers', 'Research showcase', 'Certificate of participation'],
      status: 'upcoming',
      isFeatured: true,
      createdBy: admin._id,
    },
    {
      title: 'Culturals 2025 – Annual Fest',
      description: 'The grandest cultural extravaganza of the year! Three days of non-stop entertainment with dance competitions, drama, music battles, stand-up comedy, and much more. Open to all colleges.',
      shortDescription: '3 days. 30+ events. Unlimited entertainment.',
      category: 'Cultural',
      date: future(30),
      endDate: future(32),
      venue: 'Open Air Theatre & College Grounds',
      capacity: 1000,
      price: 0,
      image: UNSPLASH.cultural,
      tags: ['Dance', 'Music', 'Drama', 'Comedy', 'Art'],
      organizer: 'Cultural Committee',
      highlights: ['Celebrity performance', 'Flash mob', 'Food stalls', 'Photo zone'],
      status: 'upcoming',
      isFeatured: true,
      createdBy: admin._id,
    },
    {
      title: 'Full-Stack Web Dev Workshop',
      description: 'A 2-day intensive workshop covering React, Node.js, MongoDB, and deployment. Hands-on projects, live coding sessions, and take-home assignments. Perfect for beginners and intermediates.',
      shortDescription: 'React + Node + MongoDB from scratch in 2 days.',
      category: 'Workshop',
      date: future(10),
      endDate: future(11),
      venue: 'Lab 301, CS Block',
      capacity: 50,
      price: 200,
      image: UNSPLASH.workshop,
      tags: ['React', 'Node.js', 'MongoDB', 'Web Dev'],
      organizer: 'WebDev Club',
      highlights: ['Hands-on projects', 'Certificate', 'GitHub portfolio boost'],
      status: 'upcoming',
      isFeatured: false,
      createdBy: admin._id,
    },
    {
      title: 'Inter-College Sports Fest',
      description: 'Annual sports championship featuring Cricket, Football, Basketball, Badminton, Athletics, and Chess. Represent your college and compete for the rolling trophy!',
      shortDescription: 'Cricket. Football. Basketball. Who wins the trophy?',
      category: 'Sports',
      date: future(20),
      endDate: future(25),
      venue: 'Sports Complex & Grounds',
      capacity: 500,
      price: 0,
      image: UNSPLASH.sports,
      tags: ['Cricket', 'Football', 'Basketball', 'Athletics'],
      organizer: 'Sports Committee',
      highlights: ['6 sports categories', 'Rolling trophy', 'Cash prizes', 'Medals'],
      status: 'upcoming',
      isFeatured: false,
      createdBy: admin._id,
    },
    {
      title: 'Technical Symposium – TechTalks',
      description: 'Paper presentations, project expos, coding contests, and technical quizzes. Categories: CSE, ECE, Mechanical, and Civil. Best paper awards and internship opportunities from sponsors.',
      shortDescription: 'Paper presentations. Coding contests. Internship opportunities.',
      category: 'Technical',
      date: future(18),
      venue: 'Multiple Halls, Academic Block',
      capacity: 400,
      price: 100,
      image: UNSPLASH.tech,
      tags: ['Paper Presentation', 'Project Expo', 'Coding', 'Quiz'],
      organizer: 'Technical Dept. Union',
      highlights: ['Best paper award', 'Internship offers', 'Tech expo', 'Quiz with prizes'],
      status: 'upcoming',
      isFeatured: false,
      createdBy: admin._id,
    },
    {
      title: 'Music Fiesta – Battle of Bands',
      description: 'Calling all musicians! Solo performances, duets, and band battles across genres — rock, folk, classical fusion, EDM, and more. Professional sound equipment and stage setup provided.',
      shortDescription: 'Solo acts. Band battles. Every genre welcome.',
      category: 'Cultural',
      date: future(8),
      venue: 'Open Air Stage',
      capacity: 300,
      price: 0,
      image: UNSPLASH.music,
      tags: ['Music', 'Bands', 'Performance', 'Live'],
      organizer: 'Music Club',
      highlights: ['Professional sound setup', 'Cash prizes', 'Live recording'],
      status: 'upcoming',
      isFeatured: false,
      createdBy: admin._id,
    },
    {
      title: 'Design Thinking & Innovation Lab',
      description: 'A one-day immersive workshop on human-centered design, prototyping, and innovation frameworks. Solve real-world problems using design thinking methodology with expert facilitators.',
      shortDescription: 'Think. Prototype. Innovate. In one day.',
      category: 'Workshop',
      date: future(5),
      venue: 'Innovation Hub, Ground Floor',
      capacity: 40,
      price: 300,
      image: UNSPLASH.workshop,
      tags: ['Design Thinking', 'Innovation', 'UX', 'Prototyping'],
      organizer: 'Innovation Cell',
      highlights: ['Expert facilitators', 'Prototyping kits', 'Certificate', 'Networking'],
      status: 'upcoming',
      isFeatured: false,
      createdBy: admin._id,
    },
  ];

  await Event.insertMany(events);
  console.log(`✅ Seeded ${events.length} events`);
  console.log('👤 Admin: admin@college.edu / admin123');
  console.log('👤 Student: student@college.edu / student123');

  await mongoose.disconnect();
  console.log('Done!');
}

seed().catch((e) => { console.error(e); process.exit(1); });
