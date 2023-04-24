import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from './account.component';
import { AdminGuard } from 'src/app/shared/guard/admin-guard.service';


const routes: Routes = [
  {
    path: '',
    canActivate: [AdminGuard],
    component: AccountComponent,
    data: {
      title: "Tài khoản",
      breadcrumb: "Danh sách"
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceRoutingModule { }
