import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DetailOrderComponent } from "./detail-order/detail-order.component";
import { OrdersComponent } from "./orders/orders.component";
import { TransactionsComponent } from "./transactions/transactions.component";
import { ScamOrdersComponent } from "./scam-orders/scam-orders.component";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "orders",
        component: OrdersComponent,
        data: {
          title: "Danh sách đơn hàng",
          breadcrumb: "Danh sách",
        },
      },
      {
        path: "scam-orders",
        component: ScamOrdersComponent,
        data: {
          title: "Đơn hàng bị báo cáo",
          breadcrumb: "Danh sách",
        },
      },
      {
        path: "detail-order/user/:userId/order/:id",
        component: DetailOrderComponent,
        data: {
          title: "Chi tiết đơn hàng",
          breadcrumb: "Chi tiết",
        },
      },
      {
        path: "transactions",
        component: TransactionsComponent,
        data: {
          title: "Danh sách giao dịch",
          breadcrumb: "Giao dịch",
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesRoutingModule { }
