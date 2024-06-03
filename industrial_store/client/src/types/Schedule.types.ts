export interface ISchedule{
    id:number;
    day: string;
    startTime: string;
    endTime: string;
    sellerId: number;
}
export interface IScheduleFilters{
    startTime?: string;
    endTime?: string;
    sellerId?: number;
}
export interface ICreateSchedule{
    day: string;
    startTime: string;
    endTime: string;
    sellerId: number;
}
export interface IUpdateSchedule{
    id:number;
    day: string;
    startTime: string;
    endTime: string;
    sellerId: number;
}