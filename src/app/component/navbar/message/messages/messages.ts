import { Component, DestroyRef, inject, signal, TemplateRef } from '@angular/core';
import { MessageGroup } from '../../../../pipe/message.pipe';
import { CommonModule, Location } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DialogService } from '@ngneat/dialog';
import { AppStore } from '../../../../store/app.store';
import { getFormDate } from '../../../../utils/fileutils';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-messages',
  imports: [CommonModule, FormsModule, RouterLink, MessageGroup],
  templateUrl: './messages.html',
})
export class Messages {
  private readonly location = inject(Location);
  readonly store = inject(AppStore);
  private dialogService = inject(DialogService);
  

  ngOnInit(): void {
      this.store?.getUsers();
    this.store?.getMessages();
  }

  saveMessage = (form: NgForm) => {
    this.store.sendMessage(getFormDate(form.value, null));
    this.closeModal();
  };
  
  openModal = (templage: TemplateRef<HTMLDivElement>) => this.dialogService.open(templage, { id: new Date().getTime().toString() });
  
  closeModal = () => this.dialogService.closeAll();




  
}
