import { Config } from 'ziggy-js';

export interface User {
  id?: number | string;
  fullname?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  image?: string;
  avatar?: string;
  address?: string;
  state?: string;
  city?: string;
  postcode?: string;
  biography?: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
  password?: string;
  password_confirmation?: string;
}

export interface Post {
  id: number | string;
  title: string;
  excerpt: string;
  author: string;
  content: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  _method?: string;
  id: string;
  title: string;
  slug: string;
  description: string;
  parent_id: string;
  created_at: string;
  updated_at: string;
}

export interface Tags {
  _method?: string;
  id: string;
  title: string;
  slug: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface SelectableList {
  label: string;
  value: string;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
  auth: {
    user: User;
  };
  ziggy: Config & { location: string };
};

export type Id = string | number;

export type KanbanColumn = {
  id: Id;
  title: string;
};

export type KanbanTask = {
  id: Id;
  columnId: Id;
  content: string;
  title?: string;
  status?: 'to do' | 'in progress' | 'done' | 'unassigned' | string;
  comments?: number;
  users?: number;
};

export type OrderStatus = 'shipped' | 'processing' | 'cancelled' | string;

export type Orders = {
  id: string;
  product: string;
  date: string;
  total: number;
  status: OrderStatus;
  payment_method: string;
};

export type InvoiceStatus =
  | 'pending'
  | 'sent'
  | 'cancelled'
  | 'approved'
  | 'suspended'
  | string;

export type Invoices = {
  id: string;
  full_name: string;
  email: string;
  address: string;
  country: string;
  status: InvoiceStatus;
  amount: number;
  issue_date: string;
  description: string;
  client_email: string;
  client_address: string;
  client_country: string;
  client_name: string;
  client_company: string;
};

