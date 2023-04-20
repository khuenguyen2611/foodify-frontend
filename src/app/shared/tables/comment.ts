import { User } from "./user"

export class Comment {
    id: number
    user: User
    rating: number
    content: string
}