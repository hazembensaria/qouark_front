export interface IStorageFile {
    storageFileId?: number;
    storageFileUuid?: string;
    name?: string;
    extension?: string;
    formattedSize?: string;
    size?: number;
    uri?: string;
    createdAt?: string;
}

export interface ShareResourceRequest {
  resourceUuid: string; 
  sharedWithUserUuid: string;
  sharedWithUserEmail: string; // Optional email for better backend handling
  permission: 'READ' | 'WRITE' | 'ADMIN';
}