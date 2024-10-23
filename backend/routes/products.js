import express from 'express'
import { getProducts, searchProducts } from '../controllers/products.js'

const router = express.Router()

router.get("/", getProducts)
router.get("/search", searchProducts)


export default router