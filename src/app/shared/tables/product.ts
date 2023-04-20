import { Category } from "./category";
import { ProductImage } from "./product-image";
import { Shop } from "./shop";

export class Product {

    id: number;
    name: string;
    description: string;
    isEnabled: boolean;
    discountPercent: number;
    cost: number;
    averageRating: number;
    reviewCount: number;

    sold: number;
    categoryNames: string[];
    categories: Category[];
    images: ProductImage[];

    shopId: number;
    shop: Shop;
}
