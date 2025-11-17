import express from "express";
import { verifyToken } from "../middleware/verify-token.js";
import ClientController from "../controller/client-controller.js";

const router = express.Router();
const clientController = new ClientController();

router.post("/", verifyToken, clientController.createClient.bind(clientController));
router.get("/", verifyToken, clientController.getClients.bind(clientController));
router.get("/:id", verifyToken, clientController.getClientById.bind(clientController));
router.put("/:id", verifyToken, clientController.updateClient.bind(clientController));
router.delete("/:id", verifyToken, clientController.deleteClient.bind(clientController));

export default router;

