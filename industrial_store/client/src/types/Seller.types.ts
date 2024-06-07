export interface ISeller {
  id: number;
  name: string;
  surname: string;
  profitPercentage: number;
  role: string;
}

export type ICreateSeller = Omit<ISeller, 'id'>;

export type IUpdateSeller = ISeller;
