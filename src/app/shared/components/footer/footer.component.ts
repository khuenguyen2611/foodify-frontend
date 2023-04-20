import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { OrderService } from '../../service/order.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  //Log-in
  loggedId: number = Number(localStorage.getItem('user-id'))
  loggedRole = localStorage.getItem('user-role');
  shopId: number;

  //Pagination Properties
  thePageNumber = 1;
  thePageSize = 10;
  sortBy = "orderTime";
  sortDir = "desc";
  theTotalElements = 0;

  //Order
  refreshInterval = 5000;
  refreshTimeout;

  //Modal
  mainLayer: BsModalRef;

  @ViewChild('new_order') newOrderTemplate: TemplateRef<any>;

  constructor(
    private orderService: OrderService,
    private modalService: BsModalService,
    private router: Router) { }

  ngOnInit() {
    if (this.loggedRole == 'ROLE_SHOP') {
      this.shopId = Number(localStorage.getItem('shop-id'))
      this.countShopOrder();
    }
  }

  countShopOrder() {
    this.orderService.getOrdersByShopId(this.shopId, this.thePageNumber - 1, this.thePageSize, this.sortBy, this.sortDir)
      .subscribe((data) => {
        this.theTotalElements = data.page.totalElements;

        this.refreshTimeout = setTimeout(() => {
          this.refreshShopOrder();
        }, this.refreshInterval);
      })


  }

  refreshShopOrder() {
    this.orderService.getOrdersByShopId(this.shopId, this.thePageNumber - 1, this.thePageSize, this.sortBy, this.sortDir)
      .subscribe((data) => {
        if (this.theTotalElements < data.page.totalElements) {
          this.mainLayer = this.modalService.show(this.newOrderTemplate, { class: "modal-sm" });
          this.theTotalElements = data.page.totalElements;
        }
        else {
          this.theTotalElements = data.page.totalElements;
        }
      })

    this.refreshTimeout = setTimeout(() => {
      this.refreshShopOrder();
    }, this.refreshInterval);
  }

  confirmNewOrder() {
    this.mainLayer.hide();
    this.router.navigate(['/sales/orders']);
  }

  ngOnDestroy() {
    // Xóa timeout khi component bị destroy
    clearTimeout(this.refreshTimeout);
  }
}
