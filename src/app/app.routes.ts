import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
    {
        path: "",
        component: LoginComponent
    },
    {
        path: "sign-up",
        component: SignupComponent
    },
    {
        path: "dashboard",
        component: DashboardComponent
    },
    {
        path: "login",
        component: LoginComponent

    }
];
