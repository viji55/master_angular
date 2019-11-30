import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';

//components
import { TeachersComponent } from './teachers.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';


const routes: Routes = [
{path:'', component: TeachersComponent},
{path:'add', component: AddComponent},
{path:'edit/:id', component: EditComponent}
];



@NgModule({
    imports:[
        RouterModule.forChild(routes)
    ],
    exports:[
        RouterModule
    ]
})

export class TeachersRoutingModule {}