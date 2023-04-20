import { Component, TemplateRef } from '@angular/core';
import { FormArray, FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ProductService } from 'src/app/shared/service/product.service';
import { Product } from 'src/app/shared/tables/product';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/shared/tables/category';
import { ProductImageService } from 'src/app/shared/service/product-image.service';
import { finalize, Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ProductImage } from 'src/app/shared/tables/product-image';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent {
  public adminImg = environment.adminImg;
  public editProductForm: UntypedFormGroup;
  // public Editor = ClassicEditor;

  active = 1;
  oldRandomImg: string;
  editOrDeleteId: number;

  editProductId: number;
  product: Product;
  isEnabled: boolean;
  items!: FormArray;
  imageContent: string;
  imageUploadFile: File;
  downloadURL: Observable<string>;

  constructor(
    private fb: UntypedFormBuilder,
    private productService: ProductService,
    private productImageService: ProductImageService,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private router: Router,
    private storage: AngularFireStorage) {
  }

  ngOnInit() {
    this.reload();
  }

  createEditForm() {
    this.editProductForm = this.fb.group({
      name: new FormControl("", [Validators.required, Validators.minLength(2)]),
      price: new FormControl("", [Validators.required, Validators.pattern("^[0-9]*$")]),
      shopId: new FormControl("", [Validators.required, Validators.pattern("^[0-9]*$")]),
      descriptions: new FormControl("", [Validators.required, Validators.minLength(8)]),
      discountPercent: new FormControl("", [Validators.required, Validators.pattern("^[0-9]*$")]),
      categories: new FormArray([])
    });
  }

  reload() {
    this.createEditForm();
    const productId = +this.route.snapshot.paramMap.get('id')!;
    this.productService.getProductById(productId).subscribe(
      product => this.fillFormToUpdate(product)
    )
  }

  fillFormToUpdate(product: Product) {
    this.product = product;
    product.categories.forEach((category: Category) => {
      this.items = this.editProductForm.get('categories') as FormArray;
      this.items.push(new FormGroup({
        categoryName: new FormControl(category.name, Validators.required)
      }))
    })

    this.isEnabled = product.isEnabled;
    this.editProductId = product.id;
    this.oldRandomImg = product.images[0].imageUrl;

    this.editProductForm.patchValue({
      id: product.id,
      name: product.name,
      price: product.cost,
      descriptions: product.description,
      discountPercent: product.discountPercent,
      shopId: product.shop.id
    })
  }

  onUpdateProduct() {
    const categoryNames: string[] = this.items.controls.map(control => control.get('categoryName').value);
    const product = new Product();
    product.id = 1;
    product.name = this.productName.value;
    product.description = this.descriptions.value;
    product.isEnabled = this.isEnabled;
    product.discountPercent = this.discountPercent.value;
    product.cost = this.productPrice.value;
    product.averageRating = 0;
    product.reviewCount = 0;
    product.shopId = this.productShopId.value;
    product.categoryNames = categoryNames;
    this.productService.updateProductById(this.editProductId, product).subscribe();
  }

  addNewCategory() {
    this.items = this.editProductForm.get('categories') as FormArray;
    this.items.push(this.generateNewCategory());
  }

  generateNewCategory(): FormGroup {
    return new FormGroup({
      categoryName: new FormControl('', Validators.required)
    });
  }

  deleteCategory(index: number) {
    this.items = this.editProductForm.get('categories') as FormArray;
    this.items.removeAt(index);

  }

  swap() {
    if (this.isEnabled) {
      this.isEnabled = false
    }
    else {
      this.isEnabled = true;
    }
  }

  //Image
  onFileSelected(event) {
    this.imageUploadFile = (event.target as HTMLInputElement).files[0];
  }

  uploadProductImage(fileUpload: File): Promise<string> {
    return new Promise<string>((resolve) => {
      let n = Date.now();
      const filePath = `Products/${n}`;

      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(`Products/${n}`, fileUpload);
      task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            this.downloadURL = fileRef.getDownloadURL();
            this.downloadURL.subscribe(url => {
              if (url) {
                resolve(url);
              }
            });
          })
        )
        .subscribe(url => {

        }
        );
    })
  }

  //Modal
  layer1: BsModalRef;
  layer2: BsModalRef;

  openModal(template: TemplateRef<any>) {
    this.layer1 = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirm(template: TemplateRef<any>): void {
    this.layer1.hide();
    this.layer1 = this.modalService.show(template, { class: 'modal-sm' });
    this.onUpdateProduct();
  }

  closeLayer1(): void {
    this.layer1.hide();
  }

  closeLayer1AndReload(): void {
    this.layer1.hide();
    this.reload();
  }

  list() {
    this.layer1.hide();
    this.router.navigate(["/products/product-list"])
  }

  openImgModal(id: number, imageTemplate: TemplateRef<any>) {
    if (this.editProductForm.invalid) {
      this.editProductForm.markAllAsTouched()
      return;
    }
    this.editOrDeleteId = id;
    this.layer1 = this.modalService.show(imageTemplate, { class: 'modal-sm' });
  }

  uploadNewImage(successTemplate: TemplateRef<any>) {
    this.imageContent = "Thêm ảnh";
    const newImage = new ProductImage();
    newImage.productId = this.product.id;
    this.uploadProductImage(this.imageUploadFile).then((url) => {
      newImage.imageUrl = url;
      this.productImageService.addProductImage(newImage, this.product.id).subscribe(() => {
        this.layer1.hide();
        this.layer1 = this.modalService.show(successTemplate, { class: 'modal-sm' });
      })
    })
  }

  updateImage(successTemplate: TemplateRef<any>) {
    this.imageContent = "Chỉnh sửa ảnh";
    const editImage = new ProductImage();
    editImage.productId = this.product.id;
    this.uploadProductImage(this.imageUploadFile).then((url) => {
      editImage.imageUrl = url;
      this.productImageService.updateProductImage(this.product.id, this.editOrDeleteId, editImage).subscribe(() => {
        this.layer1.hide();
        this.layer1 = this.modalService.show(successTemplate, { class: 'modal-sm' });
      })
    })
  }

  deleteImage(successTemplate: TemplateRef<any>) {
    this.imageContent = "Xoá ảnh";
    this.productImageService.deleteProductImage(this.product.id, this.editOrDeleteId).subscribe();
    this.layer1.hide();
    this.layer1 = this.modalService.show(successTemplate, { class: 'modal-sm' });
  }

  //Getter
  get productName() { return this.editProductForm.get('name') }

  get productCategory() {
    const numberStr: string = this.editProductForm.get('category').value;
    const idArr: number[] = numberStr.split(",").map(Number);
    return idArr;
  }

  get productPrice() { return this.editProductForm.get('price') }

  get productShopId() { return this.editProductForm.get('shopId') }

  get categories() {
    return this.editProductForm.get('categories') as FormArray;
  }

  get descriptions() { return this.editProductForm.get('descriptions') }

  get discountPercent() { return this.editProductForm.get('discountPercent') }
}