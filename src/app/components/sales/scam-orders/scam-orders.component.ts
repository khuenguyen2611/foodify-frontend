import { Component, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { OrderService } from 'src/app/shared/service/order.service';
import { ShipperService } from 'src/app/shared/service/shipper.service';
import { UserService } from 'src/app/shared/service/user.service';
import { Order } from 'src/app/shared/tables/order-list';
import { Shipper } from 'src/app/shared/tables/shipper';

@Component({
  selector: 'app-scam-orders',
  templateUrl: './scam-orders.component.html',
  styleUrls: ['./scam-orders.component.scss']
})
export class ScamOrdersComponent {
  //Log-in
  token: string = localStorage.getItem("jwt-token");
  isShop: boolean = false;
  loggedRole: string;
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
    private userService: UserService,
    private shipperService: ShipperService,
    private modalService: BsModalService) { }

  ngOnInit() {
    this.userService.getUserByToken(this.token).subscribe((userInfo) => {
      this.loggedRole = userInfo.userRole;
      this.listOrder();
    })
  }

  listOrder() {
    this.orderService.findOrderByStatus('REJECT_DELIVERY', this.thePageNumber - 1, this.thePageSize, this.sortBy, this.sortDir)
      .subscribe(this.processResult());
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
      console.log(data)
      this.orders = data.orders;
      this.thePageNumber = data.page.pageNo + 1;
      this.thePageSize = data.page.pageSize;
      this.theTotalElements = data.page.totalElements;
      this.totalOrders = data.page.totalElements;
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
