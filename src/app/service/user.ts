import { Injectable , inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { StorageService } from './storage';
import { Key } from '../enum/cache.key';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { IResponse } from '../interface/response';
import { IAuthentication } from '../interface/IAuthentication';
import { getFileFormData } from '../utils/fileutils';
import { IUser } from '../interface/user';
import { UpdatePassword } from '../interface/credential';


@Injectable()
export class UserService {
  private jwt = new JwtHelperService();
  private storage = inject(StorageService);
  private http = inject(HttpClient);

  private token: string = 'eyJraWQiOiJjMDdhYTQ5Yi1hMTViLTQwMTAtYTUyZi1jOTAyZmE1OGUyYTMiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJhNjY5M2Q3OS1hYzBkLTRiNGUtYjc1Yy0zYWVjOGY4NTAxMTMiLCJhdWQiOiJjbGllbnQiLCJuYmYiOjE3Nzc1MTE5NjksInNjb3BlIjpbIm9wZW5pZCJdLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAiLCJleHAiOjE3Nzc1OTgzNjksImlhdCI6MTc3NzUxMTk2OSwianRpIjoiMDFhM2E2OTYtNWQ4My00MTVlLTliOWYtZmE1MzZiZjhmZThjIiwiYXV0aG9yaXRpZXMiOiJVU0VSLHVzZXI6cmVhZCx1c2VyOnVwZGF0ZSx0aWNrZXQ6Y3JlYXRlLHRpY2tldDpyZWFkLHRpY2tldDp1cGRhdGUsY29tbWVudDpjcmVhdGUsY29tbWVudDpyZWFkLGNvbW1lbnQ6dXBkYXRlLGNvbW1lbnQ6ZGVsZXRlLHRhc2s6cmVhZCJ9.pHIMmgjHpRf6HjwJUstFLFWfQ-mgmER8tRHen0Xfq9KOAmRkKmwTQyqVDJdRxL9hN011SAOfMT-bHbqQw73QjfYixfbh-NI9T7Ez4ctfulEExjv6jUFacpBa6kN9j1wogjgEMMTQDR3WGNayg08hJvA4FSCQ_ETPKUp59UnHEhkvXdqVKJIl4K3tIFckFUzk8SpZiPUmHwmieIYJBTYemm3WvCXMIpLK4KGvSbcHyd8HwlLeu4KWxmYNsvL9Cffp2bvCxQxayIThuGawgQbsRTAIAAQQVzifuLGd4qk2zt9MBL3CqfSOyIMtduBMin8Ac0kbviGzKA58H-S8vdjVLA';


  register$ = (user :any) => <Observable<IResponse>>
  this.http.post<IResponse>(`https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/user/register`, user)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

    profile$ = () => <Observable<IResponse>>
  this.http.get<IResponse>(`https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/user/profile` )
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  update$ = (user: IUser) => <Observable<IResponse>>
  this.http.patch<IResponse>(`https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/user/update`, user  )
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

    updatePassword$ = (passwordRequest: UpdatePassword) => <Observable<IResponse>>
  this.http.patch<IResponse>(`https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/user/updatepassword`, passwordRequest  )
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  verifyAccountToken$ = (token :string) => <Observable<IResponse>>
  this.http.get<IResponse>(`https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/user/verify/account?token=${token}`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

    verifyPasswordToken$ = (token :string) => <Observable<IResponse>>
  this.http.get<IResponse>(`https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/user/verify/password?token=${token}`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

      createNewPassword$ = (request :{userUuid:string , token:string, password:string, confirmPassword:string }) => <Observable<IResponse>>
  this.http.post<IResponse>(`https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/user/resetpassword/reset`, request)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  resetPassword$ = (form : FormData) => <Observable<IResponse>>
  this.http.post<IResponse>(`https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/user/resetpassword`, form)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

    validateCode$ = (form : FormData) => <Observable<IAuthentication>>
  this.http.post<IResponse>(`https://login.qouark.app/oauth2/token`, form)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  
  createOrganization$ = (form : FormData) => <Observable<IResponse>>
  this.http.post<IResponse>(`https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/user/organization/create`, form)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  inviteUser$ = (form : FormData) => <Observable<IResponse>>
  this.http.post<IResponse>(`https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/user/invite`, form)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  acceptInvitation$ = (invitationUuid: string) => <Observable<IResponse>>
  this.http.post<IResponse>(`https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/user/invite/accept/${invitationUuid}`, {})
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  updatePhoto$ = (form: FormData) => <Observable<IResponse>>
  this.http.patch<IResponse>(`https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/user/photo`, form )
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );
    toggleAccountLocked$ = () => <Observable<IResponse>>
  this.http.patch<IResponse>(`https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/user/toggleaccountlocked` , {})
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

    toggleAccountExpired$ = () => <Observable<IResponse>>
  this.http.patch<IResponse>(`https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/user/toggleaccountexpired` , {})
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

    toggleAccountEnabled$ = () => <Observable<IResponse>>
  this.http.patch<IResponse>(`https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/user/toggleaccountenabled` , {})
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  enableMfa$ = () => <Observable<IResponse>>
  this.http.patch<IResponse>(`https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/user/mfa/enable` , {})
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

    disableMfa$ = () => <Observable<IResponse>>
  this.http.patch<IResponse>(`https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/user/mfa/disable` , {})
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  updateRole$ = (role: string) => <Observable<IResponse>>
  this.http.patch<IResponse>(`https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/user/updaterole` , { role })
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );
    users$ = () => <Observable<IResponse>>
  this.http.get<IResponse>(`https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/user/list` )
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

    getOrganization$ = () => <Observable<IResponse>>
  this.http.get<IResponse>(`https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/user/organization` )
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

getMyInvitations$ = () => <Observable<IResponse>>
  this.http.get<IResponse>(`https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/user/invitations` )
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );


  searchUsers$ = (q: string) => <Observable<IResponse>>
  this.http.get<IResponse>(`https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/user/search?q=${q}` )
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

    user$ = (userUuid: string) => <Observable<IResponse>>
    this.http.get<IResponse>
      (`https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/user/${userUuid}` )
      .pipe(
        tap(console.log),
        catchError(this.handleError)
      );

  refreshToken$ = (form: FormData) => <Observable<IAuthentication>>
   this.http.post<IAuthentication>
     (`https://login.qouark.app/oauth2/token`, form )
     .pipe(
       tap((response: IAuthentication) => {
          console.log('Token refreshed', response);
          this.storage.remove(Key.TOKEN);
          this.storage.remove(Key.REFRESH_TOKEN);
          this.storage.set(Key.TOKEN, response.access_token);
          this.storage.set(Key.REFRESH_TOKEN, response.refresh_token);
       }),
       catchError(this.handleError)
     );

     
  logOut = () => {
        this.storage.remove(Key.TOKEN);
        this.storage.remove(Key.REFRESH_TOKEN);
      };

  



  isAuthenticated = (): boolean => this.jwt.decodeToken<String>(this.storage.get(Key.TOKEN) || '') ? true : false;

  isTokenExpired = (): boolean => this.jwt.isTokenExpired(this.storage.get(Key.TOKEN) || '');

handleError = (httpErrorResponse: HttpErrorResponse): Observable<never> =>{

  console.error(httpErrorResponse);
  let error: string = 'An error occured. Please try again.';

  if(httpErrorResponse.error instanceof ErrorEvent){
    error = `A client error occurred: ${httpErrorResponse.error.message}`;
    return throwError(() => error);
  }
  if(httpErrorResponse.error.message){
    error = `${httpErrorResponse.error.message}`;
    return throwError(() => error);
  }
  if(httpErrorResponse.error.error){
    error = `Please login again`;
    return throwError(() => error);
  }
  return throwError(() => error); 
}


}
