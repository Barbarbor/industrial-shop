export interface ISupply {
  id: number;
  productId: number;
  supplierId: number;
  amount: number;
  quantity: number;
  deliveredAt: string;
}

export type ICreateSupply = Omit<ISupply, 'id'>;
export type IUpdateSupply = ISupply;

export interface ISupplyFilters {
  startDate?: string;
  endDate?: string;
  productId?: number;
  categoryId?: number;
  manufacturerId?: number;
  supplierId?: number;
}

export interface ISuppliesResponse {
  supplies: ISupply[];
  totalQuantity: number;
  totalAmount: number;
}