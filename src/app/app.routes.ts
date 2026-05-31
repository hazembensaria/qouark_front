import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path : '',
        loadChildren : () => import('./component/auth/auth.routes').then(c => c.AUTH_ROUTES)
    },
     {
        path : '',
        loadChildren : () => import('./component/navbar/navbar.routes').then(c => c.NAVBAR_ROUTES)
    }
];
