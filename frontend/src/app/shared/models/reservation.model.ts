export interface Reservation {
  _id?: string;
  name: string;
  phone: string;
  email: string;
  date: Date;
  time: string;
  guests: number;
  location: 'beltér' | 'kerthelyiség';
  options: string[];
  party_color?: string;
  message?: string;
  agree: boolean;
  createdAt?: Date;
}