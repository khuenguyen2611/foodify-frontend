import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderDetailService } from 'src/app/shared/service/order-detail.service';
import { OrderService } from 'src/app/shared/service/order.service';
import { OrderDetails } from 'src/app/shared/tables/order-detail';
import { Order } from 'src/app/shared/tables/order-list';
import { Product } from 'src/app/shared/tables/product';

@Component({
  selector: 'app-detail-order',
  templateUrl: './detail-order.component.html',
  styleUrls: ['./detail-order.component.scss']
})
export class DetailOrderComponent {
  constructor(private route: ActivatedRoute,
    private orderService: OrderService,
    private orderDetailService: OrderDetailService,
    private router: Router) { }

  order: Order
  orderId: number
  orderDetails: OrderDetails[] = []

  //Pagination Properties
  thePageNumber = 1;
  thePageSize = 10;
  sortBy = "id";
  sortDir = "asc";
  theTotalElements = 0;

  ngOnInit() {
    this.handleOrderEdit();
    this.listOrderDetails()
  }

  handleOrderEdit() {
    let orderId = +this.route.snapshot.paramMap.get("id")!;
    let userId = +this.route.snapshot.paramMap.get("userId")!;
    this.orderId = orderId;

    this.orderService.getOrderById(userId, orderId).subscribe((order) => {
      this.order = order;
    })
  }

  listOrderDetails() {
    this.orderDetailService.getOrderDetail(this.orderId, this.thePageNumber - 1, this.thePageSize, this.sortBy, this.sortDir)
      .subscribe(this.processResult())
  }

  processResult() {
    return (data: any) => {
      this.orderDetails = data.orderDetails;
      this.thePageNumber = data.page.pageNo + 1;
      this.thePageSize = data.page.pageSize;
      this.theTotalElements = data.page.totalElements;
    };
  }

  goBackToList() {
    this.router.navigate(['/sales/orders']);
  }
}
