

export interface IProduct {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
}

export interface ICartProduct {
    id:number;
    product: IProduct;
    quantity: number;
}
export interface IProductDetail extends IProduct{
    description:string;
}