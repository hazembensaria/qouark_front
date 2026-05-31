import { Routes } from '@angular/router';

export const AUTH_ROUTES : Routes = [
    { path: '', redirectTo: '', pathMatch: 'full' },
    {
        path : '',
        loadComponent : () => import('./auth').then(c => c.Auth),
        children: [
            {
                path : '',  
                loadComponent : () => import('./home/home').then(c => c.Home)
            },
            {
                path : 'register',
                loadComponent : () => import('./register/register').then(c => c.Register)
            },
            {
                path : 'resetpassword',
                loadComponent : () => import('./resetpassword/resetpassword').then(c => c.Resetpassword)
            },
            {
                path : 'verify/password',
                loadComponent : () => import('./verifypassword/verifypassword').then(c => c.Verifypassword)

            },
            {
                path : 'verify/account',
                loadComponent : () => import('./verifyaccount/verifyaccount').then(c => c.Verifyaccount)
            }
        ]
    }
    
]
