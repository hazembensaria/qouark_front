export interface IInvitation {
  invitationId: number;
  invitationUuid: string;
  startupUuid?: string;
  startupName?: string;
  invitedEmail?: string;
  invitedBy?: string;
  role: 'ADMIN' | 'MEMBER';
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt?: Date | string;
  acceptedAt?: Date | string;
}