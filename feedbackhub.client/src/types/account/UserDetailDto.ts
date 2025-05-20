export interface UserDetailDto {
    Id: number;
    Username: string;
    Email: string;
    Fullname: string;
    IsDeleted: boolean;
}

export interface ClientUserDetailDto extends UserDetailDto {
    Client: string;
    Applications: string[];
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