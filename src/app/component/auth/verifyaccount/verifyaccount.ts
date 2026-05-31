import { Component, DestroyRef, inject, signal } from '@angular/core';
import { StorageService } from '../../../service/storage';
import { UserService } from '../../../service/user';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HotToastService } from '@ngxpert/hot-toast';
import { CommonModule } from '@angular/common';
import { EMPTY, Observer, switchMap } from 'rxjs';
import { IResponse } from '../../../interface/response';
@Component({
  selector: 'app-verifyaccount',
  imports: [],
  templateUrl: './verifyaccount.html',
  styleUrl: './verifyaccount.css',
})
export class Verifyaccount {
   state = signal<{loading: boolean , message: string , error : string | any }>({loading: false, message: undefined, error: undefined});
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
          this.state.set({loading : true , message : undefined , error : undefined});
          return this.userService.verifyAccountToken$(token);
        }else{
          this.state.set({loading :false , message :undefined , error : 'Invalid verification link.'});
          return EMPTY;
        }
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(this.verifyAccount)
}



closeMessage = () => this.state.set({loading :false , message : undefined , error : undefined});


private verifyAccount: Observer<any> = {
  next : (response : IResponse)=> {
    this.state.set({loading :false , message : response.message , error : undefined});
    this.toastService.success(response.message);
  },
error : (error : string) => {
    this.state.set({loading :false , message :undefined , error });
    this.toastService.error(error);
},
complete : () => {}
};
}
