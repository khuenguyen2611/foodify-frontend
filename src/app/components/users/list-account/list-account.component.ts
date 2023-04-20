import { Component, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FirebaseService } from 'src/app/shared/service/firebase.service';
import { UserService } from 'src/app/shared/service/user.service';
import { User } from 'src/app/shared/tables/user';

@Component({
  selector: 'app-list-account',
  templateUrl: './list-account.component.html',
  styleUrls: ['./list-account.component.scss']
})
export class ListAccountComponent {
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
