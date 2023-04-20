import { Component, OnInit, TemplateRef } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TableService } from 'src/app/shared/service/table.service';
import { CategoryService } from 'src/app/shared/service/category.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Category } from 'src/app/shared/tables/category';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize, Observable } from 'rxjs';
import { resolve } from 'path';
import { Router } from '@angular/router';

@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss'],
    providers: [TableService, DecimalPipe],
})


export class CategoryComponent implements OnInit {
    public closeResult: string;
    categoryForm: FormGroup;
    categories: Category[];
    categoryId: number;

    //File
    imageFile: File;
    imageUrl;
    downloadURL: Observable<string>;

    constructor(
        private categoryService: CategoryService,
        private modalService: BsModalService,
        private formBuilder: FormBuilder,
        private storage: AngularFireStorage,
        private router: Router) {
        this.categoryForm = this.formBuilder.group({
            categoryName: [''],
            categoryImage: ['']
        })
    }

    ngOnInit(): void {
        this.listCategories();
    }

    listCategories() {
        this.categoryService.getCategories().subscribe(
            data => {
                this.categories = data;
            }
        )
    }

    //Modal
    modalRef: BsModalRef;

    openModal(template: TemplateRef<any>, id: number) {
        this.categoryId = id;
        this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
    }

    confirm(categoryId: number, template: TemplateRef<any>): void {
        this.categoryService.deleteCategoryById(categoryId).subscribe();
        this.modalRef.hide();
        this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
    }

    decline(): void {
        this.modalRef.hide();
    }

    editCategory(template: TemplateRef<any>, category: Category) {
        this.categoryId = category.id

        this.categoryForm.patchValue({
            categoryName: category.name,
            categoryImage: category.imageUrl
        })

        this.modalRef = this.modalService.show(template, { class: 'modal-md' });
    }

    onSaveCategory(event, template: TemplateRef<any>) {
        this.uploadImage().then(() => {
            const category = new Category()
            category.name = this.categoryName
            category.imageUrl = this.imageUrl;

            this.categoryService.editCategoryById(this.categoryId, category).subscribe()
            this.modalRef.hide();
            this.modalRef = this.modalService.show(template, { class: 'modal-md' });
        })
    }

    success(): void {
        this.modalRef.hide();
        this.listCategories();
        this.router.navigate(['/products/category'])
    }

    onFileSelected(event) {
        this.imageFile = event.target.files[0];
    }

    uploadImage(): Promise<void> {
        return new Promise<void>((resolve) => {
            let n = Date.now();
            const filePath = `Category/${n}`;

            const fileRef = this.storage.ref(filePath);
            const task = this.storage.upload(`Category/${n}`, this.imageFile);
            task
                .snapshotChanges()
                .pipe(
                    finalize(() => {
                        this.downloadURL = fileRef.getDownloadURL();
                        this.downloadURL.subscribe(url => {
                            if (url) {
                                //return url here
                                this.imageUrl = url;
                            }
                            resolve();
                        });
                    })
                )
                .subscribe(url => {
                    // if (url) {
                    // }
                }
                );
        })
    }

    //Getter
    get categoryName() { return this.categoryForm.get('categoryName').value }
}
