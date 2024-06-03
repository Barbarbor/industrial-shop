export interface ISale {
    id: number;
    totalAmount: number;
    saleDate: Date;
    buyerId: number;
    sellerId: number;
    productId: number;
    quantity: number;
  }
  export interface ISaleResponse{
    sales: ISale[];
    totalRevenue: number;
    totalQuantity:number;
    
  }
  export interface ISaleFilters{
    startDate?: string;
    endDate?: string;
    buyerId?: number;
    sellerId?: number;
    productId?: number;
  }
  export interface ISaleItem {
    quantity: number;
    productId: number;
    product: { name: string; price: number; }
  }
  
  export interface ICreateSale {
    saleDate: string; // Assuming date will be passed as string
    buyerId: number;
    sellerId: number;
    productId: number;
    quantity: number;
  }
  
  export interface ICreateSaleItem {
    quantity: number;
    productId: number;
  }
  
  export interface IUpdateSale {
    id: number;
    saleDate: string; // Assuming date will be passed as string
    buyerId: number;
    sellerId: number;
    productId: number;
    quantity: number;
  }
  