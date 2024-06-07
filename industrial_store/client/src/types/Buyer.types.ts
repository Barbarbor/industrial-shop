export interface IBuyer {
    id: number;
    name: string;
    surname: string;
    ageGroup: string;
    gender: string;
}

export type ICreateBuyer = Omit<IBuyer, 'id'>;

export type IUpdateBuyer = IBuyer;
