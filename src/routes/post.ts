import { Router } from "express";
import postController from "../controllers/post-controller";

const router = Router();





// Get all posts
router.get("/", postController.listAll);   

// Like a post
router.post(
    "/like/:id([0-9]+)/:user_id([0-9]+)",
    postController.likePost
  );

// Add post
router.post("/new", postController.newPost);

router.get(
    "/:post_id([0-9]+)",
    postController.getOneById
  );

// disLike a post
router.post(
    "/dislike/:id([0-9]+)/:user_id([0-9]+)",
    postController.dislikePost
  );

// get all posts for one user

router.get("/find/:user_id([0-9]+)", postController.getPostsForUser);

// remove one post

router.delete("/remove/:post_id([0-9]+)", postController.deletePost)

export default router;