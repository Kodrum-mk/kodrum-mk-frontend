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

export interface PrepDateBlock {
  startIso: string;
  endIso: string;
  days: number;
  /** Human label for the block, e.g. "11ти – 12ти Септември". */
  label: string;
  note?: string;
}

export interface PrepSession {
  id: string;
  subjectId?: string;
  prepSessionId?: string;
  title: string;
  description: string;
  faculty: string;
  instructor: string;
  startDateIso?: string;
  endDateIso?: string;
  startDate: string;
  /** Every run of class days, in chronological order. Empty for single-date subjects. */
  dateBlocks?: PrepDateBlock[];
  /** All block labels joined, e.g. "11ти – 12ти Септември, 18ти – 19ти Септември". */
  datesLabel?: string;
  examDate?: string;
  duration?: string | null;
  price?: number;
  spotsLeft: number;
  totalSpots?: number;
  level: string;
  status: string;
  format: string;
}

export type ReferralSource =
  | "social"
  | "friend"
  | "group"
  | "returning"
  | "other";

export interface SignupFormState {
  ime: string;
  prezime: string;
  email: string;
  telefon: string;
  discordUsername: string;
  attendancePreference: "online" | "physical";
  referralSource: ReferralSource | "";
  referralSourceOther: string;
  referredBy: string;
  poraka: string;
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
