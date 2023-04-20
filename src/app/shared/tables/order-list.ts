import { Shipper } from "./shipper"
import { User } from "./user"

export interface Order {
    id: number
    orderTrackingNumber: string
    paymentMethod: string
    orderTime: string
    productCost: number
    shippingCost: number
    status: string
    total: number
    shipper: Shipper
    user: User
    address: string

}