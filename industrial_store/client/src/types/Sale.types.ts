export interface ISale {
  id: number;
  totalAmount: number;
  saleDate: Date;
  buyerId: number;
  sellerId: number;
  productId: number;
  quantity: number;
}

export interface ISaleResponse {
  sales: ISale[];
  totalRevenue: number;
  totalQuantity: number;
}

export interface ISaleFilters {
  startDate?: string;
  endDate?: string;
  buyerId?: number;
  sellerId?: number;
  productId?: number;
}

export type ICreateSale = Omit<ISale, 'id' | 'totalAmount' | 'saleDate'> & { saleDate: string };

export type IUpdateSale = Omit<ISale, 'totalAmount' | 'saleDate'> & { saleDate: string };