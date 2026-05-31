import { Injectable , inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { StorageService } from './storage';
import { Key } from '../enum/cache.key';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { IResponse } from '../interface/response';
import { IAuthentication } from '../interface/IAuthentication';


@Injectable()
export class NotificationService {
  private http = inject(HttpClient);


  messages$ = () => <Observable<IResponse>>
  this.http.get<IResponse>(`https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/notification/messages` )
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

    sendMessages$ = (form:FormData) => <Observable<IResponse>>
  this.http.post<IResponse>(`https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/notification/reply`, form )
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  replyToMessage$ = (form:FormData) => <Observable<IResponse>>
  this.http.post<IResponse>(`https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/notification/reply`, form )
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

    getConversations$ = (conversationId: string) => <Observable<IResponse>>
  this.http.get<IResponse>(`https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/notification/messages/${conversationId}` )
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  sendMessage$ = (form: FormData) => <Observable<IResponse>>
  this.http.post<IResponse>(`https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/notification/messages`, form )
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  conversation$ = (conversationId: string) => <Observable<IResponse>>
  this.http.get<IResponse>(`https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/notification/messages/${conversationId}`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

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
