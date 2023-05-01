import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as chartData from '../../shared/data/chart';
import { doughnutData, pieData } from '../../shared/data/chart';
import { ShopService } from 'src/app/shared/service/shop.service';
import { ProductService } from 'src/app/shared/service/product.service';
import { Product } from 'src/app/shared/tables/product';
import { Order } from 'src/app/shared/tables/order-list';
import { OrderService } from 'src/app/shared/service/order.service';
import { resolve } from 'path';
import { forkJoin } from 'rxjs';
import { UserService } from 'src/app/shared/service/user.service';
import { FirebaseService } from 'src/app/shared/service/firebase.service';
import { UserInfo } from 'src/app/shared/tables/user';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
    //Log-in
    token = localStorage.getItem("jwt-token")
    userInfo: UserInfo;
    isShop: boolean = false;
    loggedId: number;
    loggedRole: string;
    shopId: number;

    //Shop Properties
    totalRevenue: number = 0;
    totalProducts: number = 0;
    totalReviewCount: number = 0;
    totalAverageRating: number = 0;
    roundedRating: string;

    //Orders
    orders: Order[] = [];

    //Pagination Properties
    thePageNumber = 1;
    thePageSize = 5;
    sortBy = "orderTime";
    sortDir = "desc";
    theTotalElements = 0;

    //District value
    thanhKheValue: number;
    sonTraValue: number;
    camLeValue: number;
    lienChieuValue: number;
    haiChauValue: number;
    hoaVangValue: number;
    nguHanhSonValue: number;
    hoangSaValue: number;

    //Products
    products: Product[] = [];
    isData: boolean = false;

    //Admin
    totalUser: number = 0;
    day: number = 30;

    public doughnutData: Array<Object> = [];
    public pieData;

    constructor(
        private userService: UserService,
        private shopService: ShopService,
        private productService: ProductService,
        private orderService: OrderService,
        private firebaseService: FirebaseService
    ) {
    }


    ngOnInit() {
        this.userService.getUserByToken(this.token).subscribe((userInfo) => {
            if (userInfo.userRole != 'ROLE_ADMIN') {
                this.isShop = true;
                this.shopId = userInfo.shopId;

                // this.shopId = Number(localStorage.getItem('shop-id'))

                // const shopIdPromise = new Promise<number>((resolve) => {
                //     const shopId = Number(localStorage.getItem('shop-id'));
                //     resolve(shopId);
                // })

                // shopIdPromise.then((shopId) => {
                //     this.shopId = shopId;

                this.productService.getProductsByShopIdNoPageable(this.shopId).subscribe((products) => {
                    let i = 0;
                    products.forEach(product => {
                        this.totalReviewCount = this.totalReviewCount + product.reviewCount;
                        this.totalProducts = this.totalProducts + product.sold;
                        if (product.averageRating != 0) {
                            this.totalAverageRating = this.totalAverageRating + product.averageRating;
                            i++;
                        }
                    });
                    if (i != 0) {
                        this.totalAverageRating = (this.totalAverageRating / i);
                        this.roundedRating = this.totalAverageRating.toFixed(2);
                    }
                })

                this.productService.getProductsByShopIdAndSort(this.shopId, 0, 5, 'sold', 'desc').subscribe((data) => {
                    this.products = data.products;
                    if (this.products.length > 4) {
                        this.isData = true;
                    }
                    this.doughtnutData(data.products);
                })

                this.orderService.getOrdersByShopId(userInfo.shopId, this.thePageNumber - 1, this.thePageSize, this.sortBy, this.sortDir)
                    .subscribe(this.processResult());
                this.shopService.getShopRevenue(userInfo.shopId, 30).subscribe((res) => {
                    this.totalRevenue = res;
                });
                this.valueOfShopDistrict();
                // })

            }
            else {
                //ADMIN DO HERE

                this.userService.countNewUser(this.day).subscribe((res) => {
                    this.totalUser = res;
                })
                this.productService.getProductsNoPagination().subscribe((products) => {
                    let i = 0;
                    products.forEach(product => {
                        this.totalReviewCount = this.totalReviewCount + product.reviewCount;
                        this.totalProducts = this.totalProducts + product.sold;
                        if (product.averageRating != 0) {
                            this.totalAverageRating = this.totalAverageRating + product.averageRating;
                            i++;
                        }
                    });
                    this.totalAverageRating = this.totalAverageRating / i;
                })

                this.productService.getProductsPaginationAndSort(0, 5, 'sold', 'desc').subscribe((data) => {
                    this.products = data.products;
                    this.doughtnutData(data.products)
                })

                this.orderService
                    .getOrdersPagination(this.thePageNumber - 1, this.thePageSize, this.sortBy, this.sortDir)
                    .subscribe(this.processResult());

                this.valueOfAdminDistrict();
            }

        })
    }

    processResult() {
        return (data: any) => {
            this.orders = data.orders;
            this.thePageNumber = data.page.pageNo + 1;
            this.thePageSize = data.page.pageSize;
            this.theTotalElements = data.page.totalElements;
        };
    }

    // doughnut 2
    public view = chartData.view;
    public doughnutChartColorScheme = chartData.doughnutChartcolorScheme;
    public doughnutChartShowLabels = chartData.doughnutChartShowLabels;
    public doughnutChartGradient = chartData.doughnutChartGradient;
    public doughnutChartTooltip = chartData.doughnutChartTooltip;

    public chart5 = chartData.chart5;


    // lineChart
    public lineChartData = chartData.lineChartData;
    public lineChartLabels = chartData.lineChartLabels;
    public lineChartOptions = chartData.lineChartOptions;
    public lineChartColors = chartData.lineChartColors;
    public lineChartLegend = chartData.lineChartLegend;
    public lineChartType = chartData.lineChartType;

    // lineChart
    public smallLineChartData = chartData.smallLineChartData;
    public smallLineChartLabels = chartData.smallLineChartLabels;
    public smallLineChartOptions = chartData.smallLineChartOptions;
    public smallLineChartLegend = chartData.smallLineChartLegend;
    public smallLineChartType = chartData.smallLineChartType;

    // lineChart
    public smallLine2ChartData = chartData.smallLine2ChartData;
    public smallLine2ChartLabels = chartData.smallLine2ChartLabels;
    public smallLine2ChartOptions = chartData.smallLine2ChartOptions;
    public smallLine2ChartLegend = chartData.smallLine2ChartLegend;
    public smallLine2ChartType = chartData.smallLine2ChartType;

    // lineChart
    public smallLine3ChartData = chartData.smallLine3ChartData;
    public smallLine3ChartLabels = chartData.smallLine3ChartLabels;
    public smallLine3ChartOptions = chartData.smallLine3ChartOptions;
    public smallLine3ChartLegend = chartData.smallLine3ChartLegend;
    public smallLine3ChartType = chartData.smallLine3ChartType;

    // lineChart
    public smallLine4ChartData = chartData.smallLine4ChartData;
    public smallLine4ChartLabels = chartData.smallLine4ChartLabels;
    public smallLine4ChartOptions = chartData.smallLine4ChartOptions;
    public smallLine4ChartColors = chartData.smallLine4ChartColors;
    public smallLine4ChartLegend = chartData.smallLine4ChartLegend;
    public smallLine4ChartType = chartData.smallLine4ChartType;

    public chart3 = chartData.chart3;


    // events
    public chartClicked(e: any): void {
    }

    public chartHovered(e: any): void {
    }



    ngAfterViewInit(): void {
    }

    valueOfAdminDistrict() {
        const requests = [
            this.orderService.countOrderByDistrict('Thanh Khê'),
            this.orderService.countOrderByDistrict('Sơn Trà'),
            this.orderService.countOrderByDistrict('Cẩm Lệ'),
            this.orderService.countOrderByDistrict('Liên Chiểu'),
            this.orderService.countOrderByDistrict('Hải Châu'),
            this.orderService.countOrderByDistrict('Hoà Vang'),
            this.orderService.countOrderByDistrict('Ngũ Hành Sơn'),
            this.orderService.countOrderByDistrict('Hoàng Sa')
        ];

        forkJoin(requests).subscribe(
            (results: number[]) => {
                this.thanhKheValue = results[0];
                this.sonTraValue = results[1];
                this.camLeValue = results[2];
                this.lienChieuValue = results[3];
                this.haiChauValue = results[4];
                this.hoaVangValue = results[5];
                this.nguHanhSonValue = results[6];
                this.hoangSaValue = results[7];

                this.pieData = [
                    {
                        value: this.thanhKheValue,
                        name: "Quận Thanh Khê"

                    },
                    {
                        value: this.sonTraValue,
                        name: "Quận Sơn Trà"
                    },
                    {
                        value: this.camLeValue,
                        name: "Quận Cẩm Lệ"
                    },
                    {
                        value: this.lienChieuValue,
                        name: "Quận Liên Chiểu"
                    },
                    {
                        value: this.haiChauValue,
                        name: "Quận Hải Châu"
                    },
                    {
                        value: this.hoaVangValue,
                        name: "Huyện Hoà Vang"
                    },
                    {
                        value: this.nguHanhSonValue,
                        name: "Quận Ngũ Hành Sơn"
                    },
                    {
                        value: this.hoangSaValue,
                        name: "Huyện Hoàng Sa"
                    }
                ]
            },
            (error) => {
                console.error('Error:', error);
            }
        );
    }

    valueOfShopDistrict() {
        const requests = [
            this.orderService.countShopOrderByDistrict(this.shopId, 'Thanh Khê'),
            this.orderService.countShopOrderByDistrict(this.shopId, 'Sơn Trà'),
            this.orderService.countShopOrderByDistrict(this.shopId, 'Cẩm Lệ'),
            this.orderService.countShopOrderByDistrict(this.shopId, 'Liên Chiểu'),
            this.orderService.countShopOrderByDistrict(this.shopId, 'Hải Châu'),
            this.orderService.countShopOrderByDistrict(this.shopId, 'Hoà Vang'),
            this.orderService.countShopOrderByDistrict(this.shopId, 'Ngũ Hành Sơn'),
            this.orderService.countShopOrderByDistrict(this.shopId, 'Hoàng Sa')
        ];

        forkJoin(requests).subscribe(
            (results: number[]) => {
                this.thanhKheValue = results[0];
                this.sonTraValue = results[1];
                this.camLeValue = results[2];
                this.lienChieuValue = results[3];
                this.haiChauValue = results[4];
                this.hoaVangValue = results[5];
                this.nguHanhSonValue = results[6];
                this.hoangSaValue = results[7];

                this.pieData = [
                    {
                        value: this.thanhKheValue,
                        name: "Quận Thanh Khê"

                    },
                    {
                        value: this.sonTraValue,
                        name: "Quận Sơn Trà"
                    },
                    {
                        value: this.camLeValue,
                        name: "Quận Cẩm Lệ"
                    },
                    {
                        value: this.lienChieuValue,
                        name: "Quận Liên Chiểu"
                    },
                    {
                        value: this.haiChauValue,
                        name: "Quận Hải Châu"
                    },
                    {
                        value: this.hoaVangValue,
                        name: "Huyện Hoà Vang"
                    },
                    {
                        value: this.nguHanhSonValue,
                        name: "Quận Ngũ Hành Sơn"
                    },
                    {
                        value: this.hoangSaValue,
                        name: "Huyện Hoàng Sa"
                    }
                ]
            },
            (error) => {
                console.error('Error:', error);
            }
        );
    }

    doughtnutData(products: Product[]) {
        // products.forEach((product) => {
        //     this.doughnutData.push({ value: product.sold, name: product.name });
        // })

        this.doughnutData = [
            {
                value: products[0]?.sold,
                name: products[0]?.name

            },
            {
                value: products[1]?.sold,
                name: products[1]?.name
            },
            {
                value: products[2]?.sold,
                name: products[2]?.name
            },
            {
                value: products[3]?.sold,
                name: products[3]?.name
            },
            {
                value: products[4]?.sold,
                name: products[4]?.name
            }
        ];
    }
}
