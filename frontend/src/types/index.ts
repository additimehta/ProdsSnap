
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  createdAt: string;
  updatedAt: string;
  versions: ProductVersion[];
}

export interface ProductVersion {
  id: string;
  productId: string;
  versionNumber: string;
  changes: string;
  createdAt: string;
  createdBy: string;
  isRevert?: boolean;
  revertedFromVersion?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}