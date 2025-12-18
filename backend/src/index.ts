import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { userSchemaModel } from "./db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cloudinary from "./cloudinary.js";
import upload from "./multer.js";

dotenv.config();
const app = express();



app.use(express.json());

app.use(cors());

const connectMB = async () => {
    await mongoose.connect("mongodb://localhost:27017/insurance")
    console.log("Database connected...");
}
connectMB();

app.post("/api/auth/signup", async (req, res) => {

    const name = req.body.name;
    const email = req.body.email;
    const role = req.body.role;
    const password = req.body.password;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Please provide name, email, and password." });
    }

    const userExist = await userSchemaModel.findOne({
        email: email,
    })
    if (!userExist) {
        try {
            const hashedPassword = await bcrypt.hash(password, 4);
            await userSchemaModel.create({
                name: name,
                email: email,
                role: role,
                password: hashedPassword
            })
            res.json({
                message: "Signup sucessfull..!"
            })

        } catch (error) {
            res.json({
                error:error,
            })
        }
    } else {
        res.json({
            message: "User already exist..!"
        })
        console.log("user already exist");
    }



})
app.post("/api/auth/signin", async (req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    const userExist = await userSchemaModel.findOne({
        email,
    })

    if (userExist) {
        try {
            const passwordMatch = await bcrypt.compare(password, userExist.password as string);
            if (passwordMatch) {
                const userId = userExist._id.toString();      
                const token = jwt.sign(
                    {
                        id: userId,
                       
                        email: userExist.email
                    },
                    process.env.JWT_SECRET as string, 
                    {
                        expiresIn: '7d' 
                    }
                );  
                return res.status(200).json({
                    message: "Login successful",
                    token: token,
                    userId: userId, 
                    role: userExist.role,
                    name:userExist.name,
                    email:userExist.email,
                });
            } else {         
                return res.status(401).json({ message: "Invalid credentials." });
            }
        } catch (error) {
            console.log(error);
            res.json({
                error:error,
            })
        }
    }else{
        console.log("user doont exist");
        res.json({
            message:"user dont exist"
        })
    }
})


app.post(
  "/api/upload/vehicle-photo",
  upload.single("file"),
  async (req, res) => {
    try {
      console.log("Backend hit");

      if (!req.file) {
        return res.status(400).json({ message: "No file provided" });
      }

      const field = req.body.field;
      if (!field) {
        return res.status(400).json({ message: "Field name missing" });
      }

      const result = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: `claims/vehicle-photos/${field}`,
              resource_type: "image",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(req?.file?.buffer); // ✅ binary buffer
      });

      return res.status(200).json({
        url: result.secure_url,
        publicId: result.public_id,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Upload failed" });
    }
  }
);

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log("server running on port - 3000")
})




