import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShipperRoutingModule } from './shippers-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListShipperComponent } from './list-shipper/list-shipper.component';
import { CreateShipperComponent } from './create-shipper/create-shipper.component';
import { ShipperDetailComponent } from './shipper-detail/shipper-detail.component';
import { EditShipperComponent } from './edit-shipper/edit-shipper.component';

@NgModule({
    declarations: [ListShipperComponent, CreateShipperComponent, ShipperDetailComponent, EditShipperComponent],
    imports: [
        CommonModule,
        ShipperRoutingModule,
        NgbModule,
        ReactiveFormsModule,
        SharedModule,
        FormsModule
    ]
})
export class ShipperModule { }
