import { Config } from 'ziggy-js';

export interface Stat {
  title: string;
  icon?: string;
  value: string | number;
  difference: number;
  increments?: number;
  decrements?: number;
  period?: string;
  start?: number;
  end?: number;
};

export interface User {
  id: number | string;
  fullname?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  image?: string;
  avatar?: string;
  featured_image?: string;
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

export interface Comment {
  id: string;
  user: User,
  content: string;
  status: string;
  post_id: string;
  user_id: string;
  parent_id?: string;
  parent: Comment;
  post: Post;
  updated_at: string;
  created_at: string;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  user_id: string;
  content: string;
  status: string;
  parent_id?: string;
  featured_image?: string;
  meta_description?: string;
  meta_tags?: Array;
  layout_template?: string;
  layout_width?: string;
  created_at: string;
  updated_at: string;
  user: User;
  parent?: Page;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  user_id: string;
  content: string;
  status: string;
  category_id: string;
  featured_image?: string;
  meta_description?: string;
  meta_tags?: Array;
  layout_template?: string;
  layout_width?: string;
  created_at: string;
  updated_at: string;
  user: User;
  category: Category;

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
  posts_count?: number;
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

export interface Role {
  _method?: string;
  id: string;
  name: string;
  guard_name?: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export type Permission = {
  name: string;
  active?: boolean;
  permission: {
    name: string;
    active?: boolean;
  }[]
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

