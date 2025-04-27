export interface UserDetailDto{
    Id : number;
    Username : string;
    Email : string;
    Fullname : string;
    IsDeleted : boolean;
}

export interface ClientUserDetailDto extends UserDetailDto{
   Client : string;
   Applications : string[];
}