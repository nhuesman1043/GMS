import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';

import {
    NbAuthComponent,
    NbLoginComponent,
    NbRegisterComponent,
    NbLogoutComponent,
    NbRequestPasswordComponent,
    NbResetPasswordComponent,
} from '@nebular/auth';

export const routes: Routes = [
    { path: 'admin', component: LoginComponent },
    { path: 'password-reset', component: PasswordResetComponent },

    {
        path: 'auth',
        component: NbAuthComponent,
        children: [
            {
                path: '',
                component: NbLoginComponent,
            },
            {
                path: 'login',
                component: NbLoginComponent,
            },
            {
                path: 'register',
                component: NbRegisterComponent,
            },
            {
                path: 'logout',
                component: NbLogoutComponent,
            },
            {
                path: 'request-password',
                component: NbRequestPasswordComponent,
            },
            {
                path: 'reset-password',
                component: NbResetPasswordComponent,
            },
        ],
    },

];
