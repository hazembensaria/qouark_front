import { NgClass } from '@angular/common';
import { Component, ElementRef, inject, input, output } from '@angular/core';


@Component({
  selector: 'app-modal',
  imports: [NgClass],
  templateUrl: './modal.html',
  styleUrl: './modal.css'
})
export class Modal {
  private elementRef = inject(ElementRef);
  message = input<string>('');
  subtitle = input<string>('');
  type = input<'success' | 'danger' | 'warning' >('success');
  closeEvent = output<void>();
  submitEvent = output<Event>();


  constructor() {}
  
  close = () => {
    this.elementRef.nativeElement.remove();
    this.closeEvent.emit();
  }

  submit = (event: Event) => {
    this.elementRef.nativeElement.remove();
    this.submitEvent.emit(event);
  }


}
