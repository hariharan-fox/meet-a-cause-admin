export type Volunteer = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  skills: string[];
  interests: string[];
};

export type Event = {
  id:string;
  title: string;
  ngoId: string;
  date: string;
  time: string;
  location: string;
  description: string;
  why: string;
  impact: string;
  skills: string[];
  imageUrl: string;
  cause: string;
};

export type NGO = {
  id: string;
  name: string;
  logoUrl: string;
  mission: string;
  location: string;
  cause: string[];
  impact: string;
  verificationStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
  darpanId?: string;
  panNumber?: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  avatarId: string;
};

export type Certificate = {
  id: string;
  name: string;
  description: string;
  rule: string;
  icon: any;
  isEarned: boolean;
  category: string;
  level?: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  shape?: 'circle' | 'pentagon' | 'hexagon';
};

export type Notification = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  isRead: boolean;
};
