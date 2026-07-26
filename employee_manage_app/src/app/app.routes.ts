import { Routes } from '@angular/router';
import { Header } from './pages/header/header';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { EmployeeForm } from './pages/employee-form/employee-form';
import { Department } from './pages/department/department';
import { Designation } from './pages/designation/designation';
import { EmployeeList } from './pages/employee-list/employee-list';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: Login
    },
    {
        path: '',
        component: Header,
        canActivate: [AuthGuard],
        children:[
            {
                path: 'dashboard',
                component: Dashboard
            },
            {
                path: 'new-employee',
                component: EmployeeForm
            },
            {
                path: 'employees',
                component: EmployeeList
            },
            {
                path: 'department',
                component: Department
            },
            {
                path: 'designation',
                component: Designation
            }
        ]
    }
];
