export interface ISchedule {
    id: number;
    day: string;
    startTime: string;
    endTime: string;
    sellerId: number;
}

export interface IScheduleFilters {
    startTime?: string;
    endTime?: string;
    sellerId?: number;
}

export type ICreateSchedule = Omit<ISchedule, 'id'>;

export type IUpdateSchedule = ISchedule;
