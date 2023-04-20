import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UtilityRoutingModule } from './utility-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListAddressComponent } from './list-address/list-address.component';
import { ListSliderComponent } from './list-slider/list-slider.component';
import { NgImageSliderModule } from 'ng-image-slider';
import { CarouselModule } from 'ngx-owl-carousel-o';

@NgModule({
    declarations: [ListAddressComponent, ListSliderComponent],
    imports: [
        CommonModule,
        UtilityRoutingModule,
        NgbModule,
        ReactiveFormsModule,
        SharedModule,
        FormsModule,
        CarouselModule
        // NgImageSliderModule,
    ]
})
export class UtilityModule { }
