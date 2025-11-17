import express from "express";
import { verifyToken } from "../middleware/verify-token.js";
import ClientDocumentController from "../controller/client-document-controller.js";

const router = express.Router();
const clientDocumentController = new ClientDocumentController();

router.post("/clients/:clientId/documents", verifyToken, clientDocumentController.createDocument.bind(clientDocumentController));
router.get("/clients/:clientId/documents", verifyToken, clientDocumentController.getDocuments.bind(clientDocumentController));
router.get("/documents/:id", verifyToken, clientDocumentController.getDocumentById.bind(clientDocumentController));
router.put("/documents/:id", verifyToken, clientDocumentController.updateDocument.bind(clientDocumentController));
router.delete("/documents/:id", verifyToken, clientDocumentController.deleteDocument.bind(clientDocumentController));

export default router;

