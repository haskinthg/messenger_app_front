// import { ROLE } from "../auth/role";
// import { Authority } from "./auth/authority";
// import { RoleUser } from "./roleuser";

// export class User {
//     id: number;
//     username: string;
//     enabled: boolean;
//     roles: RoleUser[];
// }

export interface User {
    id: number;
    username: string;
    photo: String;
}