export interface IProduct {
  id: number;
  name: string;
  price: number;
  stock: number;
  categoryId: number;
  manufacturerId: number;
}

export interface IProductFilters {
  name?: string;
  categoryId?: number;
  manufacturerId?: number;
}

export type ICreateProduct = Omit<IProduct, 'id'>;

export type IUpdateProduct = IProduct;