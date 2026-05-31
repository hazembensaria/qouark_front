import { IComment } from "./comment";
import { IFile } from "./file";
import { ITechSupport } from "./techSupport";
import { ITicket } from "./ticket";
import { IUser } from "./user";

export interface ITicketDetail {
    ticket: ITicket;
    comments: IComment[];
    files: IFile[];
    tasks: any[];
    assignees?: ITechSupport;
    techSupport?: ITechSupport[];
    user?: IUser;
}