import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PersonsListComponent } from './persons-list/persons-list.component';
import { PersonsFormComponent } from './persons-form/persons-form.component';

const routes: Routes = [
  { path: '', component: PersonsListComponent },
  { path: 'new', component:  PersonsFormComponent},
  { path: 'edit/:id', component:  PersonsFormComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonsRoutingModule { }