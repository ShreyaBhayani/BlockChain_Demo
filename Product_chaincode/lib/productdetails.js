const {Contract}= require ("fabric-contract-api");

class ProductDetails extends Contract{
    async createProduct(ctx,product_id,product_name,manufacturer,retailer,owner)
    {
        try{
            const exists = await this.ProductExists(ctx, product_id);
            if(exists)
            {
                throw new Error('Product '+product_id+'already exists');
            }
            const Product = {
                ID: product_id,
                name:product_name,
                manufacturer:manufacturer,
                retailer:retailer,
                owner:owner
            }

            await ctx.stub.putState(product_id,Buffer.from(JSON.stringify(Product)));
            return{message:"Product inserted successfully",code:200};
        }
        catch(err)
        {
            return {message:err,code :400};
        }
    }
   
    async ProductExists(ctx, product_id) {
        const product_details = await ctx.stub.getState(product_id);
        return product_details && product_details.length > 0;
    }

    async UpdateProductDetails(ctx,product_id,product_name,manufacturer,retailer,owner)
    {
        try{
            const exists = await this.ProductExists(ctx, product_id);
            if(!exists)
            {
                throw new Error('Product '+product_id+'does not exists');
            }
            const Product = {
                ID: product_id,
                name:product_name,
                manufacturer:manufacturer,
                retailer:retailer,
                owner:owner
            }
    
            await ctx.stub.putState(product_id,Buffer.from(JSON.stringify(Product)));
            return{message:"Product updated successfully",code:200};
        }
       
        catch(err)
        {
            return {message:err,code :400};
        }
    }
   
    async GetProductDetails(ctx, product_id) {
        try{
            const product_details = await ctx.stub.getState(product_id); // get the asset from chaincode state
            if (!product_details || product_details.length === 0) {
                throw new Error('The product_details '+product_id+'does not exist');
            }
            return product_details.toString();
        }
        catch(err)
        {
            return {message:err,code :400};
        }       
    }

    async GetHistoryofProduct(ctx,product_id)
    {
        const exists = await this.ProductExists(ctx, product_id);
        if(!exists)
        {
            throw new Error('Product '+product_id+'does not exists');
        }

        let iterator= await ctx.stub.getHistoryForKey(product_id);
        let res=await iterator.next();
        let productinfo=[];
        while(!res.done)
        {
            if(res.value && res.value.value.toString("utf-8"))
            {
                let jsonRes={};
                try
                {
                    jsonRes=JSON.parse(res.value.value.toString("utf-8"));
                    jsonRes.TxId=res.value.txId;
                    jsonRes.Timestamp=res.value.timestamp;
                }
                catch(err)
                {
                    jsonRes.Record=res.value.value.toString("utf-8");
                }
                productinfo.push(jsonRes);
            }
            res=await iterator.next();
        }
        iterator.close();
        return productinfo;
    }

    async TransferOwner(ctx, product_id, newOwner) {
        try{
            const exists = await this.ProductExists(ctx, product_id);
            if(!exists)
            {
                throw new Error('Product '+product_id+'does not exists');
            }
            const product_details = await this.GetProductDetails(ctx, product_id);
            const product = JSON.parse(product_details);
            product.owner = newOwner;
            await ctx.stub.putState(product_id,Buffer.from(JSON.stringify(product)));
            return{message:"Product owner updated successfully",code:200};
        }
        catch(err)
        {
            return {message:err,code :400};
        }
    }
}

module.exports=ProductDetails;
