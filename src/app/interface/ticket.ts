export interface ITicket{
    ticketId : number;
    ticketUuid : string;
    title : string;
    description : string;
    status : string;
    type : string;
    priority : string;
    progress : number;
    fileCount : number;
    commentCount : number;
    dueDate : string;
    createdAt : string;
    updatedAt : string;
}

export type Ticket ={'ticket' : ITicket};
export type Tickets = {'tickets' : ITicket[]};