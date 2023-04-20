import { Order } from "./order-list";
import { Shop } from "./shop";
import { User } from "./user";

export class Shipper {
    //Dto
    id: number;
    isActive: boolean;
    isShipping: boolean;
    userId: number;
    shopId: number;

    //responses
    user: User;
    shop: Shop;
    orders: Order[];
}