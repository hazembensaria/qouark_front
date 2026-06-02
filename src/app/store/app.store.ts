import { patchState, signalStore, watchState, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import {  tapResponse } from '@ngrx/operators';
import{rxMethod} from '@ngrx/signals/rxjs-interop';
import { initialState, IState  } from '../interface/state';
import { computed, inject } from '@angular/core';
import { getMessageCount, updateComments } from '../utils/fileutils';
import { UserService } from '../service/user';
import { HotToastService } from '@ngxpert/hot-toast';
import { pipe, switchMap, tap } from 'rxjs';
import { IResponse } from '../interface/response';
import { NotificationService } from '../service/notification';
import { TicketService } from '../service/ticket';
import { IQuery } from '../interface/query';
import { ITicket } from '../interface/ticket';
import { tick } from '@angular/core/testing';
import { NgForm } from '@angular/forms';
import { saveAs } from 'file-saver';
import { IUser } from '../interface/user';
import { UpdatePassword } from '../interface/credential';
import { StorageService } from '../service/storage';
import { FileStorageService } from '../service/fileStorage.service';
import { ShareResourceRequest } from '../interface/storageFile';



export const AppStore = signalStore(
    {providedIn: 'root'},
    withState<IState>(initialState),
    withComputed((store)=>({
        unreadMessageCount:computed(() => getMessageCount(store.messages()))
    })),
    
    withMethods((store , userService = inject(UserService), ticketService = inject(TicketService), toastService = inject(HotToastService) , notificationService = inject(NotificationService), storageService = inject(FileStorageService))=>({
        getProfile:rxMethod<void>(pipe(
            tap(()=> patchState(store , {loading : true , error : null})),
            switchMap(()=>userService.profile$().pipe(
                tapResponse({
                    next:(response :IResponse)=> {
                        patchState(store , { profile : response.data.user, devices : response.data?.devices , loading : false , error :null});
                    },
                     error: (error :string) =>{
                        toastService.error(error ? error : "An error occurred while fetching profile");
                        patchState(store , {loading : false , error });
                }   
                })
            )))),
            setTickets(tickets: any[]) {
  this._tickets.set([...tickets]); // important new reference
},
            getOrganization: rxMethod<void>(
  pipe(
    tap(() =>
      patchState(store, { loading: true, error: null })
    ),

    switchMap(() =>
      userService.getOrganization$().pipe(
        tapResponse({
          next: (response: IResponse) => {
            patchState(store, {
              organization: response.data.organization, 
              loading: false,
              error: null
            });
          },

          error: (error: string) => {
            toastService.error(
              error ? error : "An error occurred while fetching startups"
            );

            patchState(store, {
              loading: false,
              error
            });
          }
        })
      )))),
      createInvitation: rxMethod<FormData>(
  pipe(
    tap(() =>
      patchState(store, { loading: true, error: null })
    ),

    switchMap((form: FormData) =>
      userService.inviteUser$(form).pipe(
        tapResponse({
          next: (response: IResponse) => {
            patchState(store, (state) => ({
              invitations: [
                response.data.invitation,
                ...state.invitations
              ],
              loading: false,
              error: null
            }));

            toastService.success(response.message);
          },

          error: (error: string) => {
            toastService.error(
              error || "An error occurred while sending invitation"
            );

            patchState(store, {
              loading: false,
              error: error || "Invitation failed"
            });
          }
        })
      )))),
      getProjectsByStartup: rxMethod<string>(
  pipe(
    tap(() =>
      patchState(store, { loading: true, error: null })
    ),

    switchMap((startupUuid: string) =>
      ticketService.getProjectsByStartup$(startupUuid).pipe(
        tapResponse({
          next: (response: IResponse) => {
            patchState(store, {
              projects: response.data.projects,
              loading: false,
              error: null
            });

          },

          error: (error: string) => {
            toastService.error(
              error || "An error occurred while fetching projects"
            );

            patchState(store, {
              loading: false,
              error: error || "Error fetching projects"
            });
          }
        })
      )))),
      acceptInvitation: rxMethod<string>(
  pipe(
    tap(() =>
      patchState(store, {
        loading: true,
        error: null
      })
    ),
    switchMap((invitationUuid: string) =>
      userService.acceptInvitation$(invitationUuid).pipe(
        tapResponse({
          next: (response: IResponse) => {
            patchState(store, (state) => ({
              invitations: state.invitations.map(invitation =>
                invitation.invitationUuid === invitationUuid
                  ? {
                      ...invitation,
                      status: 'ACCEPTED'
                    }
                  : invitation
              ),
              loading: false,
              error: null
            }));

          },

          error: (error: string) => {

            toastService.error(
              error || "An error occurred while accepting invitation"
            );

            patchState(store, {
              loading: false,
              error: error || "An error occurred while accepting invitation"
            });
          }
        })
      )))),
      getMyInvitations: rxMethod<void>(
  pipe(
    tap(() =>
      patchState(store, { loading: true, error: null })
    ),

    switchMap(() =>
      userService.getMyInvitations$().pipe(
        tapResponse({
          next: (response: IResponse) => {
            patchState(store, {
              invitations: response.data.invitations,
              loading: false,
              error: null
            });

          },

          error: (error: string) => {
            toastService.error(
              error || "An error occurred while fetching invitations"
            );

            patchState(store, {
              loading: false,
              error
            });
          }
        })
      )))),
      getSharedFolders: rxMethod<void>(
  pipe(
    tap(() =>
      patchState(store, { loading: true, error: null })
    ),

    switchMap(() =>
      storageService.getSharedFolders$().pipe(
        tapResponse({
          next: (response: IResponse) => {
            patchState(store, {
              sharedFolders: response.data.sharedFolders,
              loading: false,
              error: null
            });

           
          },

          error: (error: string) => {
            toastService.error(
              error || "An error occurred while fetching shared folders"
            );

            patchState(store, {
              loading: false,
              error
            });
          }
        })
      )))),

    getTrashFolders: rxMethod<void>(
  pipe(
    tap(() =>
      patchState(store, { loading: true, error: null })
    ),

    switchMap(() =>
      storageService.getTrashFolders$().pipe(
        tapResponse({
          next: (response: IResponse) => {
            patchState(store, {
              trashFolders: response.data.folders,
              loading: false,
              error: null
            });

            
          },

          error: (error: string) => {
            toastService.error(
              error || "An error occurred while fetching trash folders"
            );

            patchState(store, {
              loading: false,
              error
            });
          }
        })
      )))),
       getSharedFiles: rxMethod<void>(
  pipe(
    tap(() =>
      patchState(store, { loading: true, error: null })
    ),

    switchMap(() =>
      storageService.getSharedFiles$().pipe(
        tapResponse({
          next: (response: IResponse) => {
            patchState(store, {
              sharedFiles: response.data.sharedFiles,
              loading: false,
              error: null
            });

          },

          error: (error: string) => {
            toastService.error(
              error || "An error occurred while fetching shared files"
            );

            patchState(store, {
              loading: false,
              error
            });
          }
        })
      )))),

    getTrashFiles: rxMethod<void>(
  pipe(
    tap(() =>
      patchState(store, { loading: true, error: null })
    ),

    switchMap(() =>
      storageService.getTrashFiles$().pipe(
        tapResponse({
          next: (response: IResponse) => {
            patchState(store, {
              trashFiles: response.data.files,
              loading: false,
              error: null
            });

          },

          error: (error: string) => {
            toastService.error(
              error || "An error occurred while fetching trash files"
            );

            patchState(store, {
              loading: false,
              error
            });
          }
        })
      )))),
            updatePhoto:rxMethod<FormData>(pipe(
            tap(()=> patchState(store , {loading : true , error : null})),
            switchMap((form)=>userService.updatePhoto$(form).pipe(
                tapResponse({
                    next:(response :IResponse)=> {
                        patchState(store , (state) => ({ profile : response.data.user, loading : false , error :null}));
                    },
                     error: (error :string) =>{
                        toastService.error(error ? error : "An error occurred while fetching profile");
                        patchState(store , {loading : false , error });
                }   
                })
            )))),
            updateUser:rxMethod<IUser>(pipe(
            tap(()=> patchState(store , {loading : true , error : null})),
            switchMap((user)=>userService.update$(user).pipe(
                tapResponse({
                    next:(response :IResponse)=> {
                        patchState(store , (state) => ({ profile : response.data.user, loading : false , error :null}));
                        toastService.success(response.message);
                    },
                     error: (error :string) =>{
                        toastService.error(error ? error : "An error occurred while fetching profile");
                        patchState(store , {loading : false , error });
                }   
                })
            )))),
            updatePassword:rxMethod<UpdatePassword>(pipe(
            tap(()=> patchState(store , {loading : true , error : null})),
            switchMap((passwordRequest)=>userService.updatePassword$(passwordRequest).pipe(
                tapResponse({
                    next:(response :IResponse)=> {
                        patchState(store , (state) => ({ loading : false , error :null}));
                        toastService.success(response.message);
                    },
                     error: (error :string) =>{
                        toastService.error(error ? error : "An error occurred while fetching profile");
                        patchState(store , {loading : false , error });
                }   
                })
            )))),
            toggleAccountLocked:rxMethod<void>(pipe(
            tap(()=> patchState(store , {loading : true , error : null})),
            switchMap(()=>userService.toggleAccountLocked$().pipe(
                tapResponse({
                    next:(response :IResponse)=> {
                        patchState(store , (state) => ({profile: response.data.user, loading : false , error :null}));
                        toastService.success(response.message);
                    },
                     error: (error :string) =>{
                        toastService.error(error ? error : "An error occurred while fetching profile");
                        patchState(store , {loading : false , error });
                }   
                })
            )))),
            toggleAccountExpired:rxMethod<void>(pipe(
            tap(()=> patchState(store , {loading : true , error : null})),
            switchMap(()=>userService.toggleAccountExpired$().pipe(
                tapResponse({
                    next:(response :IResponse)=> {
                        patchState(store , (state) => ({profile: response.data.user, loading : false , error :null}));
                        toastService.success(response.message);
                    },
                     error: (error :string) =>{
                        toastService.error(error ? error : "An error occurred while fetching profile");
                        patchState(store , {loading : false , error });
                }   
                })
            )))),
            toggleAccountEnabled:rxMethod<void>(pipe(
            tap(()=> patchState(store , {loading : true , error : null})),
            switchMap(()=>userService.toggleAccountEnabled$().pipe(
                tapResponse({
                    next:(response :IResponse)=> {
                        patchState(store , (state) => ({profile: response.data.user, loading : false , error :null}));
                        toastService.success(response.message);
                    },
                     error: (error :string) =>{
                        toastService.error(error ? error : "An error occurred while fetching profile");
                        patchState(store , {loading : false , error });
                }   
                })
            )))),
            enableMfa:rxMethod<void>(pipe(
            tap(()=> patchState(store , {loading : true , error : null})),
            switchMap(()=>userService.enableMfa$().pipe(
                tapResponse({
                    next:(response :IResponse)=> {
                        patchState(store , (state) => ({profile: response.data.user, loading : false , error :null}));
                        toastService.success(response.message);
                    },
                     error: (error :string) =>{
                        toastService.error(error ? error : "An error occurred while fetching profile");
                        patchState(store , {loading : false , error });
                }   
                })
            )))),
            disableMfa:rxMethod<void>(pipe(
            tap(()=> patchState(store , {loading : true , error : null})),
            switchMap(()=>userService.disableMfa$().pipe(
                tapResponse({
                    next:(response :IResponse)=> {
                        patchState(store , (state) => ({profile: response.data.user, loading : false , error :null}));
                        toastService.success(response.message);
                    },
                     error: (error :string) =>{
                        toastService.error(error ? error : "An error occurred while fetching profile");
                        patchState(store , {loading : false , error });
                }   
                })
            )))),
            updateRole:rxMethod<string>(pipe(
            tap(()=> patchState(store , {loading : true , error : null})),
            switchMap((role: string)=>userService.updateRole$(role).pipe(
                tapResponse({
                    next:(response :IResponse)=> {
                        patchState(store , (state) => ({profile: response.data.user, loading : false , error :null}));
                        toastService.success(response.message);
                    },
                     error: (error :string) =>{
                        toastService.error(error ? error : "An error occurred while fetching profile");
                        patchState(store , {loading : false , error });
                }   
                })
            )))),
            getUsers:rxMethod<void>(pipe(
            tap(()=> patchState(store , {loading : true , error : null})),
            switchMap(()=>userService.users$().pipe(
                tapResponse({
                    next:(response :IResponse)=> {
                        patchState(store , (state) => ({users: response.data.users, loading : false , error :null}));
                    },
                     error: (error :string) =>{
                        toastService.error(error ? error : "An error occurred while fetching profile");
                        patchState(store , {loading : false , error });
                }   
                })
            )))),
            searchUsers: rxMethod<string>(pipe(
                tap(() => patchState(store, { loading: true, error: null})),
                switchMap((query: string) =>
                  userService.searchUsers$(query).pipe(
                    tapResponse({
                      next: (response: IResponse) => {
                        patchState(store, { users: response.data.users, loading: false, error: null});
                      },
                      error: (error: string) => {
                        toastService.error(error ? error : "An error occurred while searching users");
                        patchState(store, { loading: false, error});
                      }
                    })
                  )))),
                  shareFolder : rxMethod<ShareResourceRequest>(
                  pipe(
                    tap(() =>
                      patchState(store, {
                        loading: true,
                        error: null
                      })
                    ),
                
                    switchMap((payload: ShareResourceRequest) =>
                      storageService.shareFolder$(payload).pipe(
                        tapResponse({
                          next: (response: IResponse) => {
                            toastService.success(response.message);
                        
                            patchState(store, {
                              loading: false,
                              error: null
                            });
                          },
                      
                          error: (error: string) => {
                            toastService.error(
                              error ? error : "Error while sharing folder"
                            );
                        
                            patchState(store, {
                              loading: false,
                              error
                            });
                          }
                        })
                      )))),
                shareFile : rxMethod<ShareResourceRequest>(
                  pipe(
                    tap(() =>
                      patchState(store, {
                        loading: true,
                        error: null
                      })
                    ),
                
                    switchMap((payload: ShareResourceRequest) =>
                      storageService.shareFile$(payload).pipe(
                        tapResponse({
                          next: (response: IResponse) => {
                            toastService.success(response.message);
                        
                            patchState(store, {
                              loading: false,
                              error: null
                            });
                          },
                      
                          error: (error: string) => {
                            toastService.error(
                              error ? error : "Error while sharing file"
                            );
                        
                            patchState(store, {
                              loading: false,
                              error
                            });
                          }
                        })
                      )))),
            getUser: rxMethod<string>(pipe(
            tap(() => patchState(store, { loading: true, error: null })),
            switchMap((userUuid) => userService.user$(userUuid).pipe(
                tapResponse({
                    next: (response: IResponse) => {
                        patchState(store, (state) => ({ user: response.data.user, loading: false, error: null }));
                        //toastService.success(response.message);
                    },
                    error: (error: string) => {
                        patchState(store, { loading: false, error });
                        toastService.error(error ? error : 'An error occurred. Please try again.');
                    }
                })
            )))),
            getMessages:rxMethod<void>(pipe(
            tap(()=> patchState(store , {loading : true , error : null})),
            switchMap(()=>notificationService.messages$().pipe(
                tapResponse({
                    next:(response :IResponse)=> {
                        patchState(store , { messages : response.data.messages , loading : false , error :null});
                    },
                     error: (error :string) =>{
                        toastService.error(error ? error : "An error occurred while fetching profile");
                        patchState(store , {loading : false , error });
                }   
                })
            )))),
            sendMessage:rxMethod<FormData>(pipe(
            tap(()=> patchState(store , {loading : true , error : null})),
            switchMap((form: FormData)=>notificationService.sendMessage$(form).pipe(
                tapResponse({
                    next:(response :IResponse)=> {
                        patchState(store , { messages : response.data.messages , loading : false , error :null});
                    },
                     error: (error :string) =>{
                        toastService.error(error ? error : "An error occurred while fetching profile");
                        patchState(store , {loading : false , error });
                }   
                })
            )))),
            getConversation:rxMethod<string>(pipe(
            tap(()=> patchState(store , {loading : true , error : null , conversation : null})),
            switchMap((conversationId: string)=>notificationService.conversation$(conversationId).pipe(
                tapResponse({
                    next:(response :IResponse)=> {
                        patchState(store , { conversation : response.data.conversation , messages : response.data.messages , loading : false , error :null});
                    },
                     error: (error :string) =>{
                        toastService.error(error ? error : "An error occurred while fetching profile");
                        patchState(store , {loading : false , error });
                }   
                })
            )))),
            replyToMessage:rxMethod<FormData>(pipe(
            tap(()=> patchState(store , { error : null })),
            switchMap((form: FormData)=>notificationService.replyToMessage$(form).pipe(
                tapResponse({
                    next:(response :IResponse)=> {
                        patchState(store , (state) => ({ conversation : [...state.conversation, response.data.message], loading : false , error :null}));
                    },
                     error: (error :string) =>{
                        toastService.error(error ? error : "An error occurred while fetching profile");
                        patchState(store , {loading : false , error });
                }   
                })
            )))),
            getAllTickets:rxMethod<void>(pipe(
            tap(()=> patchState(store , {loading : true , error : null})),
            switchMap(()=>ticketService.allTickets$().pipe(
                tapResponse({
                    next:(response :IResponse)=> {
                        patchState(store , { allTickets : response.data.tickets , loading : false , error :null});
                    },
                     error: (error :string) =>{
                        toastService.error(error ? error : "An error occurred while fetching profile");
                        patchState(store , {loading : false , error });
                }   
                })
            )))),
            getTicket:rxMethod<string>(pipe(
            tap(()=> patchState(store , {loading : true , error : null , ticketDetail : null})),
            switchMap((ticketUuid: string)=>ticketService.ticket$(ticketUuid).pipe(
                tapResponse({
                    next:(response :IResponse)=> {
                        patchState(store , (state) => ({ticketDetail:{ticket: response.data.ticket , comments : response.data.comments , files : response.data.files, tasks: response.data.tasks , assignees: response.data.assignee , techSupports: response.data.techSupports , user: response.data.user} , loading : false , error :null}));
                    },
                     error: (error :string) =>{
                        toastService.error(error ? error : "An error occurred while fetching profile");
                        patchState(store , {loading : false , error });
                }   
                })
            )))),
            saveTicket:rxMethod<FormData>(pipe(
            tap(()=> patchState(store , {loading : true , error : null})),
            switchMap((form: FormData)=>ticketService.createTicket$(form).pipe(
                tapResponse({
                    next:(response :IResponse)=> {
                        patchState(store , (state) => {
                            let tickets: ITicket[] = null;
                            let allTickets: ITicket[] = null;
                            if(state.tickets.length > 0){
                                tickets = [response.data.ticket , ...state.tickets];
                            }
                            if(state.allTickets?.length > 0){
                                allTickets = [response.data.ticket , ...state.allTickets];
                            }
                            return{ tickets , allTickets : allTickets , loading : false , error :null}
                        });
                        toastService.success(response.message);
                    },
                     error: (error :string) =>{
                        toastService.error(error ? error : "An error occurred while fetching profile");
                        patchState(store , {loading : false , error });
                }   
                })
            )))),
            updateTicket:rxMethod<ITicket>(pipe(
            tap(()=> patchState(store , {loading : true , error : null})),
            switchMap((ticket: ITicket)=>ticketService.updateTicket$(ticket).pipe(
                tapResponse({
                    next:(response :IResponse)=> {
                        patchState(store , (state) => ({ticketDetail:{...state.ticketDetail , ticket : response.data.ticket} , loading : false , error :null}));
                        toastService.success(response.message);
                    },
                     error: (error :string) =>{
                        toastService.error(error ? error : "An error occurred while fetching profile");
                        patchState(store , {loading : false , error });
                }   
                })
            )))),
            addComment:rxMethod<FormData>(pipe(
            tap(()=> patchState(store , {loading : true , error : null})),
            switchMap((form: FormData)=>ticketService.addComment$(form).pipe(
                tapResponse({
                    next:(response :IResponse)=> {
                        patchState(store , (state) => ({ticketDetail:{...state.ticketDetail , comments : [response.data.comment , ...state.ticketDetail.comments]} , loading : false , error :null}));
                        toastService.success(response.message);
                    },
                     error: (error :string) =>{
                        toastService.error(error ? error : "An error occurred while fetching profile");
                        patchState(store , {loading : false , error });
                }   
                })
            )))),
            createProject: rxMethod<FormData>(
                  pipe(
                    tap(() =>
                      patchState(store, { loading: true, error: null })),
                
                    switchMap((form: FormData) =>
                      ticketService.project$(form).pipe(
                        tapResponse({
                          next: (response: IResponse) => {
                            patchState(store, (state) => ({projects: [response.data.project, ...state.projects],loading: false,error: null }));
                            toastService.success(response.message);
                          },
                          error: (error: string) => {
                            toastService.error(error ? error : "An error occurred while creating project" );
                            patchState(store, {loading: false,error: error || "An error occurred while creating project" });}
                        })
                      )))),
                createOrganization: rxMethod<FormData>(
                  pipe(
                    tap(() =>
                      patchState(store, { loading: true, error: null })
                    ),
                    switchMap((form: FormData) =>
                      userService.createOrganization$(form).pipe(
                        tapResponse({
                          next: (response: IResponse) => {
                            patchState(store, (state) => ({
                              organization: response.data.organization, loading: false, error: null}));
                            toastService.success(response.message);
                          },
                          error: (error: string) => {
                            toastService.error(
                              error ? error : "An error occurred while creating organization"
                            );
                            patchState(store, {
                              loading: false,
                              error: error || "An error occurred while creating organization"
                            });
                          }
                      
                        })
                      )))),
            updateComment:rxMethod<FormData>(pipe(
            tap(()=> patchState(store , {loading : true , error : null})),
            switchMap((form: FormData)=>ticketService.updateComment$(form).pipe(
                tapResponse({
                    next:(response :IResponse)=> {
                        patchState(store , (state) => ({ticketDetail:{...state.ticketDetail , comments : updateComments(response.data.comment ,state.ticketDetail.comments)} , loading : false , error :null}));
                        toastService.success(response.message);
                    },
                     error: (error :string) =>{
                        toastService.error(error ? error : "An error occurred while fetching profile");
                        patchState(store , {loading : false , error });
                }   
                })
            )))),
            uploadFiles:rxMethod<FormData>(pipe(
            tap(()=> patchState(store , {loading : true , error : null})),
            switchMap((form: FormData)=>ticketService.uploadFiles$(form).pipe(
                tapResponse({
                    next:(response :IResponse)=> {
                        patchState(store , (state) => ({ticketDetail:{...state.ticketDetail , files : [...response.data.files , ...state.ticketDetail.files]}, loading : false , error :null}));
                        toastService.success(response.message);
                    },
                     error: (error :string) =>{
                        toastService.error(error ? error : "An error occurred while fetching profile");
                        patchState(store , {loading : false , error });
                }   
                })
            )))),
                uploadStorageFiles:rxMethod<FormData>(pipe(
            tap(()=> patchState(store , {loading : true , error : null})),
            switchMap((form: FormData)=>storageService.uploadStorageFiles$(form).pipe(
                tapResponse({
                    next:(response :IResponse)=> {
                       patchState(store, (state) => ({
                                    storageFiles: [...state.storageFiles, ...response.data.files], loading: false, error: null}));
                                    toastService.success(response.message);
                                    },
                     error: (error :string) =>{
                        toastService.error(error ? error : "An error occurred while fetching profile");
                        patchState(store , {loading : false , error });
                }   
                })
            )))),
            downloadFile:rxMethod<string>(pipe(
            tap(()=> patchState(store , {loading : true , error : null})),
            switchMap((fileUuid: string)=>ticketService.downloadFile$(fileUuid).pipe(
                tapResponse({
                    next:(response )=> {
                        saveAs(new File([response.body] , response.headers.get('File_Name') , {type: `${response.headers.get('Content-Type')};charset=utf-8`}));
                        patchState(store , (state) => ({loading : false , error :null}));
                        
                    },
                     error: (error :string) =>{
                        toastService.error(error ? error : "An error occurred while fetching profile");
                        patchState(store , {loading : false , error });
                }   
                })
            )))),
            downloadStoredFile:rxMethod<string>(pipe(
            tap(()=> patchState(store , {loading : true , error : null})),
            switchMap((fileUuid: string)=>storageService.downloadStoredFile$(fileUuid).pipe(
                tapResponse({
                    next:(response )=> {
                        saveAs(response.body!,response.headers.get('Content-Disposition')?.split('filename="')[1]?.split('"')[0] || 'download');    
                        patchState(store , (state) => ({loading : false , error :null}));
                        
                    },
                     error: (error :string) =>{
                        toastService.error(error ? error : "An error occurred while fetching profile");
                        patchState(store , {loading : false , error });
                }   
                })
            )))),
            getTickets:rxMethod<{ projectUuid: string; query: IQuery }>(pipe(
            tap(()=> patchState(store , {loading : true , error : null})),
            
            switchMap(({ projectUuid, query })=>ticketService.tickets$({ projectUuid, query }).pipe(
                tapResponse({
                    next:(response :IResponse)=> {
                        console.log("Tickets response:", response);
                        patchState(store , { tickets : response.data.tickets , pages : response.data.pages , query , loading : false , error :null});
                    },
                     error: (error :string) =>{
                        toastService.error(error ? error : "An error occurred while fetching profile");
                        patchState(store , {loading : false , error });
                }   
                })
            )))),
            createTask:rxMethod<FormData>(pipe(
            tap(()=> patchState(store , {loading : true , error : null})),
            switchMap((form: FormData)=>ticketService.createTask$(form).pipe(
                tapResponse({
                    next:(response :IResponse)=> {
                        patchState(store , (state) => ({ticketDetail:{...state.ticketDetail , tasks : [response.data.task, ...state.ticketDetail.tasks]}, loading : false , error :null}));
                        toastService.success(response.message);
                    },
                     error: (error :string) =>{
                        toastService.error(error ? error : "An error occurred while fetching profile");
                        patchState(store , {loading : false , error });
                }   
                })
            )))),
            deleteComment:rxMethod<FormData>(pipe(
            tap(()=> patchState(store , {loading : true , error : null})),
            switchMap((form: FormData)=>ticketService.deleteComment$(form).pipe(
                tapResponse({
                    next:(response :IResponse)=> {
                        patchState(store , (state) => ({ticketDetail:{...state.ticketDetail , comments : state.ticketDetail.comments.filter(comment => comment.commentUuid != form.get('commentUuid'))}, loading : false , error :null}));
                      
                    },
                     error: (error :string) =>{
                        toastService.error(error ? error : "An error occurred while fetching profile");
                        patchState(store , {loading : false , error });
                }   
                })
            )))),
            deleteFile:rxMethod<FormData>(pipe(
            tap(()=> patchState(store , {loading : true , error : null})),
            switchMap((form: FormData)=>ticketService.deleteFile$(form).pipe(
                tapResponse({
                    next:(response :IResponse)=> {
                        patchState(store , (state) => ({ticketDetail:{...state.ticketDetail , files : state.ticketDetail.files.filter(file => file.fileUuid != form.get('fileUuid'))}, loading : false , error :null}));
                    },
                     error: (error :string) =>{
                        toastService.error(error ? error : "An error occurred while fetching profile");
                        patchState(store , {loading : false , error });
                }   
                })
            )))),

                        deleteStorageFolder:rxMethod<string>(pipe(
            tap(()=> patchState(store , {loading : true , error : null})),
            switchMap((folderUuid: string)=>storageService.deleteStorageFolder$(folderUuid).pipe(
                tapResponse({
                    next:(response :IResponse)=> {
                        patchState(store , (state) => ({storageFolders: state.storageFolders.filter(folder => folder.storageFolderUuid !== folderUuid), loading : false , error :null}));
                        
                    },
                     error: (error :string) =>{
                        toastService.error(error ? error : "An error occurred while fetching profile");
                        patchState(store , {loading : false , error });
                }   
                })
            )))),
                deleteStorageFile:rxMethod<string>(pipe(
            tap(()=> patchState(store , {loading : true , error : null})),
            switchMap((fileUuid: string)=>storageService.deleteFile$(fileUuid).pipe(
                tapResponse({
                    next:(response :IResponse)=> {
                        patchState(store , (state) => ({storageFiles: state.storageFiles.filter(file => file.storageFileUuid !== fileUuid), loading : false , error :null}));
                        
                    },
                     error: (error :string) =>{
                        toastService.error(error ? error : "An error occurred while fetching profile");
                        patchState(store , {loading : false , error });
                }   
                })
            )))),
            getReport: rxMethod<any>(pipe(
            tap(() => patchState(store, { loading: true, error: null })),
            switchMap((request) => ticketService.report$(request).pipe(
                tapResponse({
                    next: (response: IResponse) => {
                        patchState(store, (state) => ({ report: response.data.tickets, loading: false, error: null }));
                        //toastService.success(response.message);
                    },
                    error: (error: string) => {
                        patchState(store, { loading: false, error });
                        toastService.error(error ? error : 'An error occurred. Please try again.');
                    }
                })
            )))),
            downloadReport: rxMethod<any>(pipe(
            tap(() => patchState(store, { loading: true, error: null })),
            switchMap((request) => ticketService.downloadReport$(request).pipe(
                tapResponse({
                    next: (response) => {
                        saveAs(new File([response.body], response.headers.get('File-Name'), { type: `${response.headers.get('Content-Type')};charset=ut-8` }));
                        patchState(store, (state) => ({ loading: false, error: null }));
                        //toastService.success(response.message);
                    },
                    error: (error: string) => {
                        patchState(store, { loading: false, error });
                        toastService.error(error ? error : 'An error occurred. Please try again.');
                    }
                })
            )))),
             setReportRequest(reportRequest: {}): void {
            patchState(store, (state) => ({ reportRequest }))
            },
            updateAssignee:rxMethod<FormData>(pipe(
            tap(()=> patchState(store , {loading : true , error : null})),
            switchMap((form: FormData)=>ticketService.updateAssignee$(form).pipe(
                tapResponse({
                    next:(response :IResponse)=> {
                        patchState(store , (state) => ({ticketDetail:{...state.ticketDetail , assignee : response.data.assignee}, loading : false , error :null}));
                        toastService.success(response.message);
                    },
                     error: (error :string) =>{
                          console.log(form.get('ticketUuid') , form.get('assigneeUuid'));
                        toastService.error(error ? error : "An error occurred while fetching profile");
                        patchState(store , {loading : false , error });
                }   
                })
            )))),
                    getStorageFolders: rxMethod<string>(
                    pipe(
                        tap((folderUuid) => {
                        console.log('Loading folders for:', folderUuid);
                        patchState(store, {loading: true,error: null});
                        }),
                        switchMap((folderUuid: string) =>
                        storageService.getFolders$(folderUuid).pipe(
                            tapResponse({
                            next: (response: IResponse) => {
                                console.log('RAW RESPONSE:', response);
                                const folders = response?.data?.folders ?? [];
                                console.log('Parsed folders:', folders);
                                patchState(store, { storageFolders: folders, loading: false, error: null});
                            },
                            error: (error: any) => {
                                console.error('getStorageFolders error:', error);
                                toastService.error(
                                error?.error?.message || 'Error loading folders'
                                );
                                patchState(store, {
                                loading: false,
                                error
                                });
                            }
                            })
                        )))),
                    getStorageFiles: rxMethod<string>(pipe(
                        tap(() => patchState(store, {
                            loading: true,
                            error: null
                        })),
                        switchMap((folderUuid: string) =>
                            storageService.getFiles$(folderUuid).pipe(
                                tapResponse({
                                    next: (response: IResponse) => {
                                        console.log('RAW files:', response);
                                        patchState(store, { storageFiles: response.data.files, loading: false, error: null});
                                    },
                                    error: (error: string) => {
                                        toastService.error(error || 'Error loading files');
                                        patchState(store, { loading: false, error});
                                    }
                                })
                            )))),
                    createStorageFolder: rxMethod<FormData>(pipe(
                        tap(() => patchState(store, {
                            loading: true,
                            error: null
                        })),
                        switchMap((form: FormData) =>
                            storageService.createFolder$(form).pipe(
                                tapResponse({
                                    next: (response: IResponse) => {

                                        patchState(store, (state) => ({
                                            storageFolders: [...state.storageFolders, response.data.folder], loading: false, error: null}));
                                        toastService.success(response.message);
                                    },
                                    error: (error: string) => {
                                        toastService.error(error || 'Error creating folder');
                                        patchState(store, { loading: false, error});
                                    }
                                })
                            )))),
                        // uploadStorageFiles: rxMethod<FormData>(pipe(
                        // tap(() => patchState(store, {
                        //     loading: true,
                        //     error: null
                        // })),
                        // switchMap((form: FormData) =>
                        //     storageService.uploadFiles$(form).pipe(
                        //         tapResponse({
                        //             next: (response: IResponse) => {
                        //                 patchState(store, (state) => ({
                        //                     storageFiles: [...state.storageFiles, ...response.data.files], loading: false, error: null}));
                        //                 toastService.success(response.message);
                        //             },
                        //             error: (error: string) => {
                        //                 toastService.error(error || 'Error uploading files');
                        //                 patchState(store, { loading: false, error});
                        //             }
                        //         })
                        //     )))),
                            getRootFolder: rxMethod<void>(pipe(
                                tap(() => patchState(store, {
                                    loading: true,
                                    error: null
                                })),
                                switchMap(() =>
                                    storageService.rootFolder$().pipe(
                                    tapResponse({
                                        next: (response: IResponse) => {
                                            console.log('Root folder response:', response);

                                        patchState(store, {
                                            rootFolder: response.data.folder,
                                            loading: false,
                                            error: null
                                        });

                                        },
                                        error: (error: string) => {
                                        patchState(store, {
                                            loading: false,
                                            error
                                        });
                                        }
                                    })
                                    )))),
                            getCurrentStorageFolder: rxMethod<string>(pipe(
                    tap(() => patchState(store, {
                        loading: true,
                        error: null
                    })),
                    switchMap((folderUuid: string) =>
                        storageService.getFolder$(folderUuid).pipe(
                        tapResponse({
                            next: (response: IResponse) => {
                            console.log('Current folder response:', response);
                            patchState(store, { 
                                currentFolder: response.data.folder,
                                loading: false,
                                error: null
                            });

                            },
                            error: (error: string) => {

                            patchState(store, {
                                loading: false,
                                error
                            });

                            }
                        })
                        )))),

            setCurrentPage(currentPage :number) :void{
                patchState(store , (state)=> ({currentPage}))
            }
    })),
    withHooks({
        onInit(store){
            watchState(store , (state)=>{
                console.log('current state:', state);
            })
        }
    })

);