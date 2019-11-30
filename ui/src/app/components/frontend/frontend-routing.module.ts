import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';

//components
import { FrontendComponent } from './frontend.component';

//import { CustomerGuard } from '../../services/customer.guard';
import { AuthGuard } from '../../services/auth.guard';


const routes: Routes = [
{path:'', 
component: FrontendComponent,
children:[
    { path: '', redirectTo: 'login'},
    {
        path:"register",loadChildren:"./register/register.module#RegisterModule",
        data:{
            breadcrumbs:'Customer Register'
        }
    },
    {
        path:'home',loadChildren:'./home/home.module#HomeModule',
        data:{
            breadcrumbs:'Home'
        },canActivate: [AuthGuard]
    },
    {
        path:'teachers',loadChildren:'./teachers/teachers.module#TeachersModule',
        data:{
            breadcrumbs:'Teachers'
        },canActivate: [AuthGuard]
    },
    {
        path:'error',loadChildren:'./error/error.module#ErrorModule',
        data:{
            breadcrumbs:'Error 404'
        }
    },
    // {
    //     path:'products',loadChildren:'../frontend/products/products.module#ProductsModule',
    //     data:{
    //         breadcrumbs:'Products'
    //     },//canActivate: [CustomerGuard]
    // },
    // {
    //     path:'aboutus',loadChildren:'../frontend/aboutus/aboutus.module#AboutusModule',
    //     data:{
    //         breadcrumbs:'About us'
    //     },//canActivate: [CustomerGuard]
    // },
    // {
    //     path:'checkout',loadChildren:'../frontend/checkout/checkout.module#CheckoutModule',
    //     data:{
    //         breadcrumbs:'Checkout'
    //     },//canActivate: [CustomerGuard]
    // },
    // {
    //     path:'profile',loadChildren:'../frontend/profile/profile.module#ProfileModule',
    //     data:{
    //         breadcrumbs:'Profile'
    //     },//canActivate: [CustomerGuard]
    // },
  
]


}
];


@NgModule({
    imports:[
        RouterModule.forChild(routes)
    ],
    exports:[
        RouterModule
    ]
})

export class FrontendRoutingModule {}
