import { AfterViewInit, Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { vendorsDB } from '../../../shared/tables/vendor-list';
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { FormBuilder, FormGroup, NgForm, Validators } from "@angular/forms";
import { ShopService } from 'src/app/shared/service/shop.service';
import { Router } from '@angular/router';
import { Shop } from 'src/app/shared/tables/shop';
import { FirebaseService } from 'src/app/shared/service/firebase.service';
import { UserService } from 'src/app/shared/service/user.service';

@Component({
    selector: 'app-list-vendors',
    templateUrl: './list-vendors.component.html',
    styleUrls: ['./list-vendors.component.scss']
})
export class ListVendorsComponent implements OnInit {
    shops = [];
    userId: number;
    emailDelete: string;

    //Pagination Properties
    thePageNumber = 1;
    thePageSize = 10;
    theTotalElements = 0;

    searchName: string = '';

    constructor(
        private router: Router,
        private shopService: ShopService,
        private modalService: BsModalService,
        private firebaseService: FirebaseService,
        private userService: UserService
    ) {

    }

    ngOnInit(): void {
        this.listAllShops();
    }

    listAllShops() {
        this.shopService.getShopsPagination(this.thePageNumber - 1, this.thePageSize).subscribe(this.processResult());
    }

    searchShop() {
        if (this.searchName.trim() !== '') {
            this.shopService.findShopByName(this.searchName, this.thePageNumber - 1, this.thePageSize)
                .subscribe(this.processResult());
        }
        else {
            this.listAllShops()
        }
    }

    processResult() {
        return (data: any) => {
            this.shops = data.shops;
            this.thePageNumber = data.page.pageNo + 1;
            this.thePageSize = data.page.pageSize;
            this.theTotalElements = data.page.totalElements;
        }
    }

    //Modal
    modalRef: BsModalRef;

    openDeleteModal(template: TemplateRef<any>, shopId: number) {
        this.shopService.getShopById(shopId).subscribe((shop) => {
            this.emailDelete = shop.user.email;
            this.userId = shop.user.id;
            this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
        })
    }

    confirm(template: TemplateRef<any>): void {
        this.userService.deleteUserById(this.userId).subscribe(() => {
            this.firebaseService.deleteUserByEmail(this.emailDelete).subscribe(() => {
                this.listAllShops();
                this.modalRef.hide();
                this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
            })
        });
    }

    decline(): void {
        this.modalRef.hide();
    }

    continue(): void {
        this.modalRef.hide();
        this.router.navigate(['/vendors/list']);
    }
}
