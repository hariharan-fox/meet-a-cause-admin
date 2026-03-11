import type { Volunteer, Event, NGO, Testimonial, Certificate, Notification } from './types';
import { BookOpen, Sprout, HeartPulse, Users, ShieldCheck, Rocket, Star, Heart, Medal, Trophy, Gem, Crown, Zap, TrendingUp, Award, UserPlus } from 'lucide-react';

export const volunteer: Volunteer = {
  id: 'vol-1',
  name: 'Priya Sharma',
  email: 'priya.sharma@example.com',
  avatarUrl: 'avatar-priya-sharma',
  skills: ['Web Development', 'Graphic Design', 'Social Media'],
  interests: ['Education', 'Technology', 'Community Building'],
};

export const allNgos: NGO[] = [
  {
    id: 'ngo-1',
    name: 'Green Earth Foundation',
    logoUrl: 'ngo-green-earth',
    mission: 'To promote environmental conservation and sustainability through community-led initiatives and education.',
    location: 'Puducherry, India',
    cause: ['Environment', 'Education'],
    impact: 'Planted over 10,000 trees and educated 5,000+ students on environmental issues.',
    verificationStatus: 'verified',
    darpanId: 'PY/2023/0345678',
    panNumber: 'AAATG1234F'
  },
  {
    id: 'ngo-2',
    name: 'Hope Helpers',
    logoUrl: 'ngo-hope-helpers',
    mission: 'Providing food, shelter, and support to underprivileged communities and individuals in need.',
    location: 'Chennai, India',
    cause: ['Community', 'Health'],
    impact: 'Served over 50,000 meals and provided shelter to 200+ homeless individuals last year.',
    verificationStatus: 'pending',
    darpanId: 'TN/2022/0123456',
    panNumber: 'BBBTG5678K'
  },
  {
    id: 'ngo-3',
    name: 'Tech Forward',
    logoUrl: 'ngo-tech-forward',
    mission: 'Empowering youth with digital literacy and coding skills to bridge the technology gap.',
    location: 'Bangalore, India',
    cause: ['Education', 'Technology'],
    impact: 'Trained over 1,000 young adults in coding, with 60% securing jobs in the tech industry.',
    verificationStatus: 'unverified'
  },
  {
    id: 'ngo-4',
    name: 'Animal Allies',
    logoUrl: 'ngo-animal-allies',
    mission: 'Rescuing, rehabilitating, and rehoming stray and abandoned animals.',
    location: 'Puducherry, India',
    cause: ['Animals'],
    impact: 'Rescued over 500 animals and facilitated 300+ adoptions in the past two years.',
    verificationStatus: 'verified',
    darpanId: 'PY/2024/0009876',
    panNumber: 'CCCTG9101M'
  },
];

export const featuredNgos = allNgos.slice(0, 2);

export const allEvents: Event[] = [
  {
    id: 'evt-1',
    title: 'Annual Beach Cleanup Drive',
    ngoId: 'ngo-1',
    date: 'October 26, 2024',
    time: '8:00 AM - 12:00 PM',
    location: 'Promenade Beach, Puducherry',
    description: 'Join us for our biggest community event of the year! We will be cleaning up Promenade Beach to protect our marine life and keep our city beautiful. Gloves, bags, and refreshments will be provided.',
    why: 'Our beaches are vital ecosystems and a cherished part of our community\'s landscape. Plastic pollution and debris not only harm marine life like turtles and seabirds but also affect tourism and public health. Keeping our coastline clean is a shared responsibility that ensures a safer, healthier environment for everyone.',
    impact: 'By dedicating just a few hours of your time, you\'ll directly contribute to removing hundreds of kilograms of harmful waste from the ocean. Your participation helps protect vulnerable marine species, raises community awareness about pollution, and sets a powerful example for others to follow, creating a ripple effect of positive change.',
    skills: ['Teamwork', 'Environmental Awareness'],
    imageUrl: 'event-beach-cleanup',
    cause: 'Environment',
  },
  {
    id: 'evt-2',
    title: 'Weekend Food Donation Sorting',
    ngoId: 'ngo-2',
    date: 'November 2, 2024',
    time: '10:00 AM - 2:00 PM',
    location: 'Hope Helpers Warehouse, Chennai',
    description: 'We need volunteers to help sort and package food donations for distribution to local shelters and families in need. A great way to spend a few hours making a direct impact.',
    why: 'Food insecurity is a pressing issue in our community. By ensuring that surplus food reaches those who need it most, we can reduce waste and provide essential nutrition to families, children, and the elderly facing hardship.',
    impact: 'Your help in sorting and packing donations ensures that thousands of meals can be distributed efficiently. You are a crucial link in the chain that turns surplus food into hope and sustenance for vulnerable people.',
    skills: ['Organization', 'Teamwork'],
    imageUrl: 'event-food-drive',
    cause: 'Community',
  },
  {
    id: 'evt-3',
    title: 'Intro to Web Development Workshop',
    ngoId: 'ngo-3',
    date: 'November 9, 2024',
    time: '1:00 PM - 5:00 PM',
    location: 'Tech Forward Center, Bangalore',
    description: 'Share your web development skills by mentoring aspiring young coders. We are looking for volunteers to assist with a hands-on workshop covering the basics of HTML, CSS, and JavaScript.',
    why: 'Digital literacy is no longer a luxury but a necessity for economic empowerment. Providing accessible tech education to underserved youth opens up pathways to stable, high-growth careers and breaks cycles of poverty.',
    impact: 'By sharing your expertise, you will inspire and equip the next generation of tech innovators. Your mentorship can be the spark that ignites a young person\'s passion and sets them on a path to a brighter future.',
    skills: ['HTML', 'CSS', 'JavaScript', 'Mentoring'],
    imageUrl: 'event-coding-workshop',
    cause: 'Education',
  },
  {
    id: 'evt-4',
    title: 'Adopt-a-Pet Day at the Shelter',
    ngoId: 'ngo-4',
    date: 'November 16, 2024',
    time: '11:00 AM - 4:00 PM',
    location: 'Animal Allies Shelter, Puducherry',
    description: 'Help us find forever homes for our rescued animals! We need volunteers to assist with handling animals, talking to potential adopters, and managing the event flow.',
    why: 'Every year, thousands of healthy, loving animals are euthanized in shelters due to lack of space and resources. Adoption events provide a critical platform to connect these animals with loving forever homes.',
    impact: 'Your assistance at the event directly increases the chances of adoption for our shelter animals. You\'ll be helping to create happy families and saving lives by freeing up shelter space for other animals in need.',
    skills: ['Animal Handling', 'Communication'],
    imageUrl: 'event-animal-shelter',
    cause: 'Animals',
  },
  {
    id: 'evt-5',
    title: 'Youth Mentorship Program Kick-off',
    ngoId: 'ngo-3',
    date: 'November 23, 2024',
    time: '2:00 PM - 4:00 PM',
    location: 'Online',
    description: 'Become a mentor and guide a young student in their career journey. This kick-off session will match mentors with mentees and set the stage for a successful program.',
    why: 'Many talented young students lack access to professional networks and guidance, which can be a significant barrier to their career progression. Mentorship provides invaluable support, direction, and encouragement.',
    impact: 'As a mentor, you will provide personalized guidance that can shape a student\'s career trajectory. Your insights and support can build their confidence, expand their network, and help them achieve their professional dreams.',
    skills: ['Mentoring', 'Communication', 'Career Guidance'],
    imageUrl: 'event-mentorship-session',
    cause: 'Education',
  },
  {
    id: 'evt-6',
    title: 'Community Tree Planting Day',
    ngoId: 'ngo-1',
    date: 'December 7, 2024',
    time: '9:00 AM - 1:00 PM',
    location: 'Botanical Garden, Puducherry',
    description: 'Help us green our city! We are planting 500 native tree saplings at the Botanical Garden. No prior experience needed, just a willingness to get your hands dirty for a good cause.',
    why: 'Urban green spaces are essential for biodiversity, air quality, and public wellbeing. Planting trees helps combat climate change, reduces the urban heat island effect, and creates beautiful, healthy spaces for the community.',
    impact: 'Each tree you plant will grow to provide oxygen, filter pollutants, and offer shade for decades to come. You are leaving a lasting, living legacy that will benefit the environment and the community for generations.',
    skills: ['Gardening', 'Teamwork'],
    imageUrl: 'event-tree-planting',
    cause: 'Environment',
  },
];

export const featuredEvents = allEvents.slice(0, 2);
export const upcomingCommitments = allEvents.slice(4, 6);
export const completedEvents: Event[] = [
  allEvents[0],
  allEvents[1],
  allEvents[3],
];

export const allCertificates: Certificate[] = [
  // Getting Started
  { id: 'start-1', name: 'Verified Volunteer', description: 'Complete your first event and get verified.', rule: 'Complete 1 event', icon: ShieldCheck, isEarned: true, level: 'Bronze', shape: 'hexagon', category: 'Getting Started' },
  { id: 'start-2', name: 'Fast Starter', description: 'Complete an event within your first 7 days.', rule: 'Complete 1 event within 7 days of signup', icon: Rocket, isEarned: true, level: 'Silver', shape: 'pentagon', category: 'Getting Started' },
  { id: 'start-3', name: 'Profile Pro', description: 'Complete your user profile with skills and interests.', rule: 'Fill out profile skills and interests', icon: Users, isEarned: true, level: 'Bronze', shape: 'circle', category: 'Getting Started' },

  // Event Participation
  { id: 'event-1', name: 'First Step', description: 'Complete your first event.', rule: 'Complete 1 event', icon: Medal, isEarned: true, level: 'Bronze', shape: 'hexagon', category: 'Event Participation' },
  { id: 'event-2', name: 'Active Volunteer', description: 'Complete 5 events.', rule: 'Complete 5 events', icon: Medal, isEarned: true, level: 'Silver', shape: 'pentagon', category: 'Event Participation' },
  { id: 'event-3', name: 'Dedicated Volunteer', description: 'Complete 15 events.', rule: 'Complete 15 events', icon: Medal, isEarned: false, level: 'Gold', shape: 'circle', category: 'Event Participation' },
  { id: 'event-4', name: 'Volunteer Extraordinaire', description: 'Complete 30 events.', rule: 'Complete 30 events', icon: Medal, isEarned: false, level: 'Platinum', shape: 'hexagon', category: 'Event Participation' },

  // Hours Logged
  { id: 'hours-1', name: 'Hour Hero', description: 'Log 10 volunteer hours.', rule: 'Log 10 hours', icon: Trophy, isEarned: true, level: 'Bronze', shape: 'pentagon', category: 'Hours Logged' },
  { id: 'hours-2', name: 'Hour Hero', description: 'Log 25 volunteer hours.', rule: 'Log 25 hours', icon: Trophy, isEarned: true, level: 'Silver', shape: 'circle', category: 'Hours Logged' },
  { id: 'hours-3', name: 'Hour Hero', description: 'Log 50 volunteer hours.', rule: 'Log 50 hours', icon: Trophy, isEarned: false, level: 'Gold', shape: 'hexagon', category: 'Hours Logged' },
  { id: 'hours-4', name: 'Hour Hero', description: 'Log 100 volunteer hours.', rule: 'Log 100 hours', icon: Trophy, isEarned: false, level: 'Platinum', shape: 'pentagon', category: 'Hours Logged' },
  
  // Cause Champion
  { id: 'cause-comm-1', name: 'Community Champion', description: 'Complete 3 community-focused events.', rule: 'Complete 3 events in "Community" cause', icon: HeartPulse, isEarned: true, level: 'Bronze', shape: 'circle', category: 'Cause Champion' },
  { id: 'cause-env-1', name: 'Green Guardian', description: 'Complete 3 environmental events.', rule: 'Complete 3 events in "Environment" cause', icon: Sprout, isEarned: true, level: 'Bronze', shape: 'circle', category: 'Cause Champion' },
  { id: 'cause-animal-1', name: 'Animal Ally', description: 'Complete 3 animal welfare events.', rule: 'Complete 3 events in "Animals" cause', icon: Heart, isEarned: true, level: 'Bronze', shape: 'circle', category: 'Cause Champion' },
  { id: 'cause-edu-1', name: 'Education Enthusiast', description: 'Complete 3 education-focused events.', rule: 'Complete 3 events in "Education" cause', icon: BookOpen, isEarned: false, level: 'Bronze', shape: 'circle', category: 'Cause Champion' },
  { id: 'cause-comm-2', name: 'Community Champion', description: 'Complete 7 community-focused events.', rule: 'Complete 7 events in "Community" cause', icon: HeartPulse, isEarned: false, level: 'Silver', shape: 'hexagon', category: 'Cause Champion' },
  { id: 'cause-env-2', name: 'Green Guardian', description: 'Complete 7 environmental events.', rule: 'Complete 7 events in "Environment" cause', icon: Sprout, isEarned: false, level: 'Silver', shape: 'hexagon', category: 'Cause Champion' },
  { id: 'cause-animal-2', name: 'Animal Ally', description: 'Complete 7 animal welfare events.', rule: 'Complete 7 events in "Animals" cause', icon: Heart, isEarned: false, level: 'Silver', shape: 'hexagon', category: 'Cause Champion' },
  { id: 'cause-edu-2', name: 'Education Enthusiast', description: 'Complete 7 education-focused events.', rule: 'Complete 7 events in "Education" cause', icon: BookOpen, isEarned: false, level: 'Silver', shape: 'hexagon', category: 'Cause Champion' },
  { id: 'cause-comm-3', name: 'Community Champion', description: 'Complete 15 community-focused events.', rule: 'Complete 15 events in "Community" cause', icon: HeartPulse, isEarned: false, level: 'Gold', shape: 'pentagon', category: 'Cause Champion' },
  { id: 'cause-env-3', name: 'Green Guardian', description: 'Complete 15 environmental events.', rule: 'Complete 15 events in "Environment" cause', icon: Sprout, isEarned: false, level: 'Gold', shape: 'pentagon', category: 'Cause Champion' },
  { id: 'cause-animal-3', name: 'Animal Ally', description: 'Complete 15 animal welfare events.', rule: 'Complete 15 events in "Animals" cause', icon: Heart, isEarned: false, level: 'Gold', shape: 'pentagon', category: 'Cause Champion' },
  { id: 'cause-edu-3', name: 'Education Enthusiast', description: 'Complete 15 education-focused events.', rule: 'Complete 15 events in "Education" cause', icon: BookOpen, isEarned: false, level: 'Gold', shape: 'pentagon', category: 'Cause Champion' },

  // Skill & Dedication
  { id: 'placeholder-1', name: 'Skill Sharer', description: 'Volunteer for an event using one of your top skills.', rule: 'Complete an event that requires one of your listed skills', icon: Award, isEarned: false, level: 'Bronze', shape: 'pentagon', category: 'Skill & Dedication' },
  { id: 'diverse-1', name: 'Cause Connector', description: 'Volunteer for 3 different causes.', rule: 'Volunteer for 3 unique causes', icon: Users, isEarned: false, level: 'Bronze', shape: 'circle', category: 'Skill & Dedication' },
  { id: 'special-1', name: 'Weekend Warrior', description: 'Volunteer on 3 consecutive weekends.', rule: 'Complete events on 3 consecutive weekends', icon: Zap, isEarned: false, level: 'Silver', shape: 'circle', category: 'Skill & Dedication' },
  { id: 'placeholder-6', name: 'Team Player', description: 'Complete events with 10 different volunteers.', rule: 'Collaborate with 10 unique volunteers', icon: Award, isEarned: false, level: 'Bronze', shape: 'hexagon', category: 'Skill & Dedication' },
  { id: 'placeholder-7', name: 'Night Owl', description: 'Volunteer for an event that ends after 9 PM.', rule: 'Complete an event after 9 PM', icon: Award, isEarned: false, level: 'Bronze', shape: 'pentagon', category: 'Skill & Dedication' },
  { id: 'placeholder-8', name: 'Early Bird', description: 'Volunteer for an event that starts before 8 AM.', rule: 'Complete an event before 8 AM', icon: Award, isEarned: false, level: 'Bronze', shape: 'circle', category: 'Skill & Dedication' },
  { id: 'placeholder-9', name: 'Loyalty', description: 'Complete 5 events with the same NGO.', rule: 'Complete 5 events with one NGO', icon: Award, isEarned: false, level: 'Gold', shape: 'hexagon', category: 'Skill & Dedication' },
  
  // Community & Leadership
  { id: 'diverse-2', name: 'Cause Explorer', description: 'Volunteer for 5 different causes.', rule: 'Volunteer for 5 unique causes', icon: Users, isEarned: false, level: 'Silver', shape: 'hexagon', category: 'Community & Leadership' },
  { id: 'special-3', name: 'NGO Nomad', description: 'Volunteer with 5 different NGOs.', rule: 'Volunteer with 5 different NGOs', icon: TrendingUp, isEarned: false, level: 'Silver', shape: 'pentagon', category: 'Community & Leadership' },
  { id: 'diverse-3', name: 'Cause Connoisseur', description: 'Volunteer for 7 different causes.', rule: 'Volunteer for 7 unique causes', icon: Users, isEarned: false, level: 'Gold', shape: 'pentagon', category: 'Community & Leadership' },
  { id: 'special-4', name: 'Leadership', description: 'Lead a volunteer team at an event.', rule: 'Lead a team at an event', icon: Crown, isEarned: false, level: 'Gold', shape: 'circle', category: 'Community & Leadership' },
  { id: 'special-2', name: 'Top Volunteer', description: 'Be in the top 10% of volunteers by hours this quarter.', rule: 'Be a top 10% volunteer for a quarter', icon: Star, isEarned: false, level: 'Gold', shape: 'hexagon', category: 'Community & Leadership' },
  { id: 'placeholder-13', name: 'Mentor Master', description: 'Mentor 5 times in educational workshops.', rule: 'Mentor 5 times', icon: BookOpen, isEarned: false, level: 'Platinum', shape: 'pentagon', category: 'Community & Leadership' },

  // Referral Achievements
  { id: 'referral-1', name: 'Recruiter', description: 'Refer 1 friend who completes an event.', rule: 'Refer 1 new volunteer', icon: UserPlus, isEarned: false, level: 'Bronze', shape: 'hexagon', category: 'Referral Achievements' },
  { id: 'referral-2', name: 'Super Recruiter', description: 'Refer 3 friends who complete an event.', rule: 'Refer 3 new volunteers', icon: Users, isEarned: false, level: 'Silver', shape: 'pentagon', category: 'Referral Achievements' },
  { id: 'referral-3', name: 'Community Builder', description: 'Refer 5 friends who complete an event.', rule: 'Refer 5 new volunteers', icon: Crown, isEarned: false, level: 'Gold', shape: 'circle', category: 'Referral Achievements' },
  
  // Grandmaster Badges
  { id: 'placeholder-10', name: 'Super Streaker', description: 'Volunteer at least once a month for 6 consecutive months.', rule: 'Volunteer monthly for 6 months straight', icon: Award, isEarned: false, level: 'Platinum', shape: 'pentagon', category: 'Grandmaster Badges' },
  { id: 'placeholder-11', name: 'Annual Achiever', description: 'Log 200 volunteer hours in a single year.', rule: 'Log 200 hours in one calendar year', icon: Gem, isEarned: false, level: 'Platinum', shape: 'circle', category: 'Grandmaster Badges' },
  { id: 'placeholder-12', name: 'Grandmaster', description: 'Log 500 volunteer hours in total.', rule: 'Log 500 total hours', icon: Crown, isEarned: false, level: 'Platinum', shape: 'hexagon', category: 'Grandmaster Badges' },
  { id: 'placeholder-14', name: 'Environmental Steward', description: 'Log 50 hours in environmental causes.', rule: 'Log 50 hours for "Environment" cause', icon: Sprout, isEarned: false, level: 'Platinum', shape: 'circle', category: 'Grandmaster Badges' },
  { id: 'placeholder-15', name: 'Community Pillar', description: 'Log 50 hours in community causes.', rule: 'Log 50 hours for "Community" cause', icon: HeartPulse, isEarned: false, level: 'Platinum', shape: 'hexagon', category: 'Grandmaster Badges' },
  { id: 'placeholder-16', name: 'Animal Guardian', description: 'Log 50 hours in animal welfare causes.', rule: 'Log 50 hours for "Animals" cause', icon: Heart, isEarned: false, level: 'Platinum', shape: 'pentagon', category: 'Grandmaster Badges' },
  { id: 'placeholder-17', name: 'All-Star', description: 'Unlock 25 other badges.', rule: 'Earn 25 other badges', icon: Star, isEarned: false, level: 'Platinum', shape: 'circle', category: 'Grandmaster Badges' },
  { id: 'placeholder-18', name: 'Legend', description: 'Unlock all other 49 badges.', rule: 'Earn all 49 other badges', icon: Crown, isEarned: false, level: 'Platinum', shape: 'hexagon', category: 'Grandmaster Badges' },
  
  // Uncategorized for now (can be moved)
  { id: 'placeholder-2', name: 'Tech Guru', description: 'Complete 5 tech-related events.', rule: 'Complete 5 events in "Technology" cause', icon: Award, isEarned: false, level: 'Silver', shape: 'circle', category: 'Skill & Dedication' },
  { id: 'placeholder-3', name: 'Health Hero', description: 'Complete 5 health-focused events.', rule: 'Complete 5 events in "Health" cause', icon: Award, isEarned: false, level: 'Silver', shape: 'hexagon', category: 'Skill & Dedication' },
  { id: 'placeholder-4', name: 'Arts Advocate', description: 'Complete 5 arts & culture events.', rule: 'Complete 5 events in "Arts & Culture" cause', icon: Award, isEarned: false, level: 'Silver', shape: 'pentagon', category: 'Skill & Dedication' },
  { id: 'placeholder-5', name: 'Senior Support', description: 'Complete 5 events focused on senior citizens.', rule: 'Complete 5 events for "Seniors"', icon: Award, isEarned: false, level: 'Silver', shape: 'circle', category: 'Skill & Dedication' },
];

export const notifications: Notification[] = [
  {
    id: 'notif-1',
    title: 'New Badge Unlocked!',
    description: 'You earned the "Active Volunteer" badge. Keep up the great work!',
    createdAt: '2 hours ago',
    isRead: false,
  },
  {
    id: 'notif-2',
    title: 'Event Reminder',
    description: 'Your commitment for "Weekend Food Donation Sorting" is tomorrow.',
    createdAt: '1 day ago',
    isRead: false,
  },
  {
    id: 'notif-3',
    title: 'New Event Opportunity',
    description: 'Green Earth Foundation just posted a new event: "Urban Gardening Workshop".',
    createdAt: '3 days ago',
    isRead: true,
  },
    {
    id: 'notif-4',
    title: 'Welcome to Meet A Cause!',
    description: 'Thank you for joining our community of volunteers.',
    createdAt: '1 week ago',
    isRead: true,
  },
];

export const howItWorks = [
  {
    title: 'Discover Opportunities',
    description: 'Browse through a wide range of events and projects posted by trusted NGOs. Filter by your interests, skills, and location to find the perfect match.'
  },
  {
    title: 'Connect & Participate',
    description: 'Sign up for events with a single click. Connect with NGOs, and collaborate with fellow volunteers who share your passion for making a difference.'
  },
  {
    title: 'Track Your Impact',
    description: 'Log your volunteer hours, track your contributions, and earn certificates for your hard work. See the tangible impact you\'re making in the community.'
  }
];

export const testimonials: Testimonial[] = [
  {
    quote: 'Meet A Cause made it so easy to find a cause I\'m passionate about. I\'ve met amazing people and feel like I\'m truly making a difference in my local community.',
    name: 'Ananya Rao',
    role: 'Volunteer',
    avatarId: 'avatar-ananya-rao'
  },
  {
    quote: 'As a small NGO, finding dedicated volunteers was always a challenge. This platform has connected us with a pool of skilled and enthusiastic individuals. It\'s been a game-changer!',
    name: 'Rohan Mehta',
    role: 'Director, Hope Helpers',
    avatarId: 'avatar-rohan-mehta'
  },
  {
    quote: 'The dashboard is fantastic for tracking my hours and seeing my volunteering history all in one place. It keeps me motivated to do more!',
    name: 'Priya Sharma',
    role: 'Volunteer',
    avatarId: 'avatar-priya-sharma'
  }
];
