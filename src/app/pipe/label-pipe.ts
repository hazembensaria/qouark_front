import { Pipe, PipeTransform } from '@angular/core';
import { ITicket } from '../interface/ticket';

@Pipe({
  name: 'LabelValue',
})
export class LabelValue implements PipeTransform {
  transform(tickets: ITicket[], args?: string[]): any {
    if(args[0] === 'count') {
       return [...new Set(tickets?.map(ticket => ticket.status))];
    }
    if(args[0] === 'type') {
      const types = [...new Set(tickets?.map(ticket => ticket.type))];
      return types.map(type =>[`${type}: ${this.ticketTotalByType(tickets, type)}`]);
    }
    if(args[0] === 'line') {
      const newTicket = tickets?.map(ticket => ({...ticket , createdAt: new Date(ticket.createdAt)}))
      .sort((ticket1 , ticket2) => ticket1.createdAt.getTime() - ticket2.createdAt.getTime());
      const groups = newTicket?.reduce((acc, ticket) => {
        const yearWeek = this.getWeekNumber(ticket.createdAt);
        if (!acc[yearWeek]) {
          acc[yearWeek] = [];
        }
        acc[yearWeek].push(ticket);
        return acc;
      }, {});
     const data: Number[] = [];
      for (const key in groups) {
        data.push(groups[key].length);
      }
      return { categories : data};
    }
   return {
    categories : [...new Set(tickets?.map(ticket => ticket.status))],
    position: 'top',
    labels:{
      offsetY: -18,
    },
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    },
    crosshairs: {
      fill: {
        color: [  '#D8E3F0','rgba(241, 143, 143, 0.4)']
      },
    },
    tooltip: {
      enabled: true,
      offsetY: -35,
    }
   };
  }

  private ticketTotalByType = (tickets: ITicket[], type : string): number =>  tickets?.filter(ticket => ticket.type === type).length;
  private getWeekNumber = (date: Date | any): string => {
    const firstDayOfYear: Date | any = new Date(date.getFullYear(), 0, 1);
    const daysPassed: number = Math.floor((date - firstDayOfYear) / (24 * 60 * 60 * 1000));
    const weekNumber: number = Math.ceil((daysPassed + firstDayOfYear.getDay() + 1) / 7);
    return `Year ${date.getFullYear()} - Week ${weekNumber.toString().padStart(2, '0')}`;
  }
}
