import { Router } from "express";
import MessageController from "../controllers/message-controller";

const router = Router();


// Get last message for a given conversation
router.get("/findlast/:conv_id([0-9]+)", MessageController.getLastMessageForConversation);  

// Get the sender and reciever of the message
router.get("/getUsers/:id([0-9]+)", MessageController.getMessageUsers);  

// Get messages for two users
router.get("/getConversation/:sender_id([0-9]+)/:reciever_id([0-9]+)", MessageController.getConversation); 

// Send a message
router.post("/sendMessage", MessageController.sendMessage);

export default router;