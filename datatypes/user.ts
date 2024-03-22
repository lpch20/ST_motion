export class User implements IUser {
    id: number = 0;
    id_user_master: number = 0;
    rol_id: number = 0;
    numberOfAttempts: number = 0;
    user_name: string = "";
    password: string = "";
    firstname: string = "";
    lastname: string = "";
    ext: string = "";
    active: boolean = false;
    image_name: string = "";
    withoutPhone = false;
}

export interface IUser {
    id: number;
    id_user_master: number;
    rol_id: number;
    numberOfAttempts: number;
    user_name: string;
    password: string;
    firstname: string;
    lastname: string;
    ext: string
    active: boolean;
    image_name: string;
    withoutPhone: boolean;
}