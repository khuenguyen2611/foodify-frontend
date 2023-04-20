import { Component, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren } from "@angular/core";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { SortEvent } from "src/app/shared/directives/shorting.directive";
import { NgbdSortableHeader } from "src/app/shared/directives/NgbdSortableHeader";
import { TableService } from "src/app/shared/service/table.service";
import { catchError, EMPTY, Observable, tap } from "rxjs";
import { DecimalPipe } from "@angular/common";
import { Order } from "src/app/shared/tables/order-list";
import { OrderService } from "src/app/shared/service/order.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Shipper } from "src/app/shared/tables/shipper";
import { ShipperService } from "src/app/shared/service/shipper.service";

@Component({
  selector: "app-orders",
  templateUrl: "./orders.component.html",
  styleUrls: ["./orders.component.scss"],
  providers: [TableService, DecimalPipe],
})
export class OrdersComponent implements OnInit {
  //Log-in
  isShop: boolean = false;
  loggedId: number = Number(localStorage.getItem('user-id'))
  loggedRole = localStorage.getItem('user-role');
  shopId: number;

  //Required properties
  oldid: number = 1;
  userId: number;
  orderId: number;

  orders: Order[] = [];

  //Pagination Properties
  thePageNumber = 1;
  thePageSize = 10;
  sortBy = "orderTime";
  sortDir = "desc";
  theTotalElements = 0;

  order: Order;
  layer1: BsModalRef;
  layer2: BsModalRef;

  selectedStatus: string;
  isHaveShipper: boolean = false;
  shipper: Shipper = undefined;
  shippers: Shipper[] = [];
  searchName: string = '';

  //Event
  refreshInterval = 5000;
  refreshTimeout;
  totalOrders = 0;

  orderStatuses = ["Chờ xác nhận", "Đã xác nhận", "Đang giao hàng", "Giao thành công", "Đã huỷ đơn", "Không nhận hàng"];

  constructor(private orderService: OrderService,
    private shipperService: ShipperService,
    private modalService: BsModalService) { }

  ngOnInit() {
    if (this.loggedRole != 'ROLE_ADMIN') {
      this.isShop = true;
      this.shopId = Number(localStorage.getItem('shop-id'))
    }
    this.listOrder();
  }

  listOrder() {
    if (this.isShop) {
      this.orderService.getOrdersByShopId(this.shopId, this.thePageNumber - 1, this.thePageSize, this.sortBy, this.sortDir)
        .subscribe(this.processResult());

      this.shipperService.findFreeShopShipper(this.shopId).subscribe((shippers) => {
        this.shippers = shippers;
      })
    }
    else {
      this.orderService
        .getOrdersPagination(this.thePageNumber - 1, this.thePageSize, this.sortBy, this.sortDir)
        .subscribe(this.processResult());
    }

    this.refreshTimeout = setTimeout(() => {
      this.refreshOrder();
    }, this.refreshInterval);
  }

  refreshOrder() {
    if (this.isShop) {
      this.orderService.getOrdersByShopId(this.shopId, this.thePageNumber - 1, this.thePageSize, this.sortBy, this.sortDir)
        .subscribe(this.refreshResult());

      this.shipperService.findFreeShopShipper(this.shopId).subscribe((shippers) => {
        this.shippers = shippers;
      })
    }
    else {
      this.orderService
        .getOrdersPagination(this.thePageNumber - 1, this.thePageSize, this.sortBy, this.sortDir)
        .subscribe(this.refreshResult());
    }

    this.refreshTimeout = setTimeout(() => {
      this.refreshOrder();
    }, this.refreshInterval);
  }

  searchOrder() {
    if (this.searchName.trim() !== '') {
      this.orderService.findOrdersByTrackingNumber(this.searchName, this.thePageNumber - 1, this.thePageSize, this.sortBy, this.sortDir)
        .subscribe(this.processResult());
    }
    else {
      this.listOrder()
    }
  }

  processResult() {
    return (data: any) => {
      this.orders = data.orders;
      this.thePageNumber = data.page.pageNo + 1;
      this.thePageSize = data.page.pageSize;
      this.theTotalElements = data.page.totalElements;
      this.totalOrders = data.page.totalElements;
    };
  }

  refreshResult() {
    return (data: any) => {
      this.orders = data.orders;
      this.thePageNumber = data.page.pageNo + 1;
      this.thePageSize = data.page.pageSize;
      this.theTotalElements = data.page.totalElements;
      if (this.totalOrders != this.theTotalElements) {
        this.totalOrders = this.theTotalElements;
      }
    };
  }

  // Change status order modal
  openStatusModal(confirmBoxChangeStatus: TemplateRef<any>, userId: number, orderId: number, shipper: Shipper) {
    this.isHaveShipper = false;
    if (shipper != undefined) {
      this.isHaveShipper = true
    }

    this.orderService.getOrderById(userId, orderId).subscribe(
      (order: Order) => {
        this.userId = userId;
        this.orderId = orderId;
        this.selectedStatus = order.status;
        this.layer1 = this.modalService.show(confirmBoxChangeStatus, { class: "modal-sm" });
      },
      (error) => {
        console.error(error); // handle error
      }
    );
  }

  confirmBoxChangeStatus(successChangeStatus: TemplateRef<any>) {
    if (this.shipper) {
      this.isHaveShipper = true;
    }

    // console.log(this.isHaveShipper)
    if (this.isHaveShipper) {
      this.orderService.updateOrderShipper(this.userId, this.orderId, this.shipper.id).subscribe(() => {
        this.orderService.updateOrderStatus(this.userId, this.orderId, this.selectedStatus).subscribe((res) => { });
        this.layer1.hide();
        this.layer1 = this.modalService.show(successChangeStatus, { class: "modal-sm" });
      })
    }
    else {
      this.orderService.updateOrderStatus(this.userId, this.orderId, this.selectedStatus).subscribe((res) => { });
      this.layer1.hide();
      this.layer1 = this.modalService.show(successChangeStatus, { class: "modal-sm" });
    }


    // if (!this.isHaveShipper) {
    //     if (this.shipper != undefined) {
    //       this.orderService.updateOrderStatus(this.userId, this.orderId, this.selectedStatus).subscribe((res) => { });
    //       this.layer1.hide();
    //       this.layer1 = this.modalService.show(successChangeStatus, { class: "modal-sm" });
    //     }
    //     else {
    //       this.orderService.updateOrderShipper(this.userId, this.orderId, this.shipper.id).subscribe(() => {
    //         this.orderService.updateOrderStatus(this.userId, this.orderId, this.selectedStatus).subscribe((res) => { });
    //         this.layer1.hide();
    //         this.layer1 = this.modalService.show(successChangeStatus, { class: "modal-sm" });
    //       });
    //     }
    //   }
    //   else {
    //     this.orderService.updateOrderStatus(this.userId, this.orderId, this.selectedStatus).subscribe((res) => { });
    //     this.layer1.hide();
    //     this.layer1 = this.modalService.show(successChangeStatus, { class: "modal-sm" });
    //   }
  }

  decline() {
    this.shipper = undefined;
    this.layer1.hide();
  }

  successChangeStatus() {
    this.listOrder();
    this.layer1.hide();
  }


  // Delete order modal
  openDeleteModal(confirmBoxDelete: TemplateRef<any>, userId: number, orderId: number) {
    this.userId = userId
    this.orderId = orderId

    this.layer1 = this.modalService.show(confirmBoxDelete, { class: "modal-sm" });
  }

  confirmBoxDelete(userId: number, orderId: number, successDelete: TemplateRef<any>) {
    this.orderService.deleteOrderById(this.userId, this.orderId).subscribe(() => {
      this.listOrder()
    })
    this.layer1.hide()
    this.layer1 = this.modalService.show(successDelete, { class: "modal-sm" });
  }

  successDelete() {
    this.listOrder();
    this.layer1.hide();
  }

  ngOnDestroy() {
    // Xóa timeout khi component bị destroy
    clearTimeout(this.refreshTimeout);
  }
}