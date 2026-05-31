import { Injectable , inject } from '@angular/core';

import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { IResponse } from '../interface/response';
import { ShareResourceRequest } from '../interface/storageFile';


@Injectable()
export class FileStorageService {
  private http = inject(HttpClient);

  getFolders$(folderUuid: string): Observable<IResponse> {  
        return this.http.get<IResponse>(
            `https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/storage/folders/${folderUuid}`
        );
    }

      getFolder$(folderUuid: string): Observable<IResponse> {  
        return this.http.get<IResponse>(
            `https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/storage/folder/${folderUuid}`
        );
    }
        downloadStoredFile$ = (fileUuid: string) => <Observable<HttpResponse<Blob>>>
  this.http.get(`https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/storage/file/download/${fileUuid}`, 
     {
     reportProgress: false,
     observe: 'response',
     responseType: 'blob'
    })
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

      uploadStorageFiles$ = (form: FormData) => <Observable<IResponse>>
  this.http.post<IResponse>(`https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/storage/file/upload`, form)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

    rootFolder$(): Observable<IResponse> {  
        return this.http.get<IResponse>(
            `https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/storage/root`
        );
    }

    getFiles$(folderUuid: string): Observable<IResponse> {
        return this.http.get<IResponse>(
            `https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/storage/files/${folderUuid}`
        );
    }

    createFolder$(form: FormData): Observable<IResponse> {
        return this.http.post<IResponse>(
            `https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/storage/folder`,
            form
        );
    }

    uploadFiles$(form: FormData): Observable<IResponse> {
        return this.http.post<IResponse>(
            `https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/storage/file/upload`,
            form
        );
        
}

    shareFolder$(form: ShareResourceRequest): Observable<IResponse> {
        return this.http.post<IResponse>(
            `https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/storage/folder/share`,
            form
        );
        
}

getSharedFolders$ = () => <Observable<IResponse>>
  this.http.get<IResponse>(`https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/storage/shared/folder`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  getTrashFolders$ = () => <Observable<IResponse>>
  this.http.get<IResponse>(`https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/storage/folders/trash`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

getSharedFiles$ = () => <Observable<IResponse>>
  this.http.get<IResponse>(`https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/storage/shared/files`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  getTrashFiles$ = () => <Observable<IResponse>>
  this.http.get<IResponse>(`https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/storage/files/trash`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

    shareFile$(form: ShareResourceRequest): Observable<IResponse> {
        return this.http.post<IResponse>(
            `https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/storage/file/share`,
            form
        );
        
}

deleteFile$(fileUuid: string): Observable<IResponse> {
    return this.http.delete<IResponse>(
        `https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/storage/file`,
        {
            params: { fileUuid }
        }
    );
}


  deleteStorageFolder$ = (uuid: string) => <Observable<IResponse>>
  this.http.delete<IResponse>(`https://gateway-service.happyforest-b11122d9.francecentral.azurecontainerapps.io/storage/folder/${uuid}`, {})
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
