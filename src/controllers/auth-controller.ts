import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import { UserEntity } from "../entities/user-entity";
import config from "../common/jwt-config";

class AuthController {
    static login = async (req: Request, res: Response) => {
      //Check if username and password are set
      let { username, password } = req.body;
      if (!(username && password)) {
        res.status(400).send();
      }
      //Get user from database
      const userRepository = getRepository(UserEntity);
      let user: UserEntity;
      try {
        user = await userRepository.findOneOrFail({ where: { username }, relations: ['followers', 'following'] });
      } catch (error) {
        res.status(404).send();
      }
  
      //Check if encrypted password match
      if (!user.checkIfUnencryptedPasswordIsValid(password)) {
        res.status(404).send();
        return;
      }
  
      //Sing JWT, valid for 1 hour
      const token = jwt.sign(
        { userId: user.user_id, username: user.username },
        config.jwtSecret,
        { expiresIn: "1h" }
      );
  
      //Send the jwt in the response
      res.send({user: user, token: token});
    };
  
    static changePassword = async (req: Request, res: Response) => {
     
      //Get parameters from the body
      const { user_id, oldPassword, newPassword } = req.body;
      if (!(oldPassword && newPassword)) {
        res.status(400).send();
      }
  
      //Get user from the database
      const userRepository = getRepository(UserEntity);
      let user: UserEntity;
      try {
        user = await userRepository.findOneOrFail(user_id);
      } catch (user_id) {
        res.status(401).send();
      }
  
      //Check if old password matchs
      if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
        res.status(401).send();
        return;
      }
  
      //Validate de model (password lenght)
      user.user_password = newPassword;
      const errors = await validate(user);
      if (errors.length > 0) {
        res.status(400).send(errors);
        return;
      }
      //Hash the new password and save
      user.hashPassword();
      userRepository.save(user);
  
      res.status(200).send(user);
    };
  }
  export default AuthController;