import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ProductService } from "../../../../shared/service/product.service";
import { UserService } from 'src/app/shared/service/user.service';

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss']
})

export class ProductListComponent implements OnInit {
    //Login Info
    token: string = localStorage.getItem("jwt-token");
    loggedRole: string;
    isShop: boolean = false;
    shopId: number;

    searchName: string = '';
    products = [];
    deleteProductId: number;
    usingTimes: number;

    //Pagination Properties
    thePageNumber = 1;
    thePageSize = 12;
    theTotalElements = 0;

    constructor(private productService: ProductService,
        private userService: UserService,
        private modalService: BsModalService,
        private router: Router) {
    }

    ngOnInit() {
        this.userService.getUserByToken(this.token).subscribe((userInfo) => {
            this.loggedRole = userInfo.userRole;
            if (userInfo.userRole != 'ROLE_ADMIN') {
                this.isShop = true;
                this.shopId = userInfo.shopId;
            }
            this.listProduct();
        })
    }

    listProduct() {
        if (this.loggedRole == 'ROLE_ADMIN') {
            this.productService.getProductsPagination(this.thePageNumber - 1, this.thePageSize).subscribe(this.processResult());
        }
        else {
            this.productService.getProductsByShopId(Number(this.shopId), this.thePageNumber - 1, this.thePageSize).subscribe(this.processResult());
        }
    }

    searchProduct() {
        if (this.searchName.trim() !== '') {
            if (this.loggedRole === 'ROLE_ADMIN') {
                this.productService.searchProductsByName(this.searchName, this.thePageNumber - 1, this.thePageSize)
                    .subscribe(this.processResult());
            }
            else {
                this.productService.searchShopProductsByName(this.shopId, this.searchName, this.thePageNumber - 1, this.thePageSize)
                    .subscribe(this.processResult());
            }
        }
        else {
            this.listProduct();
        }
    }

    processResult() {
        return (data: any) => {
            this.products = data.products;
            this.thePageNumber = data.page.pageNo + 1;
            this.thePageSize = data.page.pageSize;
            this.theTotalElements = data.page.totalElements;
        }
    }

    //Modal
    modalRef: BsModalRef;

    openModal(template: TemplateRef<any>, id: number) {
        this.deleteProductId = id;
        this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
    }

    confirm(deleteProductId: number, template: TemplateRef<any>): void {
        this.productService.deleteProduct(deleteProductId).subscribe(data => {

        });
        this.modalRef.hide();
        this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
    }

    decline(): void {
        this.modalRef.hide();
    }

    successDelete() {
        this.modalRef.hide()
        this.listProduct();
        this.router.navigate(['/products/product-list']);
    }
}
