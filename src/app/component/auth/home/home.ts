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
import { IAuthentication } from '../../../interface/IAuthentication';
import { Key } from '../../../enum/cache.key';
import { getFormDate } from '../../../utils/fileutils';
@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
    loading = signal<boolean>(true);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private storage = inject(StorageService);
  private userService = inject(UserService);
  private toastService = inject(HotToastService);
  private activatedRoute = inject(ActivatedRoute);


  ngOnInit():void {
    if(this.userService.isAuthenticated() && !this.userService.isTokenExpired()){ 
      this.storage.getRedirectUrl() ? this.router.navigate([this.storage.getRedirectUrl()]) : this.router.navigate(['/dashboard']);
      return;
  }else{
        this.activatedRoute.queryParamMap.pipe(
      switchMap((params: ParamMap) => {
        const code = params.get('code');
        if(code){
          this.loading.set(true);
          return this.userService.validateCode$(this.formData(code));
        }else{
          this.loading.set(false);
          return EMPTY;
        }
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(this.verifyCode)

  }
}

private verifyCode: Observer<any> = {
  next : (response : IAuthentication)=> {
    this.saveToken(response);
    this.storage.getRedirectUrl() ? this.router.navigate([this.storage.getRedirectUrl()]) : this.router.navigate(['/dashboard']);

  },
error : (error : string) => {
    this.loading.set(false);
    this.toastService.error(error);
},
complete : () => {}
};

private formData = (code:string) => getFormDate({code , client_id : 'client', grant_type : 'authorization_code', redirect_uri : 'http://localhost:3000', code_verifier : '5AL6Bh2JdoIj4seR8UooJcW8GF3W-ofYfAz3RVpXiaJ-Pn_tXjjc_XO9yWTPbqA1sd-ZZC04eVNGJ8PHC1Gr-KT2TcINTFT4WMKjARb5OziA3XKoQpDIuRN5E1dif_9A'}, null);

private saveToken = (response : IAuthentication) => {
  console.log(response.refresh_token);
  this.storage.set(Key.TOKEN, response.access_token);
  this.storage.set(Key.REFRESH_TOKEN, response.refresh_token);
}

}
