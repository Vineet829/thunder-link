import { prismaClient } from "../clients/db";
import { redisClient } from "../clients/redis";

export interface CreatePostPayload {
  content: string;
  imageURL?: string;
  userId: string;

}

export interface CreateCommentData {
  content: string
  userId: string
  postId: string
}




class PostService {
  public static async createPost(data: CreatePostPayload) {
    const rateLimitFlag = await redisClient.get(
      `RATE_LIMIT:POST:${data.userId}`
    );
    if (rateLimitFlag) throw new Error("Please wait....");
    const post = await prismaClient.post.create({
      data: {
        content: data.content,
        imageURL: data.imageURL,
        author: { connect: { id: data.userId } },
      },
    });
    await redisClient.setex(`RATE_LIMIT:POST:${data.userId}`, 10, 1);
    await redisClient.del("ALL_POSTS");
    
    return post;
  }

  public static async addCommentToPost(data: CreateCommentData) {
 
    // Create the comment in the database
    const comment = await prismaClient.comment.create({
      data: {
        content: data.content,
        user: { connect: { id: data.userId } },
        post: { connect: { id: data.postId } },
      },
    });
  
    
    // await redisClient.setex(`RATE_LIMIT:COMMENT:${data.userId}`, 10, "1");
  
    
    // await redisClient.del(`COMMENTS_FOR_POST:${data.postId}`);
  
    return comment;
  }
  
  public static async getAllPosts() {
    await redisClient.del("ALL_POSTS");
    const cachedPosts = await redisClient.get("ALL_POSTS");
    if (cachedPosts) return JSON.parse(cachedPosts);
   
    const posts = await prismaClient.post.findMany({
      orderBy: { createdAt: "desc" },
    });
    await redisClient.set("ALL_POSTS", JSON.stringify(posts));
    return posts;
  }

  public static getPostById(id: string) {
    return prismaClient.post.findUnique({ where: { id } });
  }
  
    public static async userHasLikedPost(userId: string, postId: string){
      const like = await prismaClient.like.findFirst({
        where: {
          userId: userId,
          postId: postId,
        },
      });
      return like !== null;
    }
  
    public static async getAllComments(postId: string){
      
      
  
      let like
      like = await prismaClient.comment.findMany({
        where: {
          
          postId: postId
        },
      });
      
      return like
    }
  
  
  
  
    public static async likePost(userId: string, postId: string) {
    return prismaClient.like.create({
      data: {
       
        user: { connect: { id: userId } },
        post: { connect: { id: postId } },
      },
    });
  }

  public static async unlikePost(userId: string, postId: string) {
    return prismaClient.like.delete({
      
        where: { userId_postId: { userId: userId, postId: postId } }
      ,
    });
  }



  public static async deleteComments(postId: string) {
    return prismaClient.comment.deleteMany({
      where: { 
        postId: postId
      }
    });
  }
  
  public static async deleteSingleComment(postId: string, commentId: string) {
    // Try to find the comment based on commentId and postId
    const comment = await prismaClient.comment.findFirst({
      where: {
        AND: [
          { id: commentId },
          { postId: postId },
        ],
      }
    
    });
  
    // If the comment exists and matches the criteria, proceed with deletion
    if (comment) {
      await prismaClient.comment.delete({
        where: {
          id: comment.id, // It's safer to use the id from the found comment object
        },
      });
    } else {
      throw new Error('Comment not found or does not match the specified criteria.');
    }
    
  }
  
  
  public static async deleteLikes(postId: string) {
    return prismaClient.like.deleteMany({
      where: { 
        postId: postId
      }
    });
  }
  
  
  public static async deletePost(userId: string, postId: string) {
    // First, check if the tweet belongs to the user
    const post = await prismaClient.post.findFirst({
      where: {
        id: postId,
        authorId: userId, 
      },
    });
  
    
    if (post) {
      
      
     await this.deleteLikes(postId)  
      await this.deleteComments(postId)
    
      
      return prismaClient.post.delete({
        where: {
          id: postId,
        },
      });
    } else {
      throw new Error("Post not found or doesn't belong to the user.");
    }
  }


}

export default PostService;
