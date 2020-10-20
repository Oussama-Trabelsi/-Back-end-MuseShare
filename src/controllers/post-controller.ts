import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { PostEntity } from "../entities/post-entity";
import { UserEntity } from "../entities/user-entity";
 
class PostController{

    static listAll = async (req: Request, res: Response) => {
      //Get posts from database
      const postRepository = getRepository(PostEntity);
      const posts = await postRepository.find({ relations: ['user', 'likes'] });
    
      //Send the users object
      res.send(posts);
    };

    static newPost = async (req: Request, res: Response) => {
      //Get parameters from the body

      let { description, trackUrl, iconUrl, trackName, postDate, user_id } = req.body;
      let post = new PostEntity();
      let user: UserEntity;

      const postRepository = getRepository(PostEntity);
      const userRepository = getRepository(UserEntity);


      try {
        user = await userRepository.findOneOrFail(user_id);
      } catch (error) {
        //If not found, send a 404 response
        res.status(404).send("User not found");
        return;
      }


      post.description = description;
      post.trackUrl = trackUrl;
      post.iconUrl = iconUrl;
      post.trackname = trackName;
      post.date = postDate;
      post.user = user;
     
      try {
        await postRepository.save(post);
      } catch (e) {
        res.status(406).send("failed to add post");
        return;
      }
    
      //If all ok, send 201 response
      res.status(201).send();
    };
    
    static getOneById = async (req: Request, res: Response) => {
      const post_id = req.params.post_id;

      //Get post from database
      const postRepository = getRepository(PostEntity);
      const post = await postRepository.findOneOrFail(post_id, { relations: ['user', 'likes'] });
    
      //Send the users object
      res.send(post);
    };


    
    static getPostsForUser = async (req: Request, res: Response) => {
      const user_id = req.params.user_id;

      //Get posts from database
      const postRepository = getRepository(PostEntity);
      const UserRepository = getRepository(UserEntity);
      let found_user: UserEntity;
      try 
      { 
        found_user = await UserRepository.findOneOrFail(user_id);

      }
      catch(error)
      {
        res.status(404).send();
        return;
      }


      const posts = await postRepository.find({ relations: ['user', 'likes'],
                                                where : {user : found_user}});
    
      //Send the users object
      res.send(posts);
    };

    static likePost = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;
        const user_id = req.params.user_id;
      
        //Try to find user on database
        const postRepository = getRepository(PostEntity);
        const userRepository = getRepository(UserEntity);
        let post 
        let user
        try {
            post = await postRepository.findOneOrFail(id, {
            relations: ['likes']
            });
            user = await userRepository.findOneOrFail(user_id);
        } catch (error) {
          //If not found, send a 404 response
          res.status(404).send("post not found");
          return;
        }
  
        post.likes.push(user);
      
        try {
          await postRepository.save(post);
        } catch (e) {
          res.status(404).send();
          return;
        }
        //After all send a 204 (no content, but accepted) response
        res.status(204).send();
      };

      static dislikePost = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;
        const user_id = req.params.user_id;
      
        //Try to find user on database
        const postRepository = getRepository(PostEntity);
        const userRepository = getRepository(UserEntity);
        let post : PostEntity;
        let user : UserEntity;
        try {
            post = await postRepository.findOneOrFail(id, {
            relations: ['likes']
            });
            user = await userRepository.findOneOrFail(user_id);
        } catch (error) {
          //If not found, send a 404 response
          res.status(404).send("post not found");
          return;
        }
  
        const pending_delete : UserEntity  = post.likes.find(e => e.user_id === user.user_id); 
        post.likes.splice(post.likes.indexOf(pending_delete), 1);
        
        try {
          await postRepository.save(post);
        } catch (e) {
          res.status(404).send();
          return;
        }
        //After all send a 204 (no content, but accepted) response
        res.status(204).send();
      };
    
      static deletePost = async (req: Request, res: Response) => {
        const post_id = req.params.post_id;
  
        //Get posts from database
        const postRepository = getRepository(PostEntity);
        let found_post: PostEntity;
        try 
        { 
          found_post = await postRepository.findOneOrFail(post_id);
          await postRepository.remove(found_post);
        }
        catch(error)
        {
          res.status(404).send();
          return;
        }
      
        //Send no content
        res.status(204).send();
      };
     
    
}
    
export default PostController;