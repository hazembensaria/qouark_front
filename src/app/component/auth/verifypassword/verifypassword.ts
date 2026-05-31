import { Component, DestroyRef, inject, model, signal } from '@angular/core';
import { StorageService } from '../../../service/storage';
import { UserService } from '../../../service/user';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HotToastService } from '@ngxpert/hot-toast';
import { CommonModule } from '@angular/common';
import { getFormDate } from '../../../utils/fileutils';
import { EMPTY, flatMap, Observer, switchMap } from 'rxjs';
import { IResponse } from '../../../interface/response';
@Component({
  selector: 'app-verifypassword',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './verifypassword.html',
  styleUrl: './verifypassword.css',
})
export class Verifypassword {
  
    state = signal<{success?: boolean, token?: string, mode : 'verify' | 'reset', userUuid? : string, loading: boolean , message: string , error : string | any }>({mode: 'verify', success : false, loading: false, message: undefined, error: undefined});
    private router = inject(Router);
    private destroyRef = inject(DestroyRef);
    private storage = inject(StorageService);
    private userService = inject(UserService);
    private toastService = inject(HotToastService);
    private activatedRoute = inject(ActivatedRoute);

      ngOnInit():void {
    this.activatedRoute.queryParamMap.pipe(
      switchMap((params: ParamMap) => {
        const token = params.get('token');
        if(token){
          this.state.set({mode: 'verify', success : false, loading : true , message : undefined , error : undefined, token });
           return this.userService.verifyPasswordToken$(token);
        }else{
          this.state.set({mode: 'verify', success : false, loading :false , message :undefined , error : 'Invalid verification link.'});
          return EMPTY;
        }
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(this.verifySubscriber)
}



closeMessage = () => this.state.update(state => ({...state, message : undefined , error : undefined}));

createNewPassword = (form : NgForm) => {
  this.userService.createNewPassword$(form.value).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next : response => {
        this.state.update(state => ({...state, success : true, loading: false, message : response.message , error : undefined }));
        this.toastService.success(response.message);
      },
    error : error => {
        this.state.update(state => ({...state, success : false, loading: false, message : undefined , error }));
        this.toastService.error(error);

    },
    complete : () => {}
  });
};

private verifySubscriber: Observer<any> = {
  next : (response : IResponse)=> {
    this.state.update(state => ({...state, loading:false , mode: 'reset', userUuid : response.data.user.userUuid , message : `${response.message} for ${response.data.user.email}` , error : undefined}));
    this.toastService.success("Link verification successful. Please reset your password.");
  },
error : (error : string) => {
    this.state.set({mode: 'verify', loading :false , message :undefined , error });
    this.toastService.error(error);
},
complete : () => {}
};
  
}
