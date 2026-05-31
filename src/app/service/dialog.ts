import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TemplateRef } from '@angular/core';

export interface DialogConfig {
  id?: string;
  closeOnBackdrop?: boolean;
}

export interface ActiveDialog {
  template: TemplateRef<unknown>;
  config: DialogConfig;
}

@Injectable({ providedIn: 'root' })
export class DialogService {
  private dialogSubject = new BehaviorSubject<ActiveDialog | null>(null);
  dialog$ = this.dialogSubject.asObservable();

  open(template: TemplateRef<unknown>, config: DialogConfig = {}): void {
    this.dialogSubject.next({
      template,
      config: { closeOnBackdrop: true, ...config }
    });
  }

  close(id?: string): void {
    const current = this.dialogSubject.value;
    if (!current) return;

    if (!id || current.config.id === id) {
      this.dialogSubject.next(null);
    }
  }
}