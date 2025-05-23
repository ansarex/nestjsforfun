import { Body, Controller, Post, Get, Patch, Session, Param, Query, Delete, NotFoundException, UseInterceptors, ClassSerializerInterceptor, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from './user.entity';


@Controller('auth')
@Serialize(UserDto)

export class UsersController {
    constructor(private userService: UsersService, private authService: AuthService) { }

    //Session learning
    @Get('/colors/:color')
    setColor(@Param('color') color: string, @Session() session: any) {
        session.color = color;
    }

    //Session learning
    @Get('/colors')
    getColor(@Session() session: any) {
        return session.color
    }


    // @Get('/whoami')
    // WhoAmI(@Session() session: any) {
    //     return this.userService.findOne(session.id);
    // }


    @Get('/whoami')
    @UseGuards(AuthGuard)
    WhoAmI(@CurrentUser() user: User) {
        return user;
    }


    @Post('/signout')
    signOut(@Session() session: any) {
        session.id = null;
    }


    @Post('/signup')
    async createUser(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signup(body.email, body.password);
        session.id = user.id
        return user;
    }


    @Post('/signin')
    async signin(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signin(body.email, body.password)
        session.id = user.id;
        return user;
    }

    @Get('/:id')
    async findUser(@Param('id') id: string) {
        console.log('handler is runninig')
        const user = await this.userService.findOne(parseInt(id))
        if (!user) {
            throw new NotFoundException('user not found');
        }
        return user;
    }

    @Get()
    findAllUsers(@Query('email') email: string) {
        return this.userService.find(email);
    }

    @Delete('/:id')
    removeUser(@Param('id') id: string) {
        return this.userService.remove(parseInt(id))
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
        return this.userService.update(parseInt(id), body);
    }


}
