export interface Contact {
  _id?: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  agree: boolean;
  createdAt?: Date;
}