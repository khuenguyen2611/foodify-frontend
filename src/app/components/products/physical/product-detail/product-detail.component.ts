import { Component, OnInit, TemplateRef } from "@angular/core";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { Image } from "@ks89/angular-modal-gallery";
import { NgbRatingConfig } from "@ng-bootstrap/ng-bootstrap";
import { Product } from "src/app/shared/tables/product";
import { Comment } from "src/app/shared/tables/comment";
import { ProductService } from "src/app/shared/service/product.service";
import { ActivatedRoute, Router } from "@angular/router";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ProductImage } from "src/app/shared/tables/product-image";
import { CommentService } from "src/app/shared/service/comment.service";

@Component({
  selector: "app-product-detail",
  templateUrl: "./product-detail.component.html",
  styleUrls: ["./product-detail.component.scss"],
  providers: [NgbRatingConfig],
})
export class ProductDetailComponent implements OnInit {
  product: Product;
  deleteProductId: number;
  productId: number
  imageUrls: ProductImage[] = [];
  imagesRect: Image[] = [];

  //Pagination Properties
  thePageNumber = 1;
  thePageSize = 10;
  sortBy = "id";
  sortDir = "asc";
  theTotalElements = 0;

  // Rating
  comments: Comment[] = []

  constructor(
    private modalService: BsModalService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private commentService: CommentService
  ) { }

  ngOnInit() {
    this.handleProductDetails()
    this.listComments()
  }

  handleProductDetails() {
    const productId = +this.route.snapshot.paramMap.get("id")!;
    this.productId = productId
    this.productService.getProductById(productId).subscribe((data) => {
      this.product = data;
    });
  }

  listComments() {
    this.commentService.getProductRating(this.productId, this.thePageNumber - 1, this.thePageSize, this.sortBy, this.sortDir)
      .subscribe(this.processResult());
  }

  processResult() {
    return (data: any) => {
      this.comments = data.comments;
      this.thePageNumber = data.page.pageNo + 1;
      this.thePageSize = data.page.pageSize;
      this.theTotalElements = data.page.totalElements;
    };
  }

  //Modal
  modalRef: BsModalRef;

  openModal(template: TemplateRef<any>, id: number) {
    this.deleteProductId = id;
    this.modalRef = this.modalService.show(template, { class: "modal-sm" });
  }

  confirm(deleteProductId: number, template: TemplateRef<any>): void {
    this.productService.deleteProduct(deleteProductId).subscribe((data) => {

    });
    this.modalRef.hide();
    this.modalRef = this.modalService.show(template, { class: "modal-sm" });
  }

  decline(): void {
    this.modalRef.hide();
  }

  successDelete() {
    this.modalRef.hide();
    // this.listProduct();
    this.router.navigate(["/products/product-list"]);
  }
}
