"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const jwt = require("jsonwebtoken");
const create_product_dto_1 = require("../dto/create-product.dto");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async createuser(user) {
        console.log(user);
        if (!user.username || user.username == "" || !user.password || user.password == "") {
            return { "code": 400, "message": "invalid username or password" };
        }
        await this.userService.CreateUser(user.username, user.password);
        return { "code": 200, "message": "user created successfully" };
    }
    async login(body) {
        const { username, password } = body;
        const user = await this.userService.findByUsername(username);
        console.log(user);
        if (!user || password != user.password) {
            throw new Error('Invalid credentials');
        }
        const token = this.generateToken(user.id, user.username);
        return { token, username: user.username };
    }
    async create(Product, req) {
        return await this.userService.addProduct(Product, req.user);
    }
    async update(Product, req) {
        if (!await this.checkProductOwner(Product.product_id, req.user)) {
            return { "code": 400, "message": "only owner can access product" };
        }
        return this.userService.updateProduct(Product.product_id, Product, req.user);
    }
    async transferowner(info, req) {
        if (!await this.checkProductOwner(info.product_id, req.user)) {
            return { "code": 400, "message": "only owner can access product" };
        }
        return this.userService.transferOwner(info.product_id, info.NewOwner);
    }
    async getdetails(id, req) {
        if (!await this.checkProductOwner(id, req.user)) {
            return { "code": 400, "message": "only owner can access product" };
        }
        return this.userService.getdetails(id);
    }
    async gethistory(id, req) {
        if (!await this.checkProductOwner(id, req.user)) {
            return { "code": 400, "message": "only owner can access product" };
        }
        return this.userService.gethistory(id);
    }
    generateToken(userId, username) {
        const payload = { userId, username };
        return jwt.sign(payload, '12345678', { expiresIn: '8h' });
    }
    async checkProductOwner(id, user) {
        const product = await this.userService.getdetails(id);
        if (product.owner !== user) {
            return false;
        }
        return true;
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)('users/signup'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createuser", null);
__decorate([
    (0, common_1.Post)('users/login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('addproduct'),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe({ transform: true }))),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "create", null);
__decorate([
    (0, common_1.Put)('update/'),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe({ transform: true }))),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
__decorate([
    (0, common_1.Put)('transferowner'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "transferowner", null);
__decorate([
    (0, common_1.Get)('getdetails/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getdetails", null);
__decorate([
    (0, common_1.Get)('gethistory/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "gethistory", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map