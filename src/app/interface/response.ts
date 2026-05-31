import { IComment } from "./comment";
import { IDevice } from "./device";
import { IFile } from "./file";
import { IInvitation } from "./invitation";
import { IMessage } from "./message";
import { IOrganization } from "./organization";
import { IProject } from "./project";
import { IStorageFolder } from "./storageFolder";
import { ITechSupport } from "./techSupport";
import { ITicket } from "./ticket";
import { IUser } from "./user";

export interface IResponse{

    time : Date | string;
    code : number;
    status : string;
    message : string;
    path : string;
    exception : string;
    data : {user? : IUser, sharedFolders? : IStorageFolder[], sharedFiles? : IFile[], invitation? : IInvitation, projects : IProject[], invitations? : IInvitation[], organization: IOrganization, users? : IUser[] , project? : IProject , folders? : IStorageFolder[] , folder? : IStorageFolder , devices? : IDevice[], comment : IComment , messages: IMessage[], conversation : IMessage[] , ticket: ITicket , tickets? : ITicket[] , pages? : number , comments? : IComment[] , report?: ITicket[], files? : IFile[] , message : IMessage , tasks? : any[] , task : any , assignee? : ITechSupport , techSupports? : ITechSupport[]};
}