import { Component, DestroyRef, inject, signal, ViewContainerRef } from '@angular/core';
import { AppStore } from '../../../store/app.store';
import { CommonModule, Location } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HotToastService } from '@ngxpert/hot-toast';
import { Settings } from '../../../enum/settings';
import { ModalService } from '../../../service/modal';
import { EMPTY, switchMap } from 'rxjs';
import { getFileFormData, getFormDate } from '../../../utils/fileutils';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule, ],
  templateUrl: './profile.html',
})
export class Profile {
  Settings = Settings;
  readonly store = inject(AppStore);
  readonly mode = signal<'view' | 'edit'>('view');
  private destroyRef = inject(DestroyRef);
  private readonly location = inject(Location);
  private toastService = inject(HotToastService);
    private viewRef = inject(ViewContainerRef);
  private modalService = inject(ModalService);
  

  ngOnInit(): void {
    if(!this.store.profile) {
      this.store.getProfile();
    }
  }

  goBack = () => this.location.back();
  switchMode = () => this.mode() === 'view' ? this.mode.update(_=>'edit') : this.mode.update(_=>'view');


  updatePhoto = (file: File) => this.store.updatePhoto(getFileFormData(file));

toggleMfa = (mode: 'enable' | 'disable') => mode === 'enable' ? this.store.enableMfa() : this.store.disableMfa();

updateRole = (role: string) => this.store.updateRole(role);

updateUser = (form : NgForm) =>{
  this.store.updateUser(form.value);
  this.mode.update(_=>'view');
}

updatePassword = (form : NgForm) => {
  this.store.updatePassword(form.value);
  form.reset();
}

toggleSettings = (settings : Settings) =>{
  if(this.store.profile()?.role === 'ADMIN' || this.store.profile()?.role === 'SUPER_ADMIN'){
    switch(settings){
      case Settings.EXPIRED:
        this.toggleAccountExpired();
        break;
      case Settings.LOCKED:
        this.toggleAccountLocked();
        break;
      case Settings.ENABLED:
        this.toggleAccountEnabled();
        break;
    }

  }else{
    this.toastService.error('You don\'t have permession to change this setting');
  }
}


  toggleAccountExpired = () => {
    this.modalService
    .open(this.viewRef , {message: "Are you sure you want to expire this account?" , type: 'warning' , subtitle: "Updating this setting will prevent the user from logging in"})
    .pipe(
    switchMap(()=>{
      this.store.toggleAccountExpired();
      return EMPTY;
    }),takeUntilDestroyed(this.destroyRef)).subscribe();
  };

    toggleAccountEnabled = () => {
    this.modalService
    .open(this.viewRef , {message: "Are you sure you want to enable this account?" , type: 'warning' , subtitle: "Updating this setting will allow the user to log in"})
    .pipe(
    switchMap(()=>{
      this.store.toggleAccountEnabled();
      return EMPTY;
    }),takeUntilDestroyed(this.destroyRef)).subscribe();
  };

     toggleAccountLocked = () => {
    this.modalService
    .open(this.viewRef , {message: "Are you sure you want to lock this account?" , type: 'warning' , subtitle: "Updating this setting will prevent the user from logging in"})
    .pipe(
    switchMap(()=>{
      this.store.toggleAccountLocked();
      return EMPTY;
    }),takeUntilDestroyed(this.destroyRef)).subscribe();
  };


  

}
