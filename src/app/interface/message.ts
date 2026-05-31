export interface IMessage{
    messageId : number;
    messageUuid : string;
    conversationId : string;
    createdAt : string;
    message : string;
    receiverEmail : string;
    receiverFirstName : string;
    receiverLastName : string;
    receiverImageUri : string;
    receiverUuid : string;
    senderEmail : string;
    senderFirstName : string;
    senderLastName : string;    
    senderImageUri : string;
    senderUuid : string;
    status : 'READ' | 'UNREAD';
    subject : string;
    updatedAt : string;
}