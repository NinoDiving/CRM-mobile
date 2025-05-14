export type Employee = {
  id: string;
  lastname: string;
  firstname: string;
  email: string;
  password: string;
  role: 'admin' | 'commercial';
  created_at?: string;
  updated_at?: string;
};
export type UserMetadata = {
  firstname: string;
  lastname: string;
  role: string;
};
