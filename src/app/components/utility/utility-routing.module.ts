import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListAddressComponent } from './list-address/list-address.component';
import { ListSliderComponent } from './list-slider/list-slider.component';
import { AdminGuard } from 'src/app/shared/guard/admin-guard.service';

const routes: Routes = [
    {
        path: '', canActivate: [AdminGuard],
        children: [
            {
                path: 'list-address',
                component: ListAddressComponent,
                data: {
                    title: "Danh sách địa chỉ",
                    breadcrumb: "Danh sách"
                }
            },
            {
                path: 'list-slider',
                component: ListSliderComponent,
                data: {
                    title: "Slider",
                    breadcrumb: "Slider"
                }
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UtilityRoutingModule { }
