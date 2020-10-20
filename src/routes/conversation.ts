import { Router } from "express";
import ConversationController from "../controllers/conversation-controller";

const router = Router();


// Get all conversations for a specific user
router.get("/find/:user_id([0-9]+)", ConversationController.getConversationsForUser);  


export default router;