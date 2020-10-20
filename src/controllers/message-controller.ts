import { Request, Response } from "express";
import { getRepository } from "typeorm";

import { ConversationEntity } from "../entities/conversation-entity";
import { MessageEntity } from "../entities/message-entity";
import { UserEntity } from "../entities/user-entity";
 
class MessageController{

    static getLastMessageForConversation = async (req: Request, res: Response) => {
      //Get messages from database
      const conv_id = req.params.conv_id;
      const messageRepository = getRepository(MessageEntity);
      const conversationRepository = getRepository(ConversationEntity);
    
      let conversation: ConversationEntity;
      try { conversation = await conversationRepository.findOneOrFail(conv_id);} catch (error) { res.status(404).send("Conversation not found"); return }

      try{
      // select the last message based on message date
      const message = await messageRepository.find({relations: ['sender', 'reciever'],
                                                            where : {conversation : conversation},
                                                            order : {date: "DESC"},
                                                            take : 1
                                                            });
      res.send(message[0]);

      }
      catch(error)
      {
        res.status(404).send();
        return;
      }
      //Send the users object
    };

    static getMessageUsers = async (req: Request, res: Response) => {
      //Get the ID from the url
      const id = req.params.id;
      let message;
      let sender, reciever;
      //Get the message from database
      const messageRepository = getRepository(MessageEntity);
      try 
      {
        message = await messageRepository.findOneOrFail(id, {relations: ['sender', 'reciever']});
        sender = message.sender;
        reciever = message.reciever;
        res.send({sender, reciever});

      } catch (error) {
        res.status(404).send("message not found");
        return;
      }

    };

    static getConversation = async (req: Request, res: Response) => {
      //Get messages from database
      const sender_id = req.params.sender_id;
      const reciever_id = req.params.reciever_id;

      const messageRepository = getRepository(MessageEntity);
      const UserRepository = getRepository(UserEntity);
    
      let sender, reciever : UserEntity;
      let messages : MessageEntity[];
      try { 
        sender = await UserRepository.findOneOrFail(sender_id);
        reciever = await UserRepository.findOneOrFail(reciever_id);

        messages = await messageRepository.find({relations: ['sender', 'reciever'],
        where : [{sender : sender, reciever: reciever }, {sender : reciever, reciever: sender }],
        order : {date: "ASC"},
        });
     

      }
      catch(error)
      {
        res.status(404).send();
        return;
      }
    
      //Send the messages object
      res.send(messages);
    };


     static sendMessage = async (req: Request, res: Response) => {
      let {sender_id, reciever_id, content} = req.body; 

      const messageRepository = getRepository(MessageEntity);
      const UserRepository = getRepository(UserEntity);
      const ConversationRepository = getRepository(ConversationEntity);

      let conversation : ConversationEntity;
      let sender, reciever : UserEntity;

      try { 
        sender = await UserRepository.findOneOrFail(sender_id);
        reciever = await UserRepository.findOneOrFail(reciever_id);}
      catch(error)
      {
        // no such users found , abort
        res.status(404).send();
        return;
      }

      // users are found , find out if they already have a conversation
      try
      {
        conversation = await ConversationRepository.findOneOrFail({ 
        where : [{first_user : sender, second_user: reciever }, {first_user : reciever, second_user: sender }]})

        // conversation found ! insert the message
        let message = new MessageEntity();
        message.sender = sender;
        message.reciever = reciever;
        message.conversation = conversation;
        message.content = content;
        try 
        {
          await messageRepository.save(message);
        } catch (e) {res.status(409).send(); return; }

      }

      catch(error)
      {
        // no conversation was found , create one 
        let newConversation = new ConversationEntity();
        newConversation.first_user = sender;
        newConversation.second_user = reciever;
        try 
        {
          await ConversationRepository.save(newConversation);
          // and insert the message
          
          let message = new MessageEntity();
          message.sender = sender;
          message.reciever = reciever;
          message.conversation = newConversation;
          message.content = content;
          try 
          {
            await messageRepository.save(message);
          } catch (e) {res.status(409).send(); return; }

        } catch (e) {res.status(409).send(); return; }
      }
    
        //After all send a 204 (no content, but accepted) response
        res.status(204).send();
    };
}
    
export default MessageController;



