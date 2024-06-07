export interface IManufacturer {
  id: number;
  name: string;
}

export type ICreateManufacturer = Omit<IManufacturer, 'id'>;

export type IUpdateManufacturer = IManufacturer;