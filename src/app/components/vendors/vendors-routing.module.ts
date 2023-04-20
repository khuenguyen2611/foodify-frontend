import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListVendorsComponent } from './list-vendors/list-vendors.component';
import { CreateVendorsComponent } from './create-vendors/create-vendors.component';
import { EditVendorComponent } from './edit-vendor/edit-vendor.component';
import { VendorDetailComponent } from './vendor-detail/vendor-detail.component';
import { AdminGuard } from 'src/app/shared/guard/admin-guard.service';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        canActivate: [AdminGuard],
        component: ListVendorsComponent,
        data: {
          title: "Danh sách shop",
          breadcrumb: "Danh sách"
        }
      },
      {
        path: 'create',
        canActivate: [AdminGuard],
        component: CreateVendorsComponent,
        data: {
          title: "Tạo người bán hàng",
          breadcrumb: "Tạo"
        }
      },
      {
        path: 'details/:id',
        component: VendorDetailComponent,
        data: {
          title: "Chi tiết người bán",
          breadcrumb: "Chi tiết"
        }
      },
      {
        path: 'edit/:id',
        component: EditVendorComponent,
        data: {
          title: "Chỉnh sửa người bán",
          breadcrumb: "Chỉnh sửa"
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class VendorsRoutingModule { }
