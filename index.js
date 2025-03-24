// const port = 4000;
// const express = require("express");
// const multer = require("multer");
// const path = require("path");
// const cors = require("cors");
// const fs = require("fs");
// const mongoose = require('mongoose');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');

// const app = express();

// // Middleware
// app.use(cors({
//   origin: "*", // Allow all origins
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true
// }));

// app.use(express.json());

// // MongoDB connection
// mongoose.connect("mongodb+srv://luxeloom:luxeloom12@cluster0.j37y4.mongodb.net/e-commerce")
//   .then(() => console.log("MongoDB Connected"))
//   .catch((err) => console.log("MongoDB Connection Error:", err));

// // Ensure upload directory exists
// const imageDir = path.join(__dirname, 'upload', 'images');
// fs.mkdirSync(imageDir, { recursive: true });

// // Multer setup for file uploads
// const storage = multer.diskStorage({
//   destination: imageDir,
//   filename: (req, file, cb) => cb(null, `Rs.${file.fieldname}_Rs.${Date.now()}Rs.${path.extname(file.originalname)}`)
// });
// const upload = multer({ storage });

// // Routes
// app.get("/", (req, res) => res.send("Server is running"));
// app.use('/images', express.static(imageDir));

// // Product Schema
// const Product = mongoose.model("Product", {
//   id: { type: Number, required: true },
//   name: { type: String, required: true },
//   image: { type: String, required: true },
//   category: { type: String, required: true },
//   new_price: { type: Number, required: true },
//   old_price: { type: Number, required: true },
//   date: { type: Date, default: Date.now },
//   available: { type: Boolean, default: true }
// });

// // Upload route for images
// app.post("/upload", upload.single('product'), (req, res) => {
//   if (!req.file) return res.status(400).json({ success: 0, message: "No file uploaded." });

//   res.json({
//     success: 1,
//     image_url: `http://localhost:${port}/images/Rs.${req.file.filename}`
//   });
// });

// // Route to add product details
// app.post('/addproduct', async (req, res) => {
//   try {
//     let lastProduct = await Product.findOne().sort({ id: -1 });
//     let id = lastProduct ? lastProduct.id + 1 : 1;

//     const product = new Product({
//       id: id,
//       name: req.body.name,
//       image: req.body.image, // Use uploaded image URL
//       category: req.body.category,
//       new_price: `Rs. ${Number(req.body.new_price)}`,
//       old_price: `Rs. ${Number(req.body.old_price)}`,
//     });

//     await product.save();
//     console.log("Product Saved:", product);

//     res.json({ success: true, name: req.body.name, id: id });

//   } catch (error) {
//     console.error("Error saving product:", error);
//     res.status(500).json({ success: false, message: "Failed to save product" });
//   }
// });

// // Route to delete product
// app.delete('/removeproduct/:productId', async (req, res) => {
//   try {
//     const productId = req.params.productId;
//     const deletedProduct = await Product.findByIdAndDelete(productId);
//     if (!deletedProduct) {
//       return res.status(404).json({ success: false, message: "Product not found" });
//     }

//     console.log("Removed:", deletedProduct);
//     res.json({ success: true, message: "Product deleted", name: deletedProduct.name });
//   } catch (error) {
//     console.error("Error deleting product:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// // Route to get all products
// app.get('/allproducts', async (req, res) => {
//   try {
//       const products = await Product.find(); // Fetch all products from MongoDB
//       res.json({ success: true, products });
//   } catch (error) {
//       console.error("Error fetching products:", error);
//       res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// // Route to update the product.
// app.put("/updateproduct/:id", async (req, res) => {
//   const { id } = req.params;
//   const updatedData = req.body;

//   try {
//     const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true });

//     if (!updatedProduct) {
//       return res.status(404).send("Product not found");
//     }

//     res.status(200).send("Product updated successfully!");
//   } catch (error) {
//     console.error("Error updating product:", error);
//     res.status(500).send("Error updating product");
//   }
// });

// // Schema for Users
// const Users = mongoose.model('Users', {
//   name: {
//     type: String,
//   },
//   email: {
//     type: String,
//     unique: true,
//   },
//   password: {
//     type: String,
//   },
//   cartData: {
//     type: Object,
//   },
//   date: {
//     type: Date,
//     default: Date.now,
//   }
// });

// // Creating endpoint for registering the user
// app.post('/signup', async (req, res) => {
//   try {
//     // Check if email is provided
//     if (!req.body.email) {
//       return res.status(400).json({ success: false, errors: "Email is required" });
//     }

//     // Check if the email already exists
//     let check = await Users.findOne({ email: req.body.email.toLowerCase() });
//     if (check) {
//       return res.status(400).json({ success: false, errors: "Existing user found with the same email address" });
//     }

//     // Hash the password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(req.body.password, salt);

//     // Initialize cart data
//     let cart = {};
//     for (let i = 0; i < 300; i++) {
//       cart[i] = 0;
//     }

//     // Create the user with hashed password
//     const user = new Users({
//       name: req.body.username,
//       email: req.body.email.toLowerCase(), // Convert to lowercase before saving
//       password: hashedPassword,
//       cartData: cart,
//     });

//     // Save the user to the database
//     await user.save();

//     // Prepare data for the JWT token
//     const data = {
//       user: {
//         id: user.id,
//       },
//     };

//     // Create JWT token
//     const token = jwt.sign(data, process.env.JWT_SECRET || 'secret_ecom', { expiresIn: '1h' });

//     // Respond with success and token
//     res.json({ success: true, token });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, errors: "Server error" });
//   }
// });

// // Creating endpoint for user login
// app.post('/login', async (req, res) => {
//   try {
//     // Find the user by email
//     let user = await Users.findOne({ email: req.body.email });

//     if (user) {
//       // Compare the hashed password with the plain text password
//       const passCompare = await bcrypt.compare(req.body.password, user.password);

//       if (passCompare) {
//         const data = {
//           user: {
//             id: user.id
//           }
//         };

//         const token = jwt.sign(data, 'secret_ecom');
//         res.json({ success: true, token });
//       } else {
//         res.json({ success: false, errors: "Wrong Password" });
//       }
//     } else {
//       res.json({ success: false, errors: "Wrong Email Id" });
//     }
//   } catch (error) {
//     console.error("Error during login:", error);
//     res.status(500).json({ success: false, errors: "Server error" });
//   }
// });

// // Creating endpoint for new arrival data
// app.get('/newarrival', async (req, res) => {
//   let products = await Product.find({});
//   let newarrival = products.slice(1).slice(-4);
//   console.log("NewArrival Fetched");
//   res.send(newarrival);
// });

// // Start the server
// app.listen(port, () => console.log(`Server running on port ${port}`));


const port = 4000;
const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();

// Middleware
app.use(cors({
  origin: "*", // Allow all origins
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb+srv://luxeloom:luxeloom12@cluster0.j37y4.mongodb.net/e-commerce")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

// Ensure upload directory exists
const imageDir = path.join(__dirname, 'upload', 'images');
fs.mkdirSync(imageDir, { recursive: true });

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: imageDir,
  filename: (req, file, cb) => cb(null, `Rs.${file.fieldname}_Rs.${Date.now()}Rs.${path.extname(file.originalname)}`)
});
const upload = multer({ storage });

// Routes
app.get("/", (req, res) => res.send("Server is running"));
app.use('/images', express.static(imageDir));

// Product Schema
const Product = mongoose.model("Product", {
  id: { type: Number, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  new_price: { type: Number, required: true },
  old_price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true }
});

// Upload route for images
app.post("/upload", upload.single('product'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded." });
  }

  res.json({
    success: true,
    image_url: `http://localhost:${port}/images/${req.file.filename}`  // Ensure this URL is correct
  });
});

// Route to add product details
app.post('/addproduct', async (req, res) => {
  try {
    // Validate product data
    const { name, category, new_price, old_price, image } = req.body;
    if (!name || !category || !new_price || !old_price || !image) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    let lastProduct = await Product.findOne().sort({ id: -1 });
    let id = lastProduct ? lastProduct.id + 1 : 1;

    const product = new Product({
      id: id,
      name: name,
      image: image,
      category: category,
      new_price: Number(new_price),
      old_price: Number(old_price),
    });

    await product.save();
    console.log("Product Saved:", product);

    res.json({ success: true, message: "Product added successfully", id: id });

  } catch (error) {
    console.error("Error saving product:", error);
    res.status(500).json({ success: false, message: "Failed to save product" });
  }
});

// Route to delete product
app.delete('/removeproduct/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    console.log("Removed:", deletedProduct);
    res.json({ success: true, message: "Product deleted", name: deletedProduct.name });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Route to get all products
app.get('/allproducts', async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products from MongoDB
    res.json({ success: true, products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Route to update the product.
app.put("/updateproduct/:id", async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedProduct) {
      return res.status(404).send("Product not found");
    }

    res.status(200).send("Product updated successfully!");
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send("Error updating product");
  }
});

// Schema for Users
const Users = mongoose.model('Users', {
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  cartData: { type: Object },
  date: { type: Date, default: Date.now }
});

// Endpoint for registering the user
app.post('/signup', async (req, res) => {
  try {
    // Check if email is provided
    if (!req.body.email) {
      return res.status(400).json({ success: false, errors: "Email is required" });
    }

    // Check if the email already exists
    let check = await Users.findOne({ email: req.body.email.toLowerCase() });
    if (check) {
      return res.status(400).json({ success: false, errors: "Existing user found with the same email address" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Initialize cart data
    let cart = {};
    for (let i = 0; i < 300; i++) {
      cart[i] = 0;
    }

    // Create the user with hashed password
    const user = new Users({
      name: req.body.username,
      email: req.body.email.toLowerCase(),
      password: hashedPassword,
      cartData: cart,
    });

    // Save the user to the database
    await user.save();

    // Prepare data for the JWT token
    const data = { user: { id: user.id } };

    // Create JWT token
    const token = jwt.sign(data, process.env.JWT_SECRET || 'secret_ecom', { expiresIn: '1h' });

    // Respond with success and token
    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, errors: "Server error" });
  }
});

// Endpoint for user login
app.post('/login', async (req, res) => {
  try {
    // Find the user by email
    let user = await Users.findOne({ email: req.body.email });

    if (user) {
      // Compare the hashed password with the plain text password
      const passCompare = await bcrypt.compare(req.body.password, user.password);

      if (passCompare) {
        const data = { user: { id: user.id } };
        const token = jwt.sign(data, 'secret_ecom');
        res.json({ success: true, token });
      } else {
        res.json({ success: false, errors: "Wrong Password" });
      }
    } else {
      res.json({ success: false, errors: "Wrong Email Id" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ success: false, errors: "Server error" });
  }
});

// Endpoint for new arrival data
app.get('/newarrival', async (req, res) => {
  try {
    let products = await Product.find({});
    let newarrival = products.slice(1).slice(-4);
    console.log("NewArrival Fetched");
    res.send(newarrival);
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Start the server
app.listen(port, () => console.log(`Server running on port ${port}`));
