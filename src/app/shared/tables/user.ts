import { Address } from "./address";
import { Role } from "./role";

export class User {
    id: number;
    email: string;
    phoneNumber: string;
    fullName: string;
    dateOfBirth: string;
    imageUrl: string;
    isLocked: boolean;
    identifiedCode: string;
    roleName: string;
    defaultAddress: number

    //Response
    addresses: Address[]
    role: Role;
}

export class UserInfo {
    userId: number;
    shopId: number;
    userRole: string;
    userEmail: string;
}