import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from "@ckeditor/ckeditor5-angular";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Product } from "../../../../shared/tables/product";

@Component({
    selector: 'app-add-product-category',
    templateUrl: './add-product-category.component.html',
    styleUrls: ['./add-product-category.component.scss']
})
export class AddProductCategoryComponent {
    public productForm: UntypedFormGroup;
    public Editor = ClassicEditor;
    public counter: number = 1;
    public url = [{
        img: "assets/images/user.png",
    },
    {
        img: "assets/images/user.png",
    },
    {
        img: "assets/images/user.png",
    },
    {
        img: "assets/images/user.png",
    },
    {
        img: "assets/images/user.png",
    }
    ];


    @ViewChild('productQuantity') quantity;
    @ViewChild('ckEditor') ckEditor: any;

    description: string = '';

    modalRef: BsModalRef;
    message: string;

    constructor(private fb: UntypedFormBuilder,
        private modalService: BsModalService) {
        this.productForm = this.fb.group({
            name: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
            price: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
            category: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
            code: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
            quantity: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
            // size: ['', Validators.required]
        });
    }

    onAddNewProduct() {
        // const product = new Product(
        //     this.productName, this.description, true, 20,
        //     this.productPrice,
        //     [this.productCategory], [''], 30);
        this.productForm.reset();
    }

    onChange({ editor }: ChangeEvent) {
        let data = editor.getData();
        // const data = EDITTORC.instances.Editor.document.getBody().getText();
        this.description = data;
    }

    get productName() {
        return this.productForm.get('name').value;
    }

    get productCategory() {
        return this.productForm.get('category').value;
    }

    get productPrice() {
        return this.productForm.get('price').value;
    }

    get productQuantity() {
        return this.productForm.get('quantity').value;
    }

    // get productName() {
    //     return this.productForm.get('name').value;
    // }

    increment() {
        this.counter += 1;
    }

    decrement() {
        this.counter -= 1;
    }

    // FileUpload
    readUrl(event: any, i) {
        if (event.target.files.length === 0) {
            return;
        }
        // Image upload validation
        var mimeType = event.target.files[0].type;
        if (mimeType.match(/image\/*/) == null) {
            return;
        }
        // Image upload
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (_event) => {
            this.url[i].img = reader.result.toString();
        };
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
    }

    confirm(): void {
        this.message = 'Confirmed!';
        this.modalRef.hide();
        this.productForm.reset();

        // this.ckEditor.instance.setData('');
        // this.ckEditor.setData('');
    }

    decline(): void {
        this.message = 'Declined!';
        this.modalRef.hide();
    }

    ngOnInit() {
    }

}
