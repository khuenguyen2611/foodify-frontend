import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ProductService } from "src/app/shared/service/product.service";
import { ShopService } from "src/app/shared/service/shop.service";
import { Shop } from "src/app/shared/tables/shop";

@Component({
  selector: "app-vendor-detail",
  templateUrl: "./vendor-detail.component.html",
  styleUrls: ["./vendor-detail.component.scss"],
})
export class VendorDetailComponent implements OnInit {
  products = [];
  active = 1;
  shop: Shop;

  //Pagination Properties
  thePageNumber = 1;
  thePageSize = 10;
  theTotalElements = 0;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private shopService: ShopService
  ) {}
  ngOnInit(): void {
    this.loadShopDetails();
    this.listProduct();
  }

  loadShopDetails() {
    const shopId = +this.route.snapshot.paramMap.get("id")!;
    this.shopService.getShopById(shopId).subscribe((shop) => {
      this.shop = shop;
    });
  }

  listProduct() {
    const shopId = +this.route.snapshot.paramMap.get("id")!;
    this.productService
      .getProductsByShopId(shopId, this.thePageNumber - 1, this.thePageSize)
      .subscribe(this.processResult());
  }

  processResult() {
    return (data: any) => {
      this.products = data.products;
      this.thePageNumber = data.page.pageNo + 1;
      this.thePageSize = data.page.pageSize;
      this.theTotalElements = data.page.totalElements;
    };
  }
}
