import { IsEmail  } from 'class-validator';

export class UserDto 
{
    id!: number;

    firstName!: string;

    lastName!: string;

    @IsEmail()
    email!: string;
        
    createdAt!: Date;
    
    updatedAt!: Date;
}