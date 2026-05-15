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
  registrationUrl: string;
}

export interface PromoPackage {
  id: string;
  badge?: string;
  featured?: boolean;
  title: string;
  description: string;
  originalPrice: string;
  discount: string;
  savings: string;
  courses: string[];
  includes: string[];
  noteText?: string;
  registrationUrl: string;
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
