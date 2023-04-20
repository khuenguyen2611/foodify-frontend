import { Product } from "./product"

export class OrderDetails {
    id: number
    quantity: number
    subtotal: number
    product: Product[]
}