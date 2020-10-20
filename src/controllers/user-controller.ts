import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import { UserEntity } from "../entities/user-entity";
 
class UserController{

    static listAll = async (req: Request, res: Response) => {
      //Get users from database
      const userRepository = getRepository(UserEntity);
      const users = await userRepository.find();
    
      //Send the users object
      res.send(users);
    };
    
    static getOneById = async (req: Request, res: Response) => {
      //Get the ID from the url
      const id: number = parseInt(req.params.id);
      let user = new UserEntity();
      //Get the user from database
      const userRepository = getRepository(UserEntity);
      try {
        user = await userRepository.findOneOrFail(id, {relations: ['followers', 'following']});
      } catch (error) {
        res.status(404).send("User not found");
      }
      res.send(user);

    };
    
    static newUser = async (req: Request, res: Response) => {
      //Get parameters from the body

      let { username, firstname, lastname, password, email } = req.body;
      let user = new UserEntity();
      user.username = username;
      user.user_password = password;
      user.user_email = email;
      user.user_firstName = firstname;
      user.user_lastName = lastname;
    
      //Validade if the parameters are ok
      const errors = await validate(user);
      if (errors.length > 0) {
        res.status(400).send(errors);
        return;
      }
    
      //Try to save. If fails, the username is already in use
      const userRepository = getRepository(UserEntity);
      try {
        await userRepository.save(user);
      } catch (e) {
        res.status(409).send(e);
        return;
      }
    
      //If all ok, send 201 response
      res.status(201).send();
    };
    
    static editUser = async (req: Request, res: Response) => {
      //Get the ID from the url
      const id = req.params.id;
      const isPrivate =  (req.params.private === undefined || req.params.private.toLowerCase() === 'false' ? false : true)
      //Get values from the body
      const { username, user_firstName, user_lastName, email, user_bio } = req.body;
    
      //Try to find user on database
      const userRepository = getRepository(UserEntity);
      let user;
      try {
        user = await userRepository.findOneOrFail(id);
      } catch (error) {
        //If not found, send a 404 response
        res.status(404).send("User not found");
        return;
      }
    
      //Validate the new values on model
      user.username = username;
      user.user_firstName = user_firstName;
      user.user_lastName = user_lastName;
      user.user_email = email;
      user.user_bio = user_bio;
      user.isPrivate = isPrivate;
      const errors = await validate(user);
      if (errors.length > 0) {
        res.status(400).send(errors);
        return;
      }
    
      //Try to save, if fails, that means username already in use
      try {
        await userRepository.save(user);
      } catch (e) {
        res.status(409).send("username already in use");
        return;
      }
      //After all send a 204 (no content, but accepted) response
      res.status(204).send();
    };
    
    static deleteUser = async (req: Request, res: Response) => {
      //Get the ID from the url
      const id = req.params.id;
    
      const userRepository = getRepository(UserEntity);
      let user: UserEntity;
      try {
        user = await userRepository.findOneOrFail(id);
      } catch (error) {
        res.status(404).send("User not found");
        return;
      }
      userRepository.delete(id);
    
      //After all send a 204 (no content, but accepted) response
      res.status(204).send();
    };

    static findUserLike = async (req: Request, res: Response) => {
      const param = req.params.param;
      //Get users from database
      const userRepository = getRepository(UserEntity);
      try {
      const users = await userRepository.createQueryBuilder("user")
      .where("user.user_firstName like :name or user.user_lastName like :name or user.username like :name", {name: '%' + param + '%' })
      .getMany();

      res.send(users);


      } catch (e) {
      res.status(404).send();
      return;
    }
      //Send the users object
    };


    static followUser = async (req: Request, res: Response) => {
      //Get the ID from the url
      const id = req.params.id;
      const follow_id = req.params.follow_id;
    
      //Try to find user on database
      const userRepository = getRepository(UserEntity);
      let user;
      let followed_user;
      try {
        user = await userRepository.findOneOrFail(id, {
          relations: ['followers', 'following']
          });
        followed_user = await userRepository.findOneOrFail(follow_id, {
          relations: ['followers', 'following']
          });
      } catch (error) {
        //If not found, send a 404 response
        res.status(404).send("User not found");
        return;
      }

      followed_user.followers.push(user);
    
      try {
        await userRepository.save(followed_user);
      } catch (e) {
        res.status(409).send(e);
        return;
      }
      //After all send a 204 (no content, but accepted) response
      res.status(204).send();
    };

    static unfollowUser = async (req: Request, res: Response) => {
      //Get the ID from the url
      const id = req.params.id;
      const follow_id = req.params.follow_id;
    
      //Try to find user on database
      const userRepository = getRepository(UserEntity);
      let user: UserEntity;
      let followed_user: UserEntity;
      try {
        user = await userRepository.findOneOrFail(id, {
          relations: ['followers', 'following']
          });
        followed_user = await userRepository.findOneOrFail(follow_id, {
          relations: ['followers', 'following']
          });
      } catch (error) {
        //If not found, send a 404 response
        res.status(404).send("User not found");
        return;
      }

      const pending_delete : UserEntity  = user.following.find(e => e.user_id === followed_user.user_id); 
      user.following.splice(user.following.indexOf(pending_delete), 1);

      const pending_delete_followed : UserEntity = followed_user.followers.find(e => e.user_id == user.user_id );
      followed_user.followers.splice(followed_user.followers.indexOf(pending_delete_followed), 1);

        try {
          await userRepository.save(user);
          await userRepository.save(followed_user);

        } catch (e) {
          res.status(404).send();
          return;
        }
        //After all send a 204 (no content, but accepted) response
        res.status(204).send();
    };

    static updateImageUrl = async (req: Request, res: Response) => {
      //Get the ID from the url
      const id = req.params.id;
      const ImageUrl = req.params.ImageUrl;
    
      //Try to find user on database
      const userRepository = getRepository(UserEntity);
      let user;
      try {
        user = await userRepository.findOneOrFail(id);
      } catch (error) {
        //If not found, send a 404 response
        res.status(404).send("User not found");
        return;
      }
    
      user.profileImgUrl = ImageUrl;
      //Try to save, if fails, that means username already in use
      try {
        await userRepository.save(user);
      } catch (e) {
        res.status(404).send();
        return;
      }
      //After all send a 204 (no content, but accepted) response
      res.status(204).send();
    };


    static getFollowersAndFollowing = async (req: Request, res: Response) => {
      //Check if username and password are set
      let user_id = req.params.user_id;
      
      //Get user from database
      const userRepository = getRepository(UserEntity);
      let user: UserEntity;
      try {
        user = await userRepository.findOneOrFail({ where: { user_id: user_id }, relations: ['followers', 'following'] });
      } catch (error) {
        res.status(404).send();
      }
  
     
      //Send the jwt in the response
      res.send({followers: user.followers, following: user.following});
    };

    static setOnline = async (req: Request, res: Response) => {
      //Get the ID from the url
      let {id, value} =  req.body;
    
      //Try to find user on database
      const userRepository = getRepository(UserEntity);
      let user;
      try {
        user = await userRepository.findOneOrFail(id);
      } catch (error) {
        //If not found, send a 404 response
        res.status(404).send("User not found");
        return;
      }

      user.isOnline = value;
      //Try to save, if fails, that means username already in use
      try {
        await userRepository.save(user);
      } catch (e) {
        res.status(404).send();
        return;
      }
      //After all send a 204 (no content, but accepted) response
      res.status(204).send();
    };
    

    static setLastLogin = async (req: Request, res: Response) => {
      //Get the ID from the url
      let {id, value} =  req.body;
    
      //Try to find user on database
      const userRepository = getRepository(UserEntity);
      let user;
      try {
        user = await userRepository.findOneOrFail(id);
      } catch (error) {
        //If not found, send a 404 response
        res.status(404).send("User not found");
        return;
      }

      user.last_login = value;
      //Try to save, if fails, that means username already in use
      try {
        await userRepository.save(user);
      } catch (e) {
        res.status(404).send();
        return;
      }
      //After all send a 204 (no content, but accepted) response
      res.status(204).send();
    };
    
    
}
    
export default UserController;