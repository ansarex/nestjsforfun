import {
    NestInterceptor, ExecutionContext, CallHandler, Injectable
} from "@nestjs/common";
import { UsersService } from "../users.service";
import { Observable } from "rxjs";

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
    constructor (private userService: UsersService) {}
    async intercept(context: ExecutionContext, next: CallHandler<any>) {
        const request = context.switchToHttp().getRequest()
        const { id } = request.session || {};

        if(id) {
            const user = await this.userService.findOne(id);
            request.currentUser = user;
        }

        return next.handle();
    }
}