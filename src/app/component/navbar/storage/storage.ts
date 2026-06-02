import { Component, DestroyRef, effect, HostListener, inject, signal, ViewContainerRef } from '@angular/core';
import { AppStore } from '../../../store/app.store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { getFormDate } from '../../../utils/fileutils';
import { ModalService } from '../../../service/modal';

@Component({
  selector: 'app-storage',
  imports: [CommonModule, FormsModule, RouterLink , RouterModule],
  templateUrl: './storage.html',
})
export class Storage {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  protected store = inject(AppStore);
    private modalService = inject(ModalService);
  private destroyed = inject(DestroyRef);
  private readonly inputSubject: Subject<string> = new Subject();
    private destroyRef = inject(DestroyRef);
  private viewRef = inject(ViewContainerRef);
  currentFolderUuid = signal<string>(''); 
  isFolderModalOpen = signal<boolean>(false);
  folderName = signal<string>('');

  // Dropdowns and share modal signals
  activeDropdown = signal<string | null>(null);
  isShareModalOpen = signal<boolean>(false);
  selectedItemForShare = signal<any>(null);

  // New signals for user search and selection
  searchQuery = signal<string>('');
  selectedUserToShare = signal<any>(null);

  constructor() {
    this.route.paramMap.subscribe(params => {
      const folderUuid = params.get('uuid');
      if (folderUuid) {
        this.store.getCurrentStorageFolder(folderUuid);
        this.currentFolderUuid.set(folderUuid);
        this.loadCurrentFolder();
      } else {
        this.store.getRootFolder();
        effect(() => {
          const rootFolder = this.store.rootFolder();
          if (!rootFolder) return;
          this.currentFolderUuid.set(rootFolder.storageFolderUuid);
          this.store.getCurrentStorageFolder(rootFolder.storageFolderUuid);
          this.loadCurrentFolder();
        });
      }
    });
  }

  ngOnInit() {
    this.store.getQuota();
    this.inputSubject.pipe(
      debounceTime(500), 
      distinctUntilChanged(), 
      takeUntilDestroyed(this.destroyed)
    ).subscribe((query) => {
      if (query.trim().length > 0) {
        this.store?.searchUsers(query);
      }
    });
  }

  @HostListener('document:click')
  onDocumentClick() {
    if (this.activeDropdown() !== null) {
      this.activeDropdown.set(null);
    }
  }

  loadCurrentFolder(): void {
    const folderUuid = this.currentFolderUuid();
    this.store.getStorageFolders(folderUuid);
    this.store.getStorageFiles?.(folderUuid);
  }

  openFolder(folderUuid: string): void {
    this.router.navigate(['/files/folder', folderUuid]);
  }

  goBackToRoot(): void {
    this.router.navigate(['/files']);
  }

  uploadFiles = (files: FileList) => {
    this.store.uploadStorageFiles(getFormDate({ folderUuid: this.currentFolderUuid() }, Array.from(files)));
  };

  downloadFile = (fileUuid: string) => this.store.downloadStoredFile(fileUuid);

  openCreateFolderModal(): void {
    this.isFolderModalOpen.set(true);
    document.body.classList.add('overflow-hidden');
  }

  closeCreateFolderModal(): void {
    this.isFolderModalOpen.set(false);
    document.body.classList.remove('overflow-hidden');
    this.folderName.set('');
  }

  saveFolder(): void {
    const name = this.folderName().trim();
    if (!name) return;
    const formData = new FormData();
    formData.append('name', name);
    formData.append('parentFolderUuid', this.currentFolderUuid());
    this.store.createStorageFolder?.(formData);
    this.closeCreateFolderModal();
  }

  hasNoFolders(): boolean {
    return !this.store.storageFolders()?.length;
  }

  hasNoFiles(): boolean {
    return !this.store.storageFiles?.()?.length;
  }

  onBackdropClick(event: MouseEvent): void {
    const targetId = (event.target as HTMLElement).id;
    if (targetId === 'folder-modal-backdrop') {
      this.closeCreateFolderModal();
    } else if (targetId === 'share-modal-backdrop') {
      this.closeShareModal();
    }
  }

  toggleDropdown(id: string, event: Event): void {
    event.stopPropagation();
    this.activeDropdown.set(this.activeDropdown() === id ? null : id);
  }

  openShareModal(item: any, event: Event): void {
    event.stopPropagation();
    this.selectedItemForShare.set(item);
    console.log('Selected item for sharing:', item);
    this.isShareModalOpen.set(true);
    this.activeDropdown.set(null);
    this.searchQuery.set('');
    this.selectedUserToShare.set(null);
    document.body.classList.add('overflow-hidden');
  }

  closeShareModal(): void {
    this.isShareModalOpen.set(false);
    this.selectedItemForShare.set(null);
    this.searchQuery.set('');
    this.selectedUserToShare.set(null);
    if (!this.isFolderModalOpen()) {
      document.body.classList.remove('overflow-hidden');
    }
  }
  
  searchUsersByNameOrEmail(query: string) {
    this.searchQuery.set(query);
    this.selectedUserToShare.set(null); // Reset selection when typing
    this.inputSubject.next(query);
  }

        deleteFolder = (folderUuid: string , folderName: string ) => {
      this.modalService
      .open(this.viewRef , {message: `Are you sure you want to delete this folder: "${folderName}"?` , type: 'danger' , subtitle: "This action cannot be undone"})
      .pipe( 
      switchMap(()=>{
        this.store.deleteStorageFolder(folderUuid);
        return EMPTY;
      }),takeUntilDestroyed(this.destroyRef)).subscribe();
    }

      deleteFile = (fileUuid: string , fileName: string ) => {
      this.modalService
      .open(this.viewRef , {message: `Are you sure you want to delete this file: "${fileName}"?` , type: 'danger' , subtitle: "This action cannot be undone"})
      .pipe( 
      switchMap(()=>{
        this.store.deleteStorageFile(fileUuid);
        return EMPTY;
      }),takeUntilDestroyed(this.destroyRef)).subscribe();
    }

  selectUser(user: any) {
    this.selectedUserToShare.set(user);
    // Update the input to show the selected user's name or email
    this.searchQuery.set(user.name || user.email);
    // Optional: clear the store's search results so the dropdown hides
    // this.store.clearSearchResults(); 
  }

sharePermission = signal<'READ' | 'WRITE' | 'ADMIN'>('READ');

  // ... (existing code)

  shareFolder() {
    const item = this.selectedItemForShare();
    console.log('Sharing item:', item);
    const selectedUser = this.selectedUserToShare();


    if(item.uri) {
       this.store.shareFile({
      resourceUuid: item.storageFileUuid, // Pick up the missing resource UUID here
      sharedWithUserUuid: selectedUser.userUuid,
      permission: this.sharePermission()  // Pass the dynamically selected permission
    });
      console.warn('File sharing is not implemented yet.'); // Placeholder for file sharing logic
    // Optional: Reset the search after successfully sharing
    this.selectedUserToShare.set(null);
    this.searchQuery.set('');
    }else{
      
    // Ensure we have both the folder/file to share AND the user to share with
    if (!item?.storageFolderUuid || !selectedUser?.userUuid) {
      console.error('Missing folder UUID or User UUID');
      return;
    }

    this.store.shareFolder({
      resourceUuid: item.storageFolderUuid, // Pick up the missing resource UUID here
      sharedWithUserUuid: selectedUser.userUuid,
      permission: this.sharePermission()  // Pass the dynamically selected permission
    });

    // Optional: Reset the search after successfully sharing
    this.selectedUserToShare.set(null);
    this.searchQuery.set('');
    }
  }
}