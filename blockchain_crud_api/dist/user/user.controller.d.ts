import { UserService } from './user.service';
import { CreateProductDto } from 'src/dto/create-product.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    createuser(user: any): Promise<{
        code: number;
        message: string;
    }>;
    login(body: {
        username: string;
        password: string;
    }): Promise<{
        token: string;
        username: string;
    }>;
    create(Product: CreateProductDto, req: any): Promise<any>;
    update(Product: CreateProductDto, req: any): Promise<any>;
    transferowner(info: {
        product_id: number;
        NewOwner: string;
    }, req: any): Promise<any>;
    getdetails(id: number, req: any): Promise<any>;
    gethistory(id: number, req: any): Promise<any>;
    private generateToken;
    checkProductOwner(id: number, user: string): Promise<boolean>;
}
