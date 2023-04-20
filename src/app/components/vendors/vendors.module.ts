import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendorsRoutingModule } from './vendors-routing.module';
import { ListVendorsComponent } from './list-vendors/list-vendors.component';
import { CreateVendorsComponent } from './create-vendors/create-vendors.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EditVendorComponent } from './edit-vendor/edit-vendor.component';
import { VendorDetailComponent } from './vendor-detail/vendor-detail.component';

@NgModule({
  declarations: [ListVendorsComponent, CreateVendorsComponent, EditVendorComponent, VendorDetailComponent],
  imports: [
    CommonModule,
    VendorsRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
    // Ng2SmartTableModule
  ]
})
export class VendorsModule { }
