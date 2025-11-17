import express from "express";
import { verifyToken } from "../middleware/verify-token.js";
import FinancialRecordController from "../controller/financial-record-controller.js";

const router = express.Router();
const financialRecordController = new FinancialRecordController();

router.post("/clients/:clientId/financial-records", verifyToken, financialRecordController.createRecord.bind(financialRecordController));
router.get("/clients/:clientId/financial-records", verifyToken, financialRecordController.getRecords.bind(financialRecordController));
router.get("/financial-records/:id", verifyToken, financialRecordController.getRecordById.bind(financialRecordController));
router.put("/financial-records/:id", verifyToken, financialRecordController.updateRecord.bind(financialRecordController));
router.delete("/financial-records/:id", verifyToken, financialRecordController.deleteRecord.bind(financialRecordController));

export default router;

