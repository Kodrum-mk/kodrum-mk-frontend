export interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  price: string;
  instructor: {
    name: string;
    avatar: string;
  };
  level: string;
  duration: string;
  thumbnail: string;
}

export interface PrepSession {
  id: string;
  title: string;
  description: string;
  faculty: string;
  instructor: string;
  startDate: string;
  dateRange: string;
  duration: string;
  level: string;
  status: string;
  format: string;
  calendarDates: number[];
}

export interface Testimonial {
  id: number;
  quote: string;
  name: string;
  subtitle: string;
}

export interface NavLink {
  label: string;
  href: string;
}
