export interface ISupplyItem {
    id: number;
    quantity: number;
    supplyId: number;
    productId: number;
  }
  
  export interface ICreateSupplyItem {
    quantity: number;
    productId: number;
  }
  
  export interface IUpdateSupplyItem {
    id: number;
    quantity: number;
    productId: number;
  }