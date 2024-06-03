// types/Supply.types.ts
export interface ISupply {
  id: number;
  productId: number;
  supplierId: number;
  amount: number;
  quantity: number;
  deliveredAt: string;
}

export interface ICreateSupply {
  productId: number;
  supplierId: number;
  amount: number;
  quantity: number;
  deliveredAt: string;
}

export interface IUpdateSupply {
  id: number;
  productId: number;  
  supplierId: number;
  amount: number;
  quantity: number;
  deliveredAt: string;
}
