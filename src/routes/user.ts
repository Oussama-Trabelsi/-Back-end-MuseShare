import { Router } from "express";
import userController from "../controllers/user-controller";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";

const router = Router();
// to check role and jwt : [checkJwt, checkRole(["ADMIN"])],


// Follow another user
router.post(
  "/follow/:id([0-9]+)/:follow_id([0-9]+)",
  userController.followUser
);

// Unfollow another user
router.delete(
  "/unfollow/:id([0-9]+)/:follow_id([0-9]+)",
  userController.unfollowUser
);

//Get all users
router.get("/", userController.listAll);   

router.get("/search/:param", userController.findUserLike);

// Get one user
router.get(
  "/:id([0-9]+)",
  userController.getOneById
);


// Get followers and following
router.get(
  "/getFollows/:user_id([0-9]+)",
  userController.getFollowersAndFollowing
);

//Create a new user
router.post("/", userController.newUser);

//Edit one user
router.patch(
  "/:id([0-9]+)/:private",
  userController.editUser
);


router.patch(
  "/updatePhoto/:id([0-9]+)/:ImageUrl",
  userController.updateImageUrl
);

//Delete one user
router.delete(
  "/:id([0-9]+)",
  userController.deleteUser
);

//Set online
router.patch("/setOnline", userController.setOnline);

//Set last login
router.patch("/setLastLogin", userController.setLastLogin);
export default router;