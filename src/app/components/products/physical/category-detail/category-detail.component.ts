import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from 'src/app/shared/service/category.service';
import { ProductService } from 'src/app/shared/service/product.service';

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.scss']
})
export class CategoryDetailComponent implements OnInit {
  products = [];
  catName: string = '';
  categories: number[] = [];

  //Pagination Properties
  thePageNumber = 1;
  thePageSize = 10;
  theTotalElements = 0;

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private route: ActivatedRoute) {

  }
  ngOnInit(): void {
    this.getProductByCategories();
  }

  getProductByCategories() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.categories.push(id)
    this.productService.getProductsByCategoryIds(this.categories, this.thePageNumber - 1, this.thePageSize).subscribe(
      this.processResult()
    )
  }

  processResult() {
    return (data: any) => {
      this.products = data.products;
      this.thePageNumber = data.page.pageNo + 1;
      this.thePageSize = data.page.pageSize;
      this.theTotalElements = data.page.totalElements;
      this.catName = this.products[0].categories.name;
    }
  }
}
