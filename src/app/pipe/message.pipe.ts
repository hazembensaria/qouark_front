import { Pipe, PipeTransform } from '@angular/core';
import { IMessage } from '../interface/message';

@Pipe({ name: 'MessageGroup' })
export class MessageGroup implements PipeTransform {
  transform(messages: IMessage[], args: string[]): any {
    const emails = new Set();
    const groups = messages?.reduce((acc, message, index, array) => {
        emails.add(message.senderEmail);
        emails.add(message.receiverEmail);
        let key = message.conversationId;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(message);
        return acc;
    }, {});
    const data = [];
    for (const key in groups) {
        data.push({ conversationId: key, status: this.getEmails(groups[key], args[0])[2],  participants: this.getEmails(groups[key], args[0])[0], images: this.getEmails(groups[key], args[0])[1], subject: groups[key][0].subject, messages: groups[key] });
    }
    console.log(data)
    return data;    
  }

  private getEmails = (messages: IMessage[], email: string) => {
    const emails = new Set();
    const images = new Set();
    const newMessageCount = [];
    messages.forEach(message => {
        images.add(message.senderImageUri);
        emails.add(message.senderEmail === email ? 'You' : message.senderEmail);
        if (message.status === 'UNREAD') {
            newMessageCount.push(message.status);
        }
    });
    return [[...emails], [...images], newMessageCount.length > 0 ? 'UNREAD' : 'OPENED'];
  };

}