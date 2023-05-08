import Product from "../model/ProductModel";
import path from 'path';
import fs from 'fs';

export const getProduct = async (req,res)=>{
    try{
        const response = await Product.findAll();
        res.json(response);
    }catch(error){
        console.log(error.message);
    }
};
export const getProductByld = async(req,res)=>{
    try{
        const response = await Product.findOne({
            where:{
                id: req.params.id,
            },
        });
        res.json(response);
    }catch(error){
        console.log(error.message);
    }
};
export const createProduct =async(req,res)=>{
    if(req.files === null)
    return res.status(400).json({ msg: "No File Uploaded"});
    const name = req.body.title;
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext ;
    const url =`${req.protocol}://${req.get("host")}/images/${fileName}`;
    const allowedType = [".png",".jpg","jpeg"];

    if (!allowedType.includes(ext.toLocaleLowerCase()))
        return res.status(422).json({ msg : "invalid Images"});
        if (fileSize > 5000000)
        return res.status(422).json({msg : "Image must be less than 5 MB"});
        file.mv(`./public/image/${fileName}`, async (err) => {
            if (err) return res.status(500).json({ msg: err.message });
            try{
                await Product.create({
                    name: name,
                    image: fileName,
                    url: url,
                });
                res.status(201).json({msg: "created"});
            }catch (error){
                console.log(error.message);
            }
        });
};
export const updateProduct = async(req,res)=>{
    const product = await Product.findOne({
        where: {
            id: req.params.id,
        },
    });
    if (!product) return res.status(404).json({ msg: "NOT found"});
    let fileName ="";
    if (req.files === null){
        fileName = product.image;
    }else{
        const file = req.files.files;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        fileName = file.md5 + ext;
        const allowedType = [".png", ".jpg", ".jpeg"];

        if(!allowedType.includes(ext.toLocaleLowerCase()))
        return res.status(422).json({ msg: "Invalid Images"});
        if(fileSize > 5000000)
        return res.status(422).json({ msg: "Image must be less than 5 MB"});

        const filepath = `./public/images/${product.image}`;
        fs.unlinkSync(filepath);

        file.mv(`./public/images/${fileName}`,(err)=>{
            if(err) return res.status(500).json({ msg: err.message});
    });
}
const name = req.body.title;
const url =`${req.protocol}://${req.get("host")}/images/${fileName}`;

try{
    await Product.update(
        {name: name, image: fileName, url: url},
        {
            where: {
                id: req.params.id,
            },
        }
    );
    res.status(200).json({ msg: "Product Updated Successfuly"});
}catch (error){
    console.log(error.message);
}
};
export const deleteProduct = async(req,res)=>{
    const product = await Product.findOne({
        where: {

            id: req.params.id,
        },
    });
    if (!product) return res.status(404).json({ msg: "NOT found"});

    try{
        const filepath = `./public/images/${product.image}`;
        fs.unlinkSync(filepath);
        await product.destroy({
            where:{
                id: req.params.id,
            },
        });
        res.status(200).json({ msg: "Product Deleted"});
    }catch (error){
        console.log(error.message);
    }
};