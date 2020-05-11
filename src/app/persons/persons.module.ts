import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonsRoutingModule } from './persons-routing.module';
import { PersonsListComponent } from './persons-list/persons-list.component';
import { PersonsFormComponent } from './persons-form/persons-form.component';
import { MatTableModule } from '@angular/material/table'
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [PersonsListComponent, PersonsFormComponent],
  imports: [
    CommonModule,
    PersonsRoutingModule,
    MatTableModule,
	MatInputModule,
    HttpClientModule,
    FormsModule
  ]
})
export class PersonsModule { }