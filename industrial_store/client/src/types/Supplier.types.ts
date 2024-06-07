export interface ISupplier {
  id: number;
  name: string;
}

export type ICreateSupplier = Omit<ISupplier, 'id'>;

export type IUpdateSupplier = ISupplier;