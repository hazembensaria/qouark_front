import { Component, effect, EventEmitter, inject, Output } from '@angular/core';
import { IProject } from '../../../interface/project';
import { TicketService } from '../../../service/ticket';
import { FormsModule } from '@angular/forms';
import { AppStore } from '../../../store/app.store';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-project',
  imports: [FormsModule, RouterLink],
  templateUrl: './project.html',
})
export class Project {

  showModal = false;
  store = inject(AppStore);

  newProject = {
    name: '',
    description: '',
    status: 'ACTIVE' as 'ACTIVE' | 'COMPLETED' | 'ARCHIVED'
  };

  constructor() {}

  initEffect = effect(() => {
    const org = this.store.organization();

    if (org?.startupUuid) {
      this.store.getProjectsByStartup(org.startupUuid);
    }
  });



  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.resetForm();
  }

  createProject(): void {

    if (!this.newProject.name.trim()) return;

    const form = new FormData();

    form.append('name', this.newProject.name);
    form.append('organizationUuid', this.store?.organization().startupUuid);
    form.append('description', this.newProject.description);
    form.append('status', this.newProject.status);
    console.log(form.get('name'), form.get('description'), form.get('status'));
    console.log("this is the project form data");
    this.store.createProject(form);
    this.closeModal();
  }

  resetForm(): void {
    this.newProject = {
      name: '',
      description: '',
      status: 'ACTIVE'
    };
  }
}
