import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ShipperService } from 'src/app/shared/service/shipper.service';
import { UserService } from 'src/app/shared/service/user.service';
import { Shipper } from 'src/app/shared/tables/shipper';

@Component({
  selector: 'app-shipper-detail',
  templateUrl: './shipper-detail.component.html',
  styleUrls: ['./shipper-detail.component.scss']
})
export class ShipperDetailComponent {
  shipper: Shipper;

  constructor(
    private shipperService: ShipperService,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private router: Router
  ) {

  }

  ngOnInit() {
    this.handleShipperDetails()
  }

  handleShipperDetails() {
    const shipperId = +this.route.snapshot.paramMap.get('id')!;
    this.shipperService.getShipperById(shipperId).subscribe((shipper) => {
      this.shipper = shipper
    })
  }


}
