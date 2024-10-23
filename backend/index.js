import express from 'express';
import mysql from 'mysql2';
import bodyParser from 'body-parser'
import db from './connect.js'
import cors from 'cors'
import dotenv from 'dotenv'
const app = express()

app.use(cors());
dotenv.config()


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

import invoiceRoutes from './routes/invoice.js'
import productRoutes from './routes/products.js'

app.use("/api/invoice", invoiceRoutes)
app.use("/api/products", productRoutes)

app.listen(8800, () => {
    console.log("connected to database!")
})

app.use(cors({
    origin: process.env.URL_FRONTEND,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));