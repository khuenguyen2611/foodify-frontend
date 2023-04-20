import { Component, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AddressService } from 'src/app/shared/service/address.service';
import { AddressResponse } from 'src/app/shared/tables/address-response';

@Component({
  selector: 'app-list-address',
  templateUrl: './list-address.component.html',
  styleUrls: ['./list-address.component.scss']
})
export class ListAddressComponent {

  searchName: string = '';
  addresses: AddressResponse[];
  deleteAddressId: number;

  //Pagination Properties
  thePageNumber = 1;
  thePageSize = 10;
  theTotalElements = 0;

  constructor(private addressService: AddressService,
    private modalService: BsModalService) {

  }

  ngOnInit() {
    this.listAllAddress()
  }

  listAllAddress() {
    this.addressService.getAllAddressPagination(this.thePageNumber - 1, this.thePageSize).subscribe(this.processResult());
  }

  searchAddress() {
    if (this.searchName.trim() !== '') {
      this.addressService.findAddressesByName(this.searchName, this.thePageNumber - 1, this.thePageSize)
        .subscribe(this.processResult())
    }
    else {
      this.listAllAddress()
    }
  }

  processResult() {
    return (data: any) => {
      this.addresses = data.addresses;
      this.thePageNumber = data.page.pageNo + 1;
      this.thePageSize = data.page.pageSize;
      this.theTotalElements = data.page.totalElements;
    }
  }

  //Modal
  modalRef: BsModalRef;

  confirmDeleted(template: TemplateRef<any>, id: number) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
    this.deleteAddressId = id;
  }

  confirm(template: TemplateRef<any>) {
    this.modalRef.hide();
    this.addressService.deleteAddressById(this.deleteAddressId).subscribe();
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  decline() {
    this.modalRef.hide();
  }

  completed() {
    this.modalRef.hide();
    this.listAllAddress();
  }
}
