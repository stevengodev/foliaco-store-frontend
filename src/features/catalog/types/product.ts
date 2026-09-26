export interface ProductImage {
  id: number;
  fileKey: string;
  url: string;
  sortOrder: number;
  featured: boolean;
}

export interface CategoryResponse {
  id: number;
  name: string;
  description: string;
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  description: string;
  brand: string;
  features: Record<string, string>;
  price: number;
  active: boolean;
  category: CategoryResponse;
  
  // Opcionales ya que el backend aún no los provee
  images?: ProductImage[];
  stock?: number;
}
