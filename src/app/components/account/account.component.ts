import { DecimalPipe } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';
import { TableService } from 'src/app/shared/service/table.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { User } from 'src/app/shared/tables/user';
import { UserService } from 'src/app/shared/service/user.service';
import { FormBuilder } from '@angular/forms';
import { FirebaseService } from 'src/app/shared/service/firebase.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  providers: [TableService, DecimalPipe]
})
export class AccountComponent implements OnInit {
  users: User[] = [];
  userDel: User

  searchName: string = '';

  //Pagination Properties
  role: string = 'ALL'
  thePageNumber = 1;
  thePageSize = 10;
  sortBy = 'id';
  sortDir = 'asc';
  theTotalElements = 0;

  isSearch: boolean = false;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private firebaseService: FirebaseService,
    private modalService: BsModalService) {

  }

  ngOnInit() {
    this.listAllUsers()
  }

  listAllUsers() {
    if (this.role != 'ALL') {
      this.userService.getAllUsersByRole(this.role, this.thePageNumber - 1, this.thePageSize, this.sortBy, this.sortDir).subscribe(this.processResult());
    }
    else {
      this.userService.getAllUsers(this.thePageNumber - 1, this.thePageSize, this.sortBy, this.sortDir).subscribe(this.processResult());
    }

  }

  searchUser() {
    if (this.searchName.trim() !== '') {
      if (this.role != 'ALL') {
        this.userService.getAllUsersByRoleAndEmailOrPhoneNumber(this.searchName, this.role, this.thePageNumber - 1, this.thePageSize, this.sortBy, this.sortDir).subscribe(this.processResult());
      }
      else {
        this.userService.getAllUsersByEmailOrPhoneNumber(this.searchName, this.thePageNumber - 1, this.thePageSize, this.sortBy, this.sortDir).subscribe(this.processResult());
      }
    }
    else {
      this.listAllUsers();
    }
  }

  processResult() {
    return (data: any) => {
      this.users = data.users;
      this.thePageNumber = data.page.pageNo + 1;
      this.thePageSize = data.page.pageSize;
      this.theTotalElements = data.page.totalElements;
    }
  }

  onSort(sortItem: string) {
    if (this.sortDir == 'asc') {
      this.sortBy = sortItem;
      this.sortDir = 'desc';
    }
    else {
      this.sortDir = 'asc'
    }
    this.listAllUsers();
  }

  //Modal
  layer1: BsModalRef;

  openModal(user: User, template: TemplateRef<any>) {
    this.userDel = user;
    this.layer1 = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirmDeleted(success: TemplateRef<any>) {
    this.userService.deleteUserById(this.userDel.id).subscribe();
    this.firebaseService.deleteUserByEmail(this.userDel.email).subscribe(() => {
      this.listAllUsers();
      this.layer1.hide();
      this.layer1 = this.modalService.show(success, { class: 'modal-sm' });
    });

  }

  closeLayer1() {
    this.layer1.hide();
  }
}
