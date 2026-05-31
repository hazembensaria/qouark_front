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
  permission: 'READ' | 'WRITE' | 'ADMIN';
}