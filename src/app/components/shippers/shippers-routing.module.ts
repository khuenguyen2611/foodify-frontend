import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateShipperComponent } from './create-shipper/create-shipper.component';
import { EditShipperComponent } from './edit-shipper/edit-shipper.component';
import { ListShipperComponent } from './list-shipper/list-shipper.component';
import { ShipperDetailComponent } from './shipper-detail/shipper-detail.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'list',
                component: ListShipperComponent,
                data: {
                    title: "Danh sách shipper",
                    breadcrumb: "Danh sách"
                }
            },
            {
                path: 'create',
                component: CreateShipperComponent,
                data: {
                    title: "Tạo shipper",
                    breadcrumb: "Tạo"
                }
            },
            {
                path: 'edit/:id',
                component: EditShipperComponent,
                data: {
                    title: "Chỉnh sửa shipper",
                    breadcrumb: "Chỉnh sửa"
                }
            },
            {
                path: 'details/:id',
                component: ShipperDetailComponent,
                data: {
                    title: "Thông tin Shipper",
                    breadcrumb: "Thông tin"
                }
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ShipperRoutingModule { }
