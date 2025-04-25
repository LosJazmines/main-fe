export interface TagConfig {
  uuid: string;
  slug: string;
  name: string;
  value: string;
  type: 'flower' | 'plant' | 'extra';
  categoryUuid: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
} 