export type AddOn = {
  id: number;
  name: string;
  price: number;
  event: number;
};

export type MerchItem = {
  id: number;
  model: string;
  size: "XXS" | "XS" | "S" | "M" | "L" | "XL" | "XXL";
  price: number;
  event: number;
};

export type RegistrationDTO = {
  id: number;
  add_ons: AddOn[];
  country: string;
  first_name: string;
  last_name: string;
  level: string | null;
  merch_items: MerchItem[];
  paid_amount: number | null;
  paid_at: string | null;
  pass_type: string;
  price: number | null;
  received_at: string;
  role: string;
  status: string;
  submitted_email: string;
  wsdc_number: string | null;
};
