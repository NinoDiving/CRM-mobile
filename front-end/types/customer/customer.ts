export type Customer = {
  id: string;
  fullname: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipcode: string;
  employee_affected: {
    firstname: string;
    lastname: string;
  };
};
