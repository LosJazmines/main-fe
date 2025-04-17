export interface StoreConfig {
  banners: {
    home: BannerImage[];
    store: BannerImage[];
  };
  categories: Category[];
  tags: Tag[];
}

export interface BannerImage {
  url: string;
  order: number;
}

export interface Category {
  uuid: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  value?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tag {
  uuid: string;
  name: string;
  type: 'flower' | 'plant' | 'extra';
  createdAt: Date;
  updatedAt: Date;
} 