export interface IOrganization {
  startupId: number;
  startupUuid: string;
  name: string;
  ownerId: number;
  status: 'ACTIVE' | 'ARCHIVED' | 'COMPLETED';
  createdAt: Date | string;
  updatedAt?: Date | string;
  role?: 'ADMIN' | 'MEMBER';

}