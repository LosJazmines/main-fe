export interface BannerImage {
  url: string;
  order: number;
}

export interface StoreConfig {
  homeBannerImages: BannerImage[];
  storeBannerImages: BannerImage[];
  categories: Category[];
  tags: Tag[];
}

export interface Tag {
  uuid: string;
  name: string;
  slug: string;
  value: string;
  type: 'flower' | 'plant' | 'extra';
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  uuid: string;
  name: string;
  slug: string;
  value: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
} 