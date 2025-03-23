export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  is_available: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  menuItems?: MenuItem[];
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  image_url: string;
  country: {
    id: string;
    name: string;
  };
  menuCategories?: MenuCategory[];
}
