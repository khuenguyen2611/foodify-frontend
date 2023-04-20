import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from 'src/app/shared/service/order.service';
import { UserService } from 'src/app/shared/service/user.service';
import { Order } from 'src/app/shared/tables/order-list';
import { User } from 'src/app/shared/tables/user';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  user: User;
  orders: Order[] = [];
  active = 1;

  //Pagination Properties
  thePageNumber = 1;
  thePageSize = 5;
  sortBy = 'orderTime';
  sortDir = 'desc';
  theTotalElements = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private orderService: OrderService
  ) {

  }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.loadUserDetail(id);
  }

  loadUserDetail(id: number) {
    this.userService.getUserById(id).subscribe((user) => {
      this.user = user;
    })
    this.orderService.getOrdersByUserId(id, this.thePageNumber - 1, this.thePageSize, this.sortBy, this.sortDir).subscribe(this.processResult());
  }

  processResult() {
    return (data: any) => {
      this.orders = data.orders;
      this.thePageNumber = data.page.pageNo + 1;
      this.thePageSize = data.page.pageSize;
      this.theTotalElements = data.page.totalElements;
    };
  }
}
