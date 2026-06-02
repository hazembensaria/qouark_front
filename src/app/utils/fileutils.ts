import { Priority } from "../enum/priority.enum";
import { Status } from "../enum/status.enum";
import { Type } from "../enum/type.enum";
import { IComment } from "../interface/comment";
import { IMessage } from "../interface/message";

export const getFormDate = (formValue : any , files : File[]): FormData => {
    const formData = new FormData();   
    for(const proprety in formValue){ 
        formData.append(proprety, formValue[proprety]);
    }
    if(files){ 
      files.forEach(file => formData.append('files', file , file.name));
    }

    return formData;
};


export const getFileFormData = (file: File): FormData => {
   const formData = new FormData();
    formData.append('file', file , file.name);
    return formData;
};


export const getMessageCount = (messages : IMessage[]) => {
    const unreadMessages = messages?.filter((message , index, array) =>  message.status === "UNREAD" );
    return unreadMessages.length;
};


export const formatFileSize = (size: number): string => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    if(size === 0) return '0 B';
    let quotient = Math.floor(Math.log10(size) / 3);
    quotient = quotient < units.length ? quotient : units.length - 1;
    size  /= Math.pow(1000, quotient);
    return `${size.toFixed(2)} ${units[quotient]}`;
};


export const updateComments = (comment : IComment , comments : IComment[]) : IComment[] => {
    let commentsCopy = [...comments];
    let commentIndex: number = null;
    for(let index = 0 ; index < comments.length ; index++){
        if(comments[index].commentUuid === comment.commentUuid){
            commentIndex = index;
            break;
        }
    }
    commentsCopy[commentIndex] = comment;
    return commentsCopy;
};

export const getValue = (values: any) => {      
    const object = {};
    const statuses: string[] = [];
    const types: string[] = [];
    const priorities: string[] = [];
    for (const property in values) {
        if (values[property] === true) {
            switch (property) {
                case Status.IN_PROGRESS:
                    statuses.push(Status.IN_PROGRESS);
                    break;
                case Status.IN_REVIEW:
                    statuses.push(Status.IN_REVIEW);
                    break;
                case Status.PENDING:
                    statuses.push(Status.PENDING);
                    break;
                case Status.COMPLETED:
                    statuses.push(Status.COMPLETED);
                    break;
                case Status.NEW:
                    statuses.push(Status.NEW);
                    break;
                case Status.IMPEDED:
                    statuses.push(Status.IMPEDED);
                    break;
                case Status.CLOSED:
                    statuses.push(Status.CLOSED);
                    break;
                case Type.BUG:
                    types.push(Type.BUG);
                    break;
                case Type.DEFECT:
                    types.push(Type.DEFECT);
                    break;
                case Type.DESIGN:
                    types.push(Type.DESIGN);
                    break;
                case Type.ENHANCEMENT:
                    types.push(Type.ENHANCEMENT);
                    break;
                case Type.INCIDENT:
                    types.push(Type.INCIDENT);
                    break;
                case Priority.LOW:
                    priorities.push(Priority.LOW);
                    break;
                case Priority.MEDIUM:
                    priorities.push(Priority.MEDIUM);
                    break;
                case Priority.HIGH:
                    priorities.push(Priority.HIGH);
                    break;
            }
        }
        if (property === 'title') {
            object['filter'] = values[property]
        }
        if (property === 'fromDate') {
            object['fromDate'] = values[property]
        }
        if (property === 'toDate') {
            object['toDate'] = values[property]
        }
    }
    object['statuses'] = statuses;
    object['priorities'] = priorities;
    object['types'] = types;
    return object;
};


export const logoutUrl = 'https://login.qouark.app/logout';