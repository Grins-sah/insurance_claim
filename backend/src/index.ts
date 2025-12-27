import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { fileModel, userSchemaModel } from "./db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cloudinary from "./cloudinary.js";
import upload from "./multer.js";
import { userMiddleware } from "./middleware.js";

dotenv.config();
const app = express();



app.use(express.json());

app.use(cors());

const connectMB = async () => {
    const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/insurance";
    await mongoose.connect(mongoUrl)
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


app.post("/api/upload/vehicle-photo",
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
      const resp = (await fileModel.create({
       // @ts-ignore
        userId: req.userId ,
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        data: req.file.buffer

      }))._id;
      return res.status(200).json({
        _id:resp,
        url: result.secure_url,
        publicId: result.public_id,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Upload failed" });
    }
  }
);

const fileSchema = new mongoose.Schema({
    filename: String,
    contentType: String,
    data: Buffer,
    uploadDate: { type: Date, default: Date.now }
});

const FileModel =  mongoose.model('upload', fileSchema);

app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        const newFile = new FileModel({
            filename: req.file.originalname,
            contentType: req.file.mimetype,
            data: req.file.buffer
        });

        await newFile.save();

        res.status(201).send({ message: 'File uploaded successfully', fileId: newFile._id });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error uploading file');
    }
});



const PYTHON_API_URL = process.env.PYTHON_API_URL || "http://localhost:8000";

// Proxy Routes

// Vehicle Detection
app.post("/api/vehicle/detect", async (req, res) => {
    try {
        const { object_id } = req.body;
        const response = await fetch(`${PYTHON_API_URL}/vehicle/detect_vehicle`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ object_id })
        });
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        console.error("Proxy error:", error);
        res.status(500).json({ error: "Error connecting to Python service" });
    }
});

// Vehicle Orientation
app.post("/api/vehicle/orientation", async (req, res) => {
    try {
        const { object_id } = req.body;
        const response = await fetch(`${PYTHON_API_URL}/vehicle/orientation_detection`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ object_id })
        });
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        console.error("Proxy error:", error);
        res.status(500).json({ error: "Error connecting to Python service" });
    }
});

// Vehicle Anomaly
app.post("/api/vehicle/anomaly", async (req, res) => {
    try {
        const { object_id } = req.body;
        const response = await fetch(`${PYTHON_API_URL}/vehicle/vehicle/anomaly-detection`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ object_id })
        });
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        console.error("Proxy error:", error);
        res.status(500).json({ error: "Error connecting to Python service" });
    }
});

// Vehicle Claim Workflow
app.post("/api/vehicle/claim-workflow", async (req, res) => {
    try {
        const { image_ids, policy_id, user_description } = req.body;
        const response = await fetch(`${PYTHON_API_URL}/vehicle/process_claim_workflow`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image_ids, policy_id, user_description })
        });
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        console.error("Proxy error:", error);
        res.status(500).json({ error: "Error connecting to Python service" });
    }
});

// Health Medical Bill
app.post("/api/health/medical-bill", async (req, res) => {
    try {
        const { object_id } = req.body;
        const response = await fetch(`${PYTHON_API_URL}/health/process_medical_bill`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ object_id })
        });
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        console.error("Proxy error:", error);
        res.status(500).json({ error: "Error connecting to Python service" });
    }
});

// Health Prescription
app.post("/api/health/prescription", async (req, res) => {
    try {
        const { object_id } = req.body;
        const response = await fetch(`${PYTHON_API_URL}/health/process_prescription`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ object_id })
        });
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        console.error("Proxy error:", error);
        res.status(500).json({ error: "Error connecting to Python service" });
    }
});

// Health Validate Claim
app.post("/api/health/validate-claim", async (req, res) => {
    try {
        const { object_ids, query, medical_bill_ids, prescription_ids } = req.body;
        const response = await fetch(`${PYTHON_API_URL}/health/validate_claim`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ object_ids, query, medical_bill_ids, prescription_ids })
        });
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        console.error("Proxy error:", error);
        res.status(500).json({ error: "Error connecting to Python service" });
    }
});

// RAG Process
app.post("/api/rag/process/:object_id", async (req, res) => {
    try {
        const { object_id } = req.params;
        const response = await fetch(`${PYTHON_API_URL}/rag/process/${object_id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        });
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        console.error("Proxy error:", error);
        res.status(500).json({ error: "Error connecting to Python service" });
    }
});

const PORT =8080;
app.listen(PORT,()=>{
    console.log("server running on port - 8080")
})




