import express from "express";
import { verifyToken } from "../middleware/verify-token.js";
import ClientNoteController from "../controller/client-note-controller.js";

const router = express.Router();
const clientNoteController = new ClientNoteController();

router.post("/clients/:clientId/notes", verifyToken, clientNoteController.createNote.bind(clientNoteController));
router.get("/clients/:clientId/notes", verifyToken, clientNoteController.getNotes.bind(clientNoteController));
router.get("/notes/:id", verifyToken, clientNoteController.getNoteById.bind(clientNoteController));
router.put("/notes/:id", verifyToken, clientNoteController.updateNote.bind(clientNoteController));
router.delete("/notes/:id", verifyToken, clientNoteController.deleteNote.bind(clientNoteController));

export default router;

