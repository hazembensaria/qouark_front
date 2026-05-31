import { Component, DestroyRef, inject, input, signal, TemplateRef, ViewContainerRef } from '@angular/core';
import { AppStore } from '../../../../store/app.store';
import { DialogService } from '@ngneat/dialog';
import { ModalService } from '../../../../service/modal';
import { CommonModule , Location, NgClass } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { getFormDate } from '../../../../utils/fileutils';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, switchMap } from 'rxjs';

@Component({
  selector: 'app-ticket-detail',
  imports: [CommonModule , FormsModule, NgClass],
  templateUrl: './ticket-detail.html',
})
export class TicketDetail {
  ticketUuid = input<string>();
  readonly mode = signal<'view' | 'edit'>('view');
  readonly commentMode = signal<{mode: 'view' | 'edit' , commentUuid: string}>({mode: 'view' , commentUuid: null});
  readonly store = inject(AppStore);
  private destroyRef = inject(DestroyRef);
  private viewRef = inject(ViewContainerRef);
  private modalService = inject(ModalService);
  private readonly location = inject(Location);
  private dialogService = inject(DialogService);
  


  ngOnInit(): void{
    if(this.ticketUuid()){
      this.store?.getTicket(this.ticketUuid());
    }
  }

  goBack = () => this.location.back();

  openModal = (template: TemplateRef<HTMLDivElement>) => this.dialogService.open(template , {id: new Date().getTime().toString()});

  closeModal = () => this.dialogService.closeAll();

  switchMode = () => this.mode() === 'view' ? this.mode.update(_=>'edit') : this.mode.update(_=>'view');
  
  toggleCommentMode = (mode: 'view' | 'edit', commentUuid: string) => this.commentMode.set({mode, commentUuid});

  updateTicket = (ticketForm: NgForm) => {
    this.mode.update(_=> 'view');
    this.store.updateTicket({...ticketForm.value, dueDate : ticketForm.value.dueDate.split('T')[0]});
  };

    addComment = (commentForm: NgForm) => {
    this.store.addComment(getFormDate(commentForm.value , null));
    commentForm.reset({comment : '' , ticketUuid: this.store.ticketDetail().ticket.ticketUuid});
  }

  updateComment = (commentUuid: string , comment:string) => {
    if(comment.trim().length > 0){
      this.commentMode.set({mode: 'view' , commentUuid: null});
      this.store.updateComment(getFormDate({commentUuid, comment}, null));
    }
  }

  uploadFiles = (files: FileList) => this.store.uploadFiles(getFormDate({ticketUuid : this.store.ticketDetail().ticket.ticketUuid} , Array.from(files))); 

  downloadFile = (fileUuid: string) => this.store.downloadFile(fileUuid);

  createTask = (taskForm: NgForm) => {
    this.store.createTask(getFormDate(taskForm.value , null));
    taskForm.reset();
    this.closeModal();

  };

  deleteComment = (commentUuid: string) => {
    this.modalService
    .open(this.viewRef , {message: "Are you sure you want to delete this comment?" , type: 'danger' , subtitle: "This action cannot be undone"})
    .pipe(
    switchMap(()=>{
      this.store.deleteComment(getFormDate({commentUuid} , null));
      return EMPTY;
    }),takeUntilDestroyed(this.destroyRef)).subscribe();
  };

  updateAssignee = (ticketUuid: string , assigneeUuid: string) =>{ 
      console.log(assigneeUuid);
    this.store.updateAssignee(getFormDate({ticketUuid, assigneeUuid} , null));

}
  

    deleteFile = (fileUuid: string , fileName: string) => {
    this.modalService
    .open(this.viewRef , {message: `Are you sure you want to delete this file: "${fileName}"?` , type: 'danger' , subtitle: "This action cannot be undone"})
    .pipe( 
    switchMap(()=>{
      this.store.deleteFile(getFormDate({fileUuid} , null));
      return EMPTY;
    }),takeUntilDestroyed(this.destroyRef)).subscribe();
  }
}
