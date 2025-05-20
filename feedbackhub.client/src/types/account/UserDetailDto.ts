import { ApplicationDto } from "../application/ApplicationDto";

export interface UserDetailDto {
    Id: number;
    Username: string;
    Email: string;
    Fullname: string;
    IsDeleted: boolean;
}

export interface ClientUserDetailDto extends UserDetailDto {
    Client: string;
    ClientId ? : number;
    Applications: ApplicationDto[];
}

export interface UserProfileDto {
    Id: number;
    Username: string;
    Email: string;
    Fullname: string;
    Role : string;
    Client: string;
    AvatarBase64? : string;
    Applications : string[];
}

export interface ApplicationAccessDto{
    UserId : number;
    ApplicationIds : number[];
}