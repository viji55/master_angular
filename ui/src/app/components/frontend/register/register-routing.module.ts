import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';

//components
import { RegisterComponent } from './register.component';
//import { CustomerGuard } from '../../services/customer.guard';



const routes: Routes = [
    
// { path: '', redirectTo: '/login',pathMatch: "full"}, 
{path:'', component: RegisterComponent}
];
console.log(routes);

@NgModule({
    imports:[
        RouterModule.forChild(routes)
    ],
    exports:[
        RouterModule
    ]
})

export class RegisterRoutingModule {}


