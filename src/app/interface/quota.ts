export interface IQuota {
    userId: string;
    maxSizeBytes: number;
    usedSizeBytes: number;
    createdAt: string;
}