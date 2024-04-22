import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateProductDto } from 'src/dto/create-product.dto';
import { Gateway, Wallet, Wallets, X509Identity } from 'fabric-network';
import * as fs from 'fs';
import path from 'path';
import * as bcrypt from 'bcryptjs'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
        private usersRepository: Repository<User>,
    )     {}
  
    async BuildWallet():Promise<Wallet>
    {
        const WalletPath = path.join(process.cwd(),'test-network','wallet');
        const wallet = await Wallets.newFileSystemWallet(WalletPath);
        return wallet;
    }

    async CreateContractInstance()
    {
        try
        {
            const ccp=this.Buildcpp();
            const wallet=await this.BuildWallet();
            let identity=await wallet.get('User1');
            if(!identity)
            {
                await this.RegisterUser();
            }
            const gateway=new Gateway();
            await gateway.connect(ccp,{wallet,identity:'User1',discovery:{enabled:true,asLocalhost:false},eventHandlerOptions:{endorseTimeout:1500,commitTimeout:45000}});
            const network=await gateway.getNetwork('mychannel');
            const contract=await network.getContract('productdetails');
            return contract;
        }
        catch(error)
        {
            console.log(`failed to submit transaction ${error}`);
            process.exit(1);
        }

    }

    async RegisterUser()
    {
        const signcertpath=path.resolve(__dirname,'..','..','test-network','organizations','peerOrganizations','org1.test.com','users','User1@org1.test.com','msp','signcerts','User1@org1.test.com')
        const privkeypath=path.resolve(__dirname,'..','..','test-network','organizations','peerOrganizations','org1.test.com','users','User1@org1.test.com','msp','keystore','priv_sk');
        const signcert=fs.readFileSync(signcertpath,'utf8');
        const privatekey=fs.readFileSync(privkeypath,'utf-8');
        const wallet=await this.BuildWallet();
        let X509Identity:X509Identity={
            credentials:{
                certificate:signcert,
                privateKey:privatekey,
            },
            mspId:'Org1MSP',
            type:'X.509'
        };
        await wallet.put('User1',X509Identity);
    }

    Buildcpp():Record<string,any>
    {
        const ccpPath=path.resolve(__dirname,'..','..','test-network','organizations','peerOrganizations','org1.test.com','connection-org1.json');
        const cpp=JSON.parse(fs.readFileSync(ccpPath,'utf8'));
        return cpp;
    }

    async findByUsername(username: string): Promise<User | undefined> {
        return this.usersRepository.findOne({where:{username:username}});
    }


    async addProduct(Product: CreateProductDto,user:string){
        const contract=await this.CreateContractInstance();
        const res= await contract.submitTransaction('createProduct',Product.product_id.toString(),Product.product_name,Product.manufacturer,Product.retailer,user);
        return JSON.parse(res.toString());
    }

    async updateProduct(id:number,Product: CreateProductDto,user:string){
        
        const contract=await this.CreateContractInstance();
        const res=await contract.submitTransaction('UpdateProductDetails',Product.product_id.toString(),Product.product_name,Product.manufacturer,Product.retailer,user);
        return JSON.parse(res.toString());
    }

    async CreateUser(user:string,pass:string)
    {
        return await this.usersRepository.insert({username:user,password:pass});
    }

    async transferOwner(id:number,newOwner:string){
        const contract=await this.CreateContractInstance();
        const res= await contract.submitTransaction('TransferOwner',id.toString(),newOwner);
         return JSON.parse(res.toString());
    }

    async getdetails(id:number):Promise<any>{
        const contract=await this.CreateContractInstance();
        const res= await contract.evaluateTransaction('GetProductDetails',id.toString());
         return JSON.parse(res.toString());
    }

    async gethistory(id:number)
    {
        const contract=await this.CreateContractInstance();
        const res = await contract.evaluateTransaction('GetHistoryofProduct',id.toString());
         return JSON.parse(res.toString());
    }
}
