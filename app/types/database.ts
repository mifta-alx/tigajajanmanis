import type {Role} from "~/types/role";

export interface UserRow {
    id: string,
    username: string,
    fullname: string,
    phone_number: string,
    address: string | null,
    role: Role,
    created_at: string,
    updated_at: string,
}