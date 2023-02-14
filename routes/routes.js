const express = require('express'); 
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Review = require('../models/Review');
const Wishlist = require('../models/Wishlist');
const Contact = require('../models/Contact');
const sendMail = require('../sendMail'); 
const { v4: uuidv4 } = require('uuid'); 
const path = require('path');
const sendLoginMail = require('../sendLoginMail'); 
const cloudinary = require("cloudinary").v2;
const auth = require('../auth');
const adminAuth = require('../adminAuth'); 
const Razorpay = require('razorpay');
require('dotenv').config({})

var instance = new Razorpay({ key_id: process.env.key_id, key_secret: process.env.key_secret });

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
});


router.post('/razorpayorder', function (req, res) {
    //console.log(req.body.data)

    var options = {
        amount: req.body.amount,  // amount in the smallest currency unit
        currency: "INR",
        receipt: "order_rcptid_11"
    };

    

    instance.orders.create(options, function (err, order) {
        console.log(order);
        res.status(200).json({ order })
    });



})


router.post('/register', async (req, res) => {
    try {
        console.log(req.body)
        if (req.body.email == '' || req.body.name == '') {
            return res.status(200).json({ "msg": "some error occurred"})
        }

        const user =  await new User({ name: req.body.name, email: req.body.email, rid: uuidv4() });
        await user.save()
        //console.log(user.name, req.session.id);

        const options = {
            name: user.name,
            email: user.email,
            uid: user.rid,
            subject: 'Digital Shop Account Verification'
        }

        sendMail(options)

        res.status(200).json({ "msg": "Verification email has been sent. Please check your inbox and verify your email to complete registration", user })


    } catch (e) {
        console.log(e)
    }

})


router.post('/login', async (req, res) => {
    try {
        const userExists = await User.findOne({ email: req.body.email });
        if (!userExists) {
            return res.status(200).json({ "msg": "account does not exist"})
        }


        userExists.lid = uuidv4();
        await userExists.save()
        console.log(userExists.lid);

        const options = {
            name: userExists.name,
            email: userExists.email,
            lid: userExists.lid,
            subject: 'Here is your Vikalp Passcode'
        }

        sendLoginMail(options)

        res.status(200).json({ "msg": "Passcode has been sent to your mail. Please use that to login", userExists })
    } catch (e) {
        console.log(e)
    }

})


router.get('/accountverification', async function (req, res) {
    try {
        
        await res.sendFile(path.join(__dirname, '../public/verifycode.html'));

    } catch (e) {
        console.log(e)
    }
})

router.get('/passwordverification', async function (req, res) {
    try {

        await res.sendFile(path.join(__dirname, '../public/passcode.html'));

    } catch (e) {
        console.log(e)
    }
})


router.post('/accountverification', async function (req, res) {
    try {
        const user = await User.findOne({ rid: req.body.code });
        if (user) {
            console.log(user._id.toString())
            req.session.userId = user._id.toString();
            
            console.log(req.session.userId.toString())
            
            user.verify = true; // should use this flag in the auth system or somewhere maybe? otherwise it's a waste of a flag
            await user.save();
            res.json({ "msg": "verification successful, please login to continue" })
        } else {
            res.json({ "msg": "verification unsuccessful, please check your verifiction code" })
        }
    } catch (e) {
        console.log(e)
    }
})

router.post('/passwordverification', async function (req, res) {
    try {
        console.log(req.body.code)
        const user = await User.findOne({ lid: req.body.code });
        if (user) {
            req.session.userId = user._id.toString();
            req.session.userRole = user.role;
            console.log(req.session.userId)
            console.log(req.session.userRole)
            user.lid = '';
            await user.save();
            res.json({ "msg": "login successful, you can now access the site", user })
        } else {
            res.json({ "msg": "login failed, please check your passcode" })
        }
    } catch (e) {
        console.log(e)
    }
})






router.get('/products', async function (req, res) {
    /*
    try {
        const products = await Product.find({}); 
        res.send(products)
    } catch (e) {
        console.log(e)
    }
    */

    const keyWord = req.query.keyWord;

    if (keyWord) {
        const searchItem = keyWord
            ? { name: { $regex: keyWord, $options: "i" } }
            : {};

        const searchProduct = await Product.find(searchItem);

        res.status(200).json({
            "status": "success",
            "data": { results: searchProduct, count: searchProduct.length },
        });
    } else {
        const products = await Product.find({});
        //res.status(200).send({ status: "success", data: res.advanceResults }); // find out what advanceResults is?.....
        res.send(products)
    }
})

router.get('/products/:id', async function (req, res) {
    try {
        const product = await Product.find({ _id: req.params.id })
        res.status(200).json({"msg": "success", product})
    } catch (e) {
        console.log(e)
    }
})

router.post('/order', async function (req, res) {
    try {
        const newOrder = await Order.create({
            ...req.body,
            userId: req.body.userId,
        });

        res
            .status(201)
            .send({ status: "success", message: "New Order Created", data: newOrder });
    } catch (e) {
        console.log(e)
    }
})

router.get('/orders/:id', async function (req, res) {
    try {
        const Orders = await Order.find({userId: req.params.id});
        res.status(200).json({ "orders_list": Orders})
    } catch (e) {
        console.log(e)
    }
})

router.get('/logincheck', auth, async function (req, res) {
    try {
        await res.status(200).json({ "msg": "session contains user object, allow user to login" }); 
    } catch (e) {
        console.log(e)
        await res.status(500).json({ "msg": "user not logged in" });
    }
})

router.get('/cart', async function (req, res) {
    try {
        await res.sendFile(path.join(__dirname, '../public/cart.html'));
    } catch (e) {
        console.log(e)
    }
})

router.get('/logout', async function (req, res) {
    try {
        await req.session.destroy(); 
    } catch (e) {
        console.log(e)
    }
})

router.post('/review', async function (req, res) {
    try {
        console.log(req.body)
        const reviews = await Review.find({ productId: req.body.productId })
        //console.log(reviews);
        let reviewExists = reviews.filter((r) => {
            if (r.userId == req.body.userId) {
                //console.log('match found')
                return r;
            }
        })
        console.log(reviewExists)
        if (reviewExists.length !== 0) {
            res.status(403).json({ "msg": "cannot add more than 1 review for same product" })
        } else {
            const review = new Review({
                review: req.body.review,
                productId: req.body.productId,
                userId: req.body.userId,
            })
            await review.save();
            res.status(200).json({ "msg": "review posted", review })
        }


    } catch (e) {
        console.log(e)
    }
})

router.post('/getreview', async function (req, res) {
    try {
        console.log(req.body.reviewId)
        const reviews = await Review.find({ productId: req.body.reviewId})
        //res.status(200).json({"msg": "reviews fetched", reviews})
        res.send(reviews)
    } catch (e) {
        console.log(e)
    }

})


router.post('/wishlist', async function (req, res) {
    try {
        const wishlist = new Wishlist(req.body); 
        await wishlist.save();
        res.status(200).json({ "msg": "wishlist item posted successfully", wishlist })
    } catch (e) {
        console.log(e)
    }
})

router.post('/getwishlist', async function (req, res) {
    try {
        const wishlist = await Wishlist.find({ userId: req.body.userId })
        res.status(200).json({ "msg": "user wishlist fetched successfully", wishlist })
    } catch (e) {
        console.log(e)
    }
})

router.delete('/wishlist/:id', async function (req, res) {
    try {
        const deletedItem = await Wishlist.deleteMany({userId: req.params.id })
        res.status(200).json({ "msg": "wishlist item deleted successfully", deletedItem })
    } catch (e) {
        console.log(e)
    }
})

router.get('/addproduct', auth, async function (req, res) { // should ensure only user with admin role gets to access this page...
    try {
        await res.sendFile(path.join(__dirname, '../public/add_product.html'));
    } catch (e) {
        console.log(e)
    }
})

router.post('/addproduct', adminAuth, async function (req, res) {
    try {
        console.log(process.env.API_KEY)
        console.log(req.files)
        console.log(req.body)
        const file = req.files.productImage;

        //Check file type
        if (!file.mimetype.startsWith("image"))
            console.log("This file is not supported");

        //Check file size
        if (file.size > process.env.FILE_UPLOAD_SIZE)
            console.log(`Please upload a image of size less than ${process.env.FILE_UPLOAD_SIZE}`);


        cloudinary.uploader.upload(
            file.tempFilePath,
            { use_filename: true, folder: "items" },
            async function (error, result) {
                if (error) throw createError(409, `failed to create product`);
                const product = await Product.create({
                    ...req.body,
                    productImage: result.url,
                });
                res.status(200).send({ status: "success", data: product });
            }
        );


    } catch (e) {
        console.log(e)
    }
})

router.post('/contacts-query', async function (req, res) {
    try {
        console.log(req.body)
        const contactQuery = new Contact(req.body);
        await contactQuery.save();
        res.status(200).json({ "msg": "query submitted successfully", contactQuery });
    } catch (e) {
        console.log(e)
    }
})


router.get('/contacts-queries', async function (req, res) {
    try {
        const queries = await Contact.find({}); 
        res.status(200).json({"msg": "queries fetched successfully", queries})
    } catch (e) {
        console.log(e)
    }
})








module.exports = router; 
