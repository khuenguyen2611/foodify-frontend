import { DecimalPipe } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FirebaseService } from 'src/app/shared/service/firebase.service';
import { TableService } from 'src/app/shared/service/table.service';
import { UserService } from 'src/app/shared/service/user.service';
import { User } from 'src/app/shared/tables/user';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.scss'],
  providers: [TableService, DecimalPipe]
})
export class ListUserComponent implements OnInit {
  users: User[] = [];
  userDel: User;

  searchForm: FormGroup

  //Pagination Properties
  role: string = 'ROLE_USER'
  thePageNumber = 1;
  thePageSize = 10;
  sortBy = 'id';
  sortDir = 'asc';
  theTotalElements = 0;

  constructor(
    private userService: UserService,
    private firebaseService: FirebaseService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService) {

  }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      searchName: ['']
    })

    this.listAllUsers()
  }

  listAllUsers() {
    this.userService.getAllUsersByRole(this.role, this.thePageNumber - 1, this.thePageSize, this.sortBy, this.sortDir)
      .subscribe(this.processResult());
  }

  processResult() {
    return (data: any) => {
      this.users = data.users;
      this.thePageNumber = data.page.pageNo + 1;
      this.thePageSize = data.page.pageSize;
      this.theTotalElements = data.page.totalElements;
    }
  }

  searchUser() {
    if (this.searchName.trim() !== '') {
      this.userService.getAllUsersByRoleAndEmailOrPhoneNumber(this.searchName, this.role, this.thePageNumber - 1, this.thePageSize, this.sortBy, this.sortDir).subscribe(this.processResult());
    }
    else {
      this.listAllUsers()
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
    this.userService.deleteUserById(this.userDel.id).subscribe()
    this.firebaseService.deleteUserByEmail(this.userDel.email).subscribe(() => {
      this.listAllUsers();
      this.layer1.hide();
      this.layer1 = this.modalService.show(success, { class: 'modal-sm' });
    });

  }

  closeLayer1() {
    this.layer1.hide();
  }


  get searchName() { return this.searchForm.get('searchName').value }

}

