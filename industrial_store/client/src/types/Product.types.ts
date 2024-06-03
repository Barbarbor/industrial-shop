export interface IProduct {
  id: number;
  name: string;
  price: number;
  stock: number;
  categoryId: number;
  manufacturerId: number;
}
export interface IProductFilters{
  name?:string;
  categoryId?:number;
  manufacturerId?:number;
}
export interface ICreateProduct {
  name: string;
  price: number;
  stock: number;
  categoryId: number;
  manufacturerId: number;
}

export interface IUpdateProduct {
  id: number;
  name: string;
  price: number;
  stock: number;
  categoryId: number;
  manufacturerId: number;
}