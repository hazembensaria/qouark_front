import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AppStore } from '../../../../store/app.store';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shared',
  imports: [CommonModule , RouterModule , RouterLink],
  templateUrl: './shared.html',
})
export class Shared {
   store = inject(AppStore);
  private router = inject(Router);
  private destroyed = inject(DestroyRef);

  // UI state
  viewMode = signal<'grid' | 'list'>('grid');
  loading = signal<boolean>(false);

  // data
  sharedFiles = signal<any[]>([]);
  sharedFolders = signal<any[]>([]);

  constructor() {
    this.loadSharedData();
  }

  loadSharedData() {
    // this.loading.set(true);
    this.store.getSharedFiles();
    this.store.getSharedFolders();
  }

  toggleView(mode: 'grid' | 'list') {
    this.viewMode.set(mode);
  }

  openFile(file: any) {
    if (file?.uri) {
      window.open(file.uri, '_blank');
    }
  }

  openFolder(folder: any) {
    this.router.navigate(['/files/folder', folder.storageFolderUuid]);
  }

  getIcon(file: any) {
    if (file.extension === 'pdf') return '📄';
    if (file.extension === 'png' || file.extension === 'jpg') return '🖼️';
    return '📄';
  }
}
