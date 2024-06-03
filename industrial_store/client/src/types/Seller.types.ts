export interface ISeller {
    id: number;
    name: string;
    surname: string;
    profitPercentage: number;
    role: string;
  }
  
  export interface ICreateSeller {
    name: string;
    surname: string;
    profitPercentage: number;
    role: string;
  }
  
  export interface IUpdateSeller{
    id: number;
    name: string;
    surname: string;
    profitPercentage: number;
    role: string;
  }
  