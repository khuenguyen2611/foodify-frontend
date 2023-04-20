import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FirebaseService } from 'src/app/shared/service/firebase.service';
import { ShipperService } from 'src/app/shared/service/shipper.service';
import { Shipper } from 'src/app/shared/tables/shipper';

@Component({
  selector: 'app-list-shipper',
  templateUrl: './list-shipper.component.html',
  styleUrls: ['./list-shipper.component.scss']
})
export class ListShipperComponent {
  //Log-in properties
  isShop: boolean = false;
  loggedId: number = Number(localStorage.getItem('user-id'))
  loggedRole = localStorage.getItem('user-role');
  shopId: number;

  searchName: string = '';

  shippers: Shipper[] = [];

  //Pagination Properties
  thePageNumber = 1;
  thePageSize = 10;
  theTotalElements = 0;
  sortBy: string = 'isShipping';
  sortDir: string = 'asc';

  modalRef: BsModalRef;
  shipperId: number
  email: string;

  constructor(private shipperService: ShipperService,
    private modalService: BsModalService,
    private router: Router,
    private firebaseService: FirebaseService) {
  }

  ngOnInit() {
    if (this.loggedRole != 'ROLE_ADMIN') {
      this.isShop = true;
      this.shopId = Number(localStorage.getItem('shop-id'))
    }
    this.listAllShipper();
  }

  listAllShipper() {
    if (this.isShop) {
      return this.shipperService.getShipperByShopId(this.shopId, this.thePageNumber - 1, this.thePageSize, this.sortBy, this.sortDir)
        .subscribe(this.processResult());
    }
    else {
      return this.shipperService.getShipperPagination(this.thePageNumber - 1, this.thePageSize).subscribe(this.processResult())
    }
  }

  searchShipper() {
    if (this.searchName.trim() !== '') {
      if (this.loggedRole == 'ROLE_ADMIN') {
        this.shipperService.findShipperByName(this.searchName, this.thePageNumber - 1, this.thePageSize).subscribe(this.processResult());
      }
      else {
        this.shipperService.findShopShipperByName(this.shopId, this.searchName, this.thePageNumber - 1, this.thePageSize)
          .subscribe(this.processResult());
      }
    }
    else {
      this.listAllShipper();
    }
  }

  processResult() {
    return (data: any) => {
      this.shippers = data.shippers;
      this.thePageNumber = data.page.pageNo + 1;
      this.thePageSize = data.page.pageSize;
      this.theTotalElements = data.page.totalElements;
    }
  }

  openModal(template: TemplateRef<any>, id: number) {
    this.shipperId = id;
    this.shipperService.getShipperById(this.shipperId).subscribe((shipper) => {
      this.email = shipper.user.email;
    })
    this.modalRef = this.modalService.show(template, { class: "modal-sm" });
  }

  confirmBox(shipperId: number, template: TemplateRef<any>) {
    this.shipperService.deleteShipperById(shipperId).subscribe()
    this.firebaseService.deleteUserByEmail(this.email).subscribe(() => {
      this.listAllShipper();
      this.modalRef.hide();
      this.modalRef = this.modalService.show(template, { class: "modal-sm" });
    })
  }

  decline(): void {
    this.modalRef.hide();
  }

  successDelete() {
    this.modalRef.hide();
    // this.listAllShipper();
    this.router.navigate(["shippers/list"]);
  }
}



