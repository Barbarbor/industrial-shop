export interface ICategory {
  id: number;
  name: string;
}

export type ICreateCategory = Omit<ICategory, 'id'>;

export type IUpdateCategory = ICategory;