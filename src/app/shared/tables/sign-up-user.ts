import { Address } from "./Address";

export class SignUpUser {
    id: number;
    email: string;
    phoneNumber: string;
    fullName: string;
    dateOfBirth: string;
    imageUrl: string;
    isLocked: boolean;
    identifiedCode: string;
    roleName: string;
    addressDto: Address;
}