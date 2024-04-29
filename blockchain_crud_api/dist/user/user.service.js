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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./user.entity");
const fabric_network_1 = require("fabric-network");
const fs = require("fs");
const path_1 = require("path");
let UserService = class UserService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async BuildWallet() {
        const WalletPath = path_1.default.join(process.cwd(), 'test-network', 'wallet');
        const wallet = await fabric_network_1.Wallets.newFileSystemWallet(WalletPath);
        return wallet;
    }
    async CreateContractInstance() {
        try {
            const ccp = this.Buildcpp();
            const wallet = await this.BuildWallet();
            let identity = await wallet.get('User1');
            if (!identity) {
                await this.RegisterUser();
            }
            const gateway = new fabric_network_1.Gateway();
            await gateway.connect(ccp, { wallet, identity: 'User1', discovery: { enabled: true, asLocalhost: false }, eventHandlerOptions: { endorseTimeout: 1500, commitTimeout: 45000 } });
            const network = await gateway.getNetwork('mychannel');
            const contract = await network.getContract('productdetails');
            return contract;
        }
        catch (error) {
            console.log(`failed to submit transaction ${error}`);
            process.exit(1);
        }
    }
    async RegisterUser() {
        const signcertpath = path_1.default.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.test.com', 'users', 'User1@org1.test.com', 'msp', 'signcerts', 'User1@org1.test.com');
        const privkeypath = path_1.default.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.test.com', 'users', 'User1@org1.test.com', 'msp', 'keystore', 'priv_sk');
        const signcert = fs.readFileSync(signcertpath, 'utf8');
        const privatekey = fs.readFileSync(privkeypath, 'utf-8');
        const wallet = await this.BuildWallet();
        let X509Identity = {
            credentials: {
                certificate: signcert,
                privateKey: privatekey,
            },
            mspId: 'Org1MSP',
            type: 'X.509'
        };
        await wallet.put('User1', X509Identity);
    }
    Buildcpp() {
        const ccpPath = path_1.default.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.test.com', 'connection-org1.json');
        const cpp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        return cpp;
    }
    async findByUsername(username) {
        return this.usersRepository.findOne({ where: { username: username } });
    }
    async addProduct(Product, user) {
        const contract = await this.CreateContractInstance();
        const res = await contract.submitTransaction('createProduct', Product.product_id.toString(), Product.product_name, Product.manufacturer, Product.retailer, user);
        return JSON.parse(res.toString());
    }
    async updateProduct(id, Product, user) {
        const contract = await this.CreateContractInstance();
        const res = await contract.submitTransaction('UpdateProductDetails', Product.product_id.toString(), Product.product_name, Product.manufacturer, Product.retailer, user);
        return JSON.parse(res.toString());
    }
    async CreateUser(user, pass) {
        return await this.usersRepository.insert({ username: user, password: pass });
    }
    async transferOwner(id, newOwner) {
        const contract = await this.CreateContractInstance();
        const res = await contract.submitTransaction('TransferOwner', id.toString(), newOwner);
        return JSON.parse(res.toString());
    }
    async getdetails(id) {
        const contract = await this.CreateContractInstance();
        const res = await contract.evaluateTransaction('GetProductDetails', id.toString());
        return JSON.parse(res.toString());
    }
    async gethistory(id) {
        const contract = await this.CreateContractInstance();
        const res = await contract.evaluateTransaction('GetHistoryofProduct', id.toString());
        return JSON.parse(res.toString());
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map