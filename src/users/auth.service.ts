import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt);


@Injectable()
export class AuthService {
    constructor(private userService: UsersService) {}


    async signup(email: string, password: string) {
        // See if email is in use
        const  users = await this.userService.find(email);
        if (users.length) {
            throw new BadRequestException('Email in use');
        }
        
        // Hash the users password
        


        // Generate a salt
        const salt = randomBytes(8).toString('hex');

        // Hash the salt and the password togehter
        const hash = (await scrypt(password, salt , 32)) as Buffer;

        //Join the hasshed result ad the salt toegehter
        const result = salt + '.' + hash.toString('hex');

        //Create a new user and save it
        const user = await this.userService.create(email, result)

        //return the user
        return user;
    }

    async signin( email: string, password: string) {

        const [user] = await this.userService.find(email);
        if(!user) {
            throw new NotFoundException('user not found');
        } 
        const [salt, storedHash] = user.password.split('.');
        console.log( [salt, storedHash])
        const hash = (await scrypt(password, salt, 32)) as Buffer

        if (storedHash !== hash.toString('hex')) {
            throw new BadRequestException('bad password')
        } 
        return user;
    }
}