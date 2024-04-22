import { Controller, Get, Post, Body, Param, Delete, Put, Req, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { CreateProductDto } from 'src/dto/create-product.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('users/signup')
  async createuser(@Body() user:any)
  {
    console.log(user);
    if(!user.username || user.username=="" || !user.password || user.password =="")
    {
        return {"code":400,"message":"invalid username or password"};
    }
    await this.userService.CreateUser(user.username,user.password);
    return {"code":200,"message":"user created successfully"};
  }

  @Post('users/login')
  async login(@Body() body: { username: string; password: string }) {
    const { username, password } = body;
    // Authenticate user
    const user = await this.userService.findByUsername(username);
    console.log(user);
    if (!user || password!=user.password) {
      throw new Error('Invalid credentials');
    }
    // Generate JWT token
    const token = this.generateToken(user.id, user.username);
    return { token, username: user.username };
  }

  @Post('addproduct')
  async create(@Body(new ValidationPipe({ transform: true })) Product: CreateProductDto,@Req() req:any): Promise<any> {
    return await this.userService.addProduct(Product,req.user);
  } 

  @Put('update/')
  async update(@Body(new ValidationPipe({ transform: true })) Product: CreateProductDto,@Req() req:any): Promise<any> {
    if(!await this.checkProductOwner(Product.product_id,req.user))
    {
        return {"code":400,"message":"only owner can access product"};
    }
    return this.userService.updateProduct(Product.product_id, Product,req.user);
  }

  @Put('transferowner')
  async transferowner(@Body() info:{product_id:number,NewOwner:string},@Req() req:any): Promise<any> {
    if(!await this.checkProductOwner(info.product_id,req.user))
    {
        return {"code":400,"message":"only owner can access product"};
    }
    return this.userService.transferOwner(info.product_id,info.NewOwner);
  }

  @Get('getdetails/:id')
  async getdetails(@Param('id') id: number,@Req() req:any): Promise<any> {
    if(!await this.checkProductOwner(id,req.user))
    {
        return {"code":400,"message":"only owner can access product"};
    }
    return this.userService.getdetails(id);
  }

  @Get('gethistory/:id')
  async gethistory(@Param('id') id: number,@Req() req:any): Promise<any> {
    if(!await this.checkProductOwner(id,req.user))
    {
        return {"code":400,"message":"only owner can access product"};
    }
    return this.userService.gethistory(id);
  }

  private generateToken(userId: number, username: string): string {
    const payload = { userId, username };
    return jwt.sign(payload, '12345678', { expiresIn: '8h' });
  }

  async checkProductOwner(id:number,user:string)
  {
    const product=await this.userService.getdetails(id);
    if(product.owner!==user)
    {
        return false;
    }
    return true;
  }
}
