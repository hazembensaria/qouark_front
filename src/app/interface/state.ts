import { IDevice } from "./device";
import { IInvitation } from "./invitation";
import { IMessage } from "./message";
import { IOrganization } from "./organization";
import { IProject } from "./project";
import { defaultQuery, IQuery } from "./query";
import { IQuota } from "./quota";
import { IStorageFile } from "./storageFile";
import { IStorageFolder } from "./storageFolder";
import { ITicket } from "./ticket";
import { ITicketDetail } from "./ticketDetail";
import { IUser } from "./user";

export interface IState {
    loading : boolean;
    profile?: IUser;
    user?: IUser;
    ticketDetail? : ITicketDetail;
    tickets? : ITicket[];
    allTickets? : ITicket[];
    pages? : number;
    currentPage? : number;
    reportRequest? : {};
    error?: string;
    query? : IQuery;
    users? : IUser[];
    report? : ITicket[];
    messages? : IMessage[];
    conversation? : IMessage[];
    devices: IDevice[];
    storageFolders?: IStorageFolder[];
    storageFiles?: IStorageFile[];
    currentFolder?: IStorageFolder;
    rootFolder?: IStorageFolder;
    projects?: IProject[];
    project?: IProject;
    organization?: IOrganization;
    invitations?: IInvitation[];
    sharedFolders?: IStorageFolder[];
    trashFolders?: IStorageFolder[];
    sharedFiles?: IStorageFile[];
    trashFiles?: IStorageFile[];
    quota?: IQuota;
}

export const initialState : IState = {
    loading : false,
    profile : null,
    user : null,
    ticketDetail : null,
    tickets : null,
    allTickets : null,
    pages : null,
    currentPage : 0,
    reportRequest : undefined,
    error : null,
    query : defaultQuery,
    users : null,
    report : null,
    messages : [],
    conversation : null,
    devices : null,
    storageFolders : [],
    storageFiles : [],
    currentFolder : null,
    rootFolder : null,
    projects : [],
    project : null,
    organization : null,
    invitations : [],
    sharedFolders : [],
    trashFolders : [],
    sharedFiles : [],
    trashFiles : [],
    quota : null
    
}