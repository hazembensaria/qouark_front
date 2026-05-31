import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ExtractArrayValue',
})
export class ExtractArrayValue implements PipeTransform {
  transform(value: number, args: string): number[] {
   
    return args === 'number' ? [...Array(value).keys()] : []; 
  }


  
}
