import { Component, DestroyRef, inject, signal } from '@angular/core';
import { StorageService } from '../../../service/storage';
import { UserService } from '../../../service/user';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HotToastService } from '@ngxpert/hot-toast';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  state = signal<{loading: boolean , message: string , error : string | any }>({loading: false, message: undefined, error: undefined});
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private storage = inject(StorageService);
  private userService = inject(UserService);
  private toastService = inject(HotToastService);

  ngOnInit():void {
    if(this.userService.isAuthenticated() && !this.userService.isTokenExpired()){ 
      this.storage.getRedirectUrl() ? this.router.navigate([this.storage.getRedirectUrl()]) : this.router.navigate(['/dashboard']);
      return;
    
  }
}



closeMessage = () => this.state.set({loading :false , message : undefined , error : undefined});


register = (form : NgForm) => {
  this.state.set({loading : true , message : undefined , error : undefined});
  this.userService.register$(form.value).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next : response => {
        this.state.set({loading :false , message : response.message , error : undefined});
        this.toastService.success(response.message);
      },
    error : error => {
        this.state.set({loading :false , message :undefined , error });
        this.toastService.error(error);

    },
    complete : () => form.reset()
  });
};
}
