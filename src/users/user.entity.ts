import { Entity, Column, PrimaryGeneratedColumn, AfterInsert, AfterRemove, AfterUpdate } from "typeorm";
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    email: string;
    @Column()
    password: string;

    @AfterInsert()
    logInsert() {
        console.log('Inserted User with id', this.id) 
    }

    @AfterUpdate()
    logUpdate() {
        console.log('update', this.id)
    }

    @AfterRemove()
    logAfter() {
        console.log('remove User with id', this.id);
    }

    
}