import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateProductDto } from 'src/dto/create-product.dto';
import { Wallet } from 'fabric-network';
export declare class UserService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    BuildWallet(): Promise<Wallet>;
    CreateContractInstance(): Promise<import("fabric-network").Contract>;
    RegisterUser(): Promise<void>;
    Buildcpp(): Record<string, any>;
    findByUsername(username: string): Promise<User | undefined>;
    addProduct(Product: CreateProductDto, user: string): Promise<any>;
    updateProduct(id: number, Product: CreateProductDto, user: string): Promise<any>;
    CreateUser(user: string, pass: string): Promise<import("typeorm").InsertResult>;
    transferOwner(id: number, newOwner: string): Promise<any>;
    getdetails(id: number): Promise<any>;
    gethistory(id: number): Promise<any>;
}
