export interface ProductImage {
  id: number;
  url: string;
  sortOrder: number;
  isFeatured: boolean;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  sku: string;
  categoryId: number;
  images: ProductImage[];
  features?: Record<string, string>;
  stock: number;
  createdAt: string;
  updatedAt: string;
}
