export interface CreateAdminUserDto{
    FullName : string;
    Email : string;
    Password : string;
    ConfirmPassword: string;
    Accesses : AdminUserApplicationAccessDto[];
}

export interface AdminUserApplicationAccessDto{
    ClientId : number;
    ApplicationIds : number[];
}