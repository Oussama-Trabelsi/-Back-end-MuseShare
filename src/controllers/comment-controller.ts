import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { PostEntity } from "../entities/post-entity";
import { UserEntity } from "../entities/user-entity";
import { CommentEntity } from "../entities/comment-entity";

class CommentController{

    static listAll = async (req: Request, res: Response) => {
      //Get comments from database
      const commentRepository = getRepository(CommentEntity);
      const comments = await commentRepository.find({ relations: ['likes', 'user', 'post'] });
    
      //Send the comments object
      res.send(comments);
    };

    static removeComment = async (req: Request, res: Response) => {
        const comment_id = req.params.comment_id;

        //Get comments from database
        const commentRepository = getRepository(CommentEntity);
        const comment = await commentRepository.findOneOrFail(comment_id);

        await commentRepository.remove(comment);
      
        res.status(204).send();
      };

    static getPostComments = async (req: Request, res: Response) => {
    
        //Get comments from database
        const post_id = req.params.post_id;
        const commentRepository = getRepository(CommentEntity);
        const postRepository = getRepository(PostEntity);

        let forPost = await postRepository.findOneOrFail(post_id);

        const comments = await commentRepository.find({ relations: ['likes', 'user'] , where: { post: forPost }});
      
        //Send the comments object
        res.send(comments);
      };

    static addComment = async (req: Request, res: Response) => {

        let { content, post_id, user_id } = req.body;

        //Try to find user and post on database
        const postRepository = getRepository(PostEntity);
        const userRepository = getRepository(UserEntity);
        const commentRepository = getRepository(CommentEntity);
        let post 
        let user
        try {
            post = await postRepository.findOneOrFail(post_id, {
            relations: ['comments']
            });
            user = await userRepository.findOneOrFail(user_id);
        } catch (error) {
          //If not found, send a 404 response
          res.status(404).send("post/user not found");
          return;
        }
  
        let commment = new CommentEntity();
        commment.content = content;
        commment.post = post;
        commment.user = user;

      
        try {
          await commentRepository.save(commment);
          post.comments.push(commment);
          postRepository.save(post);
        } catch (e) {
          res.status(404).send();
          return;
        }
        //After all send a 204 (no content, but accepted) response
        res.status(204).send();
      };


      static likeComment = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;
        const user_id = req.params.user_id;
      
        //Try to find user on database
        const commentRepository = getRepository(CommentEntity);
        const userRepository = getRepository(UserEntity);
        let comment 
        let user
        try {
          comment = await commentRepository.findOneOrFail(id, {
            relations: ['likes']
            });
            user = await userRepository.findOneOrFail(user_id);
        } catch (error) {
          //If not found, send a 404 response
          res.status(404).send("comment not found");
          return;
        }
  
        comment.likes.push(user);
      
        try {
          await commentRepository.save(comment);
        } catch (e) {
          res.status(404).send();
          return;
        }
        //After all send a 204 (no content, but accepted) response
        res.status(204).send();
      };

      static dislikeComment = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;
        const user_id = req.params.user_id;
      
        //Try to find user on database
        const commentRepository = getRepository(CommentEntity);
        const userRepository = getRepository(UserEntity);
        let comment : CommentEntity;
        let user : UserEntity;
        try {
            comment = await commentRepository.findOneOrFail(id, {
            relations: ['likes']
            });
            user = await userRepository.findOneOrFail(user_id);
        } catch (error) {
          //If not found, send a 404 response
          res.status(404).send("post not found");
          return;
        }
  
        const pending_delete : UserEntity  = comment.likes.find(e => e.user_id === user.user_id); 
        comment.likes.splice(comment.likes.indexOf(pending_delete), 1);
        
        try {
          await commentRepository.save(comment);
        } catch (e) {
          res.status(404).send();
          return;
        }
        //After all send a 204 (no content, but accepted) response
        res.status(204).send();
      };

     
}
    
export default CommentController;