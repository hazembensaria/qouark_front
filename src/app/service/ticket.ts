import { Injectable , inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { StorageService } from './storage';
import { Key } from '../enum/cache.key';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { IResponse } from '../interface/response';
import { IAuthentication } from '../interface/IAuthentication';
import { IQuery } from '../interface/query';
import { ITicket } from '../interface/ticket';


@Injectable()
export class TicketService {
  private http = inject(HttpClient);
  tickets$ = ({ projectUuid, query }: { projectUuid: string; query: IQuery }) => <Observable<IResponse>>
  this.http.get<IResponse>(`https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/ticket/list?projectUuid=${projectUuid}&page=${query.page}&size=${query.size}&status=${query.status}&type=${query.type}&filter=${query.filter}`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  allTickets$ = () => <Observable<IResponse>>
  this.http.get<IResponse>(`https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/ticket/all`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );


  ticket$ = (ticketUuid: string) => <Observable<IResponse>>
  this.http.get<IResponse>(`https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/ticket/${ticketUuid}`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  getProjectsByStartup$ = (startupUuid: string) => <Observable<IResponse>>
  this.http.get<IResponse>(`https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/ticket/projects/${startupUuid}`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );


project$ = (form: FormData)=> <Observable<IResponse>>
   this.http.post<IResponse>(`https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/ticket/project/create`,form)
   .pipe(
    tap(console.log),
    catchError(this.handleError)
  );


  createTicket$ = (form:FormData) => <Observable<IResponse>>
  this.http.post<IResponse>(`https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/ticket/create`, form)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  updateTicket$ = (ticket: ITicket) => <Observable<IResponse>>
  this.http.put<IResponse>(`https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/ticket/update`, ticket)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );
  addComment$ = (form: FormData) => <Observable<IResponse>>
  this.http.post<IResponse>(`https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/ticket/comment/create`, form)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );
  updateComment$ = (form: FormData) => <Observable<IResponse>>
  this.http.put<IResponse>(`https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/ticket/comment/update`, form)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );
  deleteComment$ = (form: FormData) => <Observable<IResponse>>
  this.http.delete<IResponse>(`https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/ticket/comment/delete`, {body: form})
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );
    deleteFile$ = (form: FormData) => <Observable<IResponse>>
  this.http.delete<IResponse>(`https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/ticket/file/delete`, {body: form})
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );
  updateAssignee$ = (form: FormData) => <Observable<IResponse>>
  
  this.http.put<IResponse>(`https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/ticket/update/assignee`, form )
  .pipe(
    tap(console.log),
    catchError(this.handleError, )
    
  );
  uploadFiles$ = (form: FormData) => <Observable<IResponse>>
  this.http.post<IResponse>(`https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/ticket/file/upload`, form)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );
    downloadFile$ = (fileUuid: string) => <Observable<HttpResponse<Blob>>>
  this.http.get(`https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/ticket/file/download/${fileUuid}`, 
     {
     reportProgress: false,
     observe: 'response',
     responseType: 'blob'
    })
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  createTask$ = (form: FormData) => <Observable<IResponse>>
  this.http.put<IResponse>(`https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/ticket/task/create`, form)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  report$ = (request: any) => <Observable<IResponse>>
    this.http.post<IResponse>
        (`https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/ticket/report`, request )
        .pipe(
            tap(console.log),
            catchError(this.handleError)
        );

    downloadReport$ = (request: any) => <Observable<HttpResponse<Blob>>>
        this.http.post
            (`https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/ticket/report/download`, request,
                {
                    reportProgress: false,
                    observe: 'response',
                    responseType: 'blob'
                } )
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
