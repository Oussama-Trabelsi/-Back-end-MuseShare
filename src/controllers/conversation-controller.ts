import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { ConversationEntity } from "../entities/conversation-entity";
import { UserEntity } from "../entities/user-entity";
 
class ConversationController{

    static getConversationsForUser = async (req: Request, res: Response) => {
      //Get conversations from database
      const user_id = req.params.user_id;
      const userRepository = getRepository(UserEntity);
      const conversationRepository = getRepository(ConversationEntity);
    
      let user;
      try { user = await userRepository.findOneOrFail(user_id);} catch (error) { res.status(404).send("User not found"); return }

      try{
      let conversations = await conversationRepository.find({ relations: ['first_user', 'second_user', 'messages'],
                                                                where : [{first_user : user}, {second_user : user}]});
      res.send(conversations);

      }
      catch(error)
      {
        res.status(404).send();
        return;
      }                       
      //Send the conversations array
    };
 
}
    
export default ConversationController;