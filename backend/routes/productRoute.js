import express from 'express';
import Product from '../models/productModel';
import { isAuth, isAdmin} from '../util';

const router = express.Router();

router.get("/", async (req,res)=>{
console.log("all");
const products = await Product.find({});
res.send(products);
});

router.get("/:id", async (req, res) => {
    console.log("In here");
    const product = await Product.findOne({ _id: req.params.id });
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: "Product Not Found." });
    }
  });

router.put("/:id", isAuth,isAdmin, async(req,res)=>{

    const productId= req.params.id;
    const product =await Product.findById(productId);
    if(product){
        product.name= req.body.name;
        product.image= req.body.image;
        product.price= req.body.price;
        product.brand= req.body.brand;
        product.category= req.body.category;
        product.countInStock= req.body.countInStock;
        product.description= req.body.description;

        const updatedProduct = await product.save();

        if(updatedProduct){
            res.status(200).send({msg: "Product Updated", data: updatedProduct});
        }
    }
  
    return res.status(500).send({msg: "Error in updating the product"});
});

router.delete("/:id", isAuth, isAdmin, async(req,res)=>{

    const deletedProduct = await Product.findById(req.params.id);
    if(deletedProduct){
        await deletedProduct.remove();
        res.status(200).send({msg: "Product deleted"});
    }else{
        res.status(500).send({msg:"Error in Deletion"});
    }
})

router.post("/", isAuth, isAdmin, async(req,res)=>{

    const product = new Product({
        name: req.body.name,
        image: req.body.image,
        price: req.body.price,
        brand: req.body.brand,
        category: req.body.category,
        countInStock: req.body.countInStock,
        description: req.body.description,
        rating: req.body.rating,
        numReview: req.body.numReview
    });

    const newProduct = await product.save();

    if(newProduct){
        res.send(201).send({msg: "New Product Created", data: newProduct});
    }
    return res.status(500).send({msg: "Error in creating a new product"});
})



export default router;

