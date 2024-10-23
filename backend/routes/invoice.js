import express from 'express'
import { addInvoice, getInvoice, getStats } from '../controllers/invoice.js'

const router = express.Router()

router.get("/", getInvoice)
router.get("/stats", getStats)
router.post("/", addInvoice)


export default router

