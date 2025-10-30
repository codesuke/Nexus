import express from "express";
import {
  createDemoPaymentIntent,
  createTransaction,
  listTransactions,
} from "../controllers/transactionController";

const router = express.Router();

router.get("/", listTransactions);
router.post("/", createTransaction);
router.post("/payment-intent", createDemoPaymentIntent);

export default router;
