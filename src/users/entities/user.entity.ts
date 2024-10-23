//user.entity.ts
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN',
    MANAGER = 'MANAGER' 
}

@Entity('bg_user')
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        unique: true
    })
    username: string;
    
    @Column()
    password: string;
    
    @Column()
    role: Role
}
