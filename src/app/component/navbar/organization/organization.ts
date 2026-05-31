import { Component, DestroyRef, inject, signal } from '@angular/core';
import { UserService } from '../../../service/user';
import { AppStore } from '../../../store/app.store';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-organization',
  imports: [FormsModule , DatePipe],
  templateUrl: './organization.html',
})
export class Organization {
  showModal = false;
  store = inject(AppStore);
  newOrganization = {
    name: ''
  };
  private destroyed = inject(DestroyRef);
  private readonly inputSubject: Subject<string> = new Subject();
  
  currentFolderUuid = signal<string>(''); 
  isFolderModalOpen = signal<boolean>(false);
  folderName = signal<string>('');

  // Dropdowns and share folder modal signals
  activeDropdown = signal<string | null>(null);
  isShareModalOpen = signal<boolean>(false);
  selectedItemForShare = signal<any>(null);

  // New signals for Organization Sharing
  isOrgShareModalOpen = signal<boolean>(false);

  // Signals for user search and selection
  searchQuery = signal<string>('');
  selectedUserToShare = signal<any>(null);
  sharePermission = signal<'READ' | 'WRITE' | 'ADMIN'>('READ');

  ngOnInit() {
        this.inputSubject.pipe(
      debounceTime(500), 
      distinctUntilChanged(), 
      takeUntilDestroyed(this.destroyed)
    ).subscribe((query) => {
      if (query.trim().length > 0) {
        this.store?.searchUsers(query);
      }
    });

    this.store.getMyInvitations();
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.resetForm();
  }

  createOrganization() {
    if (!this.newOrganization.name.trim()) return;

    const form = new FormData();
    form.append('name', this.newOrganization.name);

    this.store.createOrganization(form);

    this.closeModal();
  }

  resetForm() {
    this.newOrganization = {
      name: ''
    };
  }

  toggleDropdown(id: string, event: Event): void {
    event.stopPropagation();
    this.activeDropdown.set(this.activeDropdown() === id ? null : id);
  }

  // --- FOLDER SHARE LOGIC ---
  openShareModal(item: any, event: Event): void {
    event.stopPropagation();
    this.selectedItemForShare.set(item);
    this.isShareModalOpen.set(true);
    this.activeDropdown.set(null);
    this.searchQuery.set('');
    this.selectedUserToShare.set(null);
    document.body.classList.add('overflow-hidden');
  }

  acceptInvitation(invitationUuid: string) {
    this.store.acceptInvitation(invitationUuid);
  }

  closeShareModal(): void {
    this.isShareModalOpen.set(false);
    this.selectedItemForShare.set(null);
    this.searchQuery.set('');
    this.selectedUserToShare.set(null);
    if (!this.isFolderModalOpen() && !this.isOrgShareModalOpen()) {
      document.body.classList.remove('overflow-hidden');
    }
  }

  shareFolder() {
    const item = this.selectedItemForShare();
    const selectedUser = this.selectedUserToShare();

    if (!item?.storageFolderUuid || !selectedUser?.userUuid) {
      console.error('Missing folder UUID or User UUID');
      return;
    }

    this.store.shareFolder({
      resourceUuid: item.storageFolderUuid,
      sharedWithUserUuid: selectedUser.userUuid,
      permission: this.sharePermission() 
    });

    this.selectedUserToShare.set(null);
    this.searchQuery.set('');
  }

  // --- ORGANIZATION SHARE LOGIC (NEW) ---
  openOrgShareModal(): void {
    this.isOrgShareModalOpen.set(true);
    this.searchQuery.set('');
    this.selectedUserToShare.set(null);
    document.body.classList.add('overflow-hidden');
  }

  closeOrgShareModal(): void {
    this.isOrgShareModalOpen.set(false);
    this.searchQuery.set('');
    this.selectedUserToShare.set(null);
    if (!this.isFolderModalOpen() && !this.isShareModalOpen()) {
      document.body.classList.remove('overflow-hidden');
    }
  }

  shareOrganization() {
    const selectedUser = this.selectedUserToShare();
    console.log('Sharing organization with user:', selectedUser);
    console.log('Selected permission:', this.sharePermission());
    if (!selectedUser?.userUuid) {
      console.error('Missing User UUID');
      return;
    }

    const form = new FormData();

form.append('startupUuid', this.store.organization().startupUuid); // or organizationUuid
form.append('email', selectedUser.email);
form.append('role', this.sharePermission()); // ADMIN | MEMBER

this.store.createInvitation(form);
    // Assuming you will add 'shareOrganization' to your store
    // You may also need to pass the current organization UUID here
    this.selectedUserToShare.set(null);
    this.searchQuery.set('');
  }

  // --- SHARED USER SEARCH LOGIC ---
  searchUsersByNameOrEmail(query: string) {
    this.searchQuery.set(query);
    this.selectedUserToShare.set(null); 
    this.inputSubject.next(query);
  }

  selectUser(user: any) {
    this.selectedUserToShare.set(user);
    this.searchQuery.set(user.name || user.email);
  }

  // --- FOLDER MODAL LOGIC ---
  openCreateFolderModal(): void {
    this.isFolderModalOpen.set(true);
    document.body.classList.add('overflow-hidden');
  }

  closeCreateFolderModal(): void {
    this.isFolderModalOpen.set(false);
    document.body.classList.remove('overflow-hidden');
    this.folderName.set('');
  }
}
