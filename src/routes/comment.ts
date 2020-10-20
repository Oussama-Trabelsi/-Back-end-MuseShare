import { Router } from "express";
import commentController from "../controllers/comment-controller";

const router = Router();





// Get all comments
router.get("/", commentController.listAll);   

// Get all comments for a specific post
router.get("/find/:post_id([0-9]+)", commentController.getPostComments);  

// add comment
router.post("/",commentController.addComment);

// remove a comment
router.delete("/delete/:comment_id([0-9]+)", commentController.removeComment)

// Like a comment
router.post("/like/:id([0-9]+)/:user_id([0-9]+)", commentController.likeComment);


// disLike a comment
router.post("/dislike/:id([0-9]+)/:user_id([0-9]+)", commentController.dislikeComment);

export default router;