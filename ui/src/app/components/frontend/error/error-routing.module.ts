import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';

//components
import { ErrorComponent } from './error.component';
//import { CustomerGuard } from '../../services/customer.guard';



const routes: Routes = [
    
// { path: '', redirectTo: '/login',pathMatch: "full"}, 
{path:'', component: ErrorComponent}
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

export class ErrorRoutingModule {}


