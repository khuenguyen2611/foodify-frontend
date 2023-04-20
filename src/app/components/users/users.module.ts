import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


// import { Ng2SmartTableModule } from 'ng2-smart-table';
import { UsersRoutingModule } from './users-routing.module';
import { ListUserComponent } from './list-user/list-user.component';
import { CreateUserComponent } from './create-user/create-user.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { EditUserComponent } from './edit-user/edit-user.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { ListAccountComponent } from './list-account/list-account.component';

@NgModule({
  declarations: [ListUserComponent, CreateUserComponent, EditUserComponent, UserDetailComponent, ListAccountComponent],
  imports: [
    CommonModule,
    NgbModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ReactiveFormsModule,
    UsersRoutingModule
  ]
})
export class UsersModule { }
