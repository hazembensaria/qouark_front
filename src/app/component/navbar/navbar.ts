import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive } from "@angular/router";
import { HostListener } from '@angular/core';
import { AppStore } from '../../store/app.store';
import { UserService } from '../../service/user';
import { StorageService } from '../../service/storage';
import { logoutUrl } from '../../utils/fileutils';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterOutlet, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
      collapsed = false;
      protected store = inject(AppStore);
      private userService = inject(UserService);
      private storage = inject(StorageService);

 // sidebar.component.ts (only links part important)
mainLinks = [
  { label: 'Dashboard', route: '/dashboard', active: false,  iconClass: 'pi pi-home' },
  { label: 'Projects', route: '/projects', active: false, iconClass: 'pi pi-box' },
  { label: 'Chat', route: '/messages', active: false, unread: this.store?.unreadMessageCount(), iconClass: 'pi pi-comments' },
  { label: 'Files', route: '/files', active: false, iconClass: 'pi pi-folder' },
  { label: 'Calendar', route: '/calendar', active: false, iconClass: 'pi pi-calendar' }
];

bottomLinks = [
  { label: 'Notifications', route: '/notifications', iconClass: 'pi pi-bell' },
  { label: 'Integrations', route: '/integrations', iconClass: 'pi pi-link' },
  { label: 'Organization settings', route: '/settings', iconClass: 'pi pi-cog' }
];

  // sidebar.component.ts
profileMenuOpen = false;

ngOnInit() {
  this.store.getProfile();
  this.store?.getOrganization();
  this.store.getMessages();
}


toggleProfileMenu() {
  this.profileMenuOpen = !this.profileMenuOpen;
}
// optional: close menu when collapsing sidebar
toggleSidebar() {
  this.collapsed = !this.collapsed;
  if (this.collapsed) this.profileMenuOpen = false;
}

@HostListener('document:click')
closeProfileMenuOnOutsideClick() {
  this.profileMenuOpen = false;
}

logOut = () => {
  this.userService.logOut();
  this.storage.removeRedirectUrl();
  window.location.href = logoutUrl;
}
}
