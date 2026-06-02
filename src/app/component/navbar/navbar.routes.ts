import { Routes } from '@angular/router';

export const NAVBAR_ROUTES : Routes = [
    { path: '', redirectTo: '', pathMatch: 'full' },
    {
        path : '',
        loadComponent : () => import('./navbar').then(c => c.Navbar),
        children: [
            {
                path : 'dashboard',  
                loadComponent : () => import('./dashboard/dashboard').then(c => c.Dashboard)
            },
            {
                path : 'project/:projectUuid',
                loadComponent : () => import('./ticket/tickets/tickets').then(c => c.Tickets)
            },
            {
                path : 'tickets/:ticketUuid',
                loadComponent : () => import('./ticket/ticket-detail/ticket-detail').then(c => c.TicketDetail)
            },
            {
                path : 'profile',
                loadComponent : () => import('./profile/profile').then(c => c.Profile)
            },
            {
                path : 'users',
                loadComponent : () => import('./user/users/users').then(c => c.Users)
            },
             {
                path : 'users/:userUuid',
                loadComponent : () => import('./user/user-detail/user-detail').then(c => c.UserDetail)
            },{
                path : 'messages',
                loadComponent : () => import('./message/messages/messages').then(c => c.Messages)
            },{
                path : 'messages/:conversationId',
                loadComponent : () => import('./message/message-detail/message-detail').then(c => c.MessageDetail)
            },{
                path : 'reports/:projectUuid',
                loadComponent : () => import('./reports/reports').then(c => c.Reports)
            },{
                path : 'files',
                loadComponent : () => import('./storage/storage').then(c => c.Storage)
            },{
                path: 'files/folder/:uuid',
                loadComponent: () => import('./storage/storage').then(c => c.Storage)
            },{
                path: 'files/shared',
                loadComponent: () => import('./storage/shared/shared').then(c => c.Shared)
            },{
                path: 'files/trash',
                loadComponent: () => import('./storage/trash/trash').then(c => c.Trash)
            },{
                path: 'projects',
                loadComponent: () => import('./project/project').then(c => c.Project)
            },{
                path: 'organization',
                loadComponent: () => import('./organization/organization').then(c => c.Organization)
            },{
                path: 'plans',
                loadComponent: () => import('./plans/plans').then(c => c.Plans)
            }
        ]
    }
    
]
