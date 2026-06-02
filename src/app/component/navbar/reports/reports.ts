import { Component, HostListener, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { AppStore } from '../../../store/app.store';
import { getValue } from '../../../utils/fileutils';

@Component({
  selector: 'app-reports',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './reports.html',
})
export class Reports {
  readonly store = inject(AppStore);
  private readonly location = inject(Location);
  private readonly route = inject(ActivatedRoute);

  isStatusMenuOpen = signal<boolean>(false);
  isTypeMenuOpen = signal<boolean>(false);
  isPriorityMenuOpen = signal<boolean>(false);

  Menu = Menu;

  projectUuid = signal<string | null>(null);

  goBack = () => this.location.back();

  constructor() {
    this.projectUuid.set(this.route.snapshot.paramMap.get('projectUuid'));
  }

  toggleMenu = (menu: Menu) => {
    switch (menu) {
      case Menu.STATUS: {
        this.isStatusMenuOpen.update(open => !open);
        this.isTypeMenuOpen.set(false);
        this.isPriorityMenuOpen.set(false);
        break;
      }
      case Menu.PRIORITY: {
        this.isPriorityMenuOpen.update(open => !open);
        this.isTypeMenuOpen.set(false);
        this.isStatusMenuOpen.set(false);
        break;
      }
      case Menu.TYPE: {
        this.isTypeMenuOpen.update(open => !open);
        this.isStatusMenuOpen.set(false);
        this.isPriorityMenuOpen.set(false);
        break;
      }
      default: {
        this.closeMenu();
      }
    }
  };

  @HostListener('document:click', ['$event'])
  onClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const status = target.closest('.status');
    const type = target.closest('.type');
    const priority = target.closest('.priority');

    if (!status) {
      this.isStatusMenuOpen.set(false);
    }
    if (!type) {
      this.isTypeMenuOpen.set(false);
    }
    if (!priority) {
      this.isPriorityMenuOpen.set(false);
    }
  };

  report = (form: NgForm) => {
    this.closeMenu();

    const query = getValue(form.value);

    const request = {
      ...query,
      projectUuid: this.projectUuid(),
    };

    this.store.setReportRequest(request);
    this.store.getReport(request);
  };

  downloadPDF = () => {
    this.closeMenu();
    const request = this.store.reportRequest();
    this.store.downloadReport(request);
  };

  closeMenu = () => {
    this.isTypeMenuOpen.set(false);
    this.isStatusMenuOpen.set(false);
    this.isPriorityMenuOpen.set(false);
  };
}

enum Menu {
  STATUS = 'STATUS',
  TYPE = 'TYPE',
  PRIORITY = 'PRIORITY',
}