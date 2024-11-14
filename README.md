
# Thunder Link

This repository contains a social media app with features including user authentication, post creation, comments, likes, and a follow system.

# Features

- **User Authentication**: Users can register, log in, and authenticate via Google OAuth.
- **Posts**: Users can create, read, and delete posts. Posts can include text and images.
- **Comments**: Users can add comments to posts and delete their own comments.
- **Likes**: Users can like and unlike posts.
- **Follow System**: Users can follow and unfollow other users.
- **Image Uploads**: Users can upload images for their posts, stored in AWS S3.
- **Cache Management**: Redis is used for caching frequently accessed data like posts, comments, and user recommendations.

## Tech Stack

- **Frontend**: Next.js, GraphQL
- **Backend**: Node.js, Express.js, Prisma, GraphQL
- **Database**: PostgreSQL (managed through Prisma)
- **Authentication**: JWT, Google OAuth
- **Image Storage**: AWS S3
- **Caching**: Redis

## Getting Started

### Prerequisites

Make sure you have the following installed on your local machine:

- Node.js
- npm or yarn
- PostgreSQL
- Redis
- AWS account (for S3)

### Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/yourusername/social-media-app.git
    cd social-media-app
    ```

2. Install backend dependencies:

    ```sh
    npm install
    # or
    yarn install
    ```

3. Set up environment variables:

    Create a `.env` file in the root directory and add the following variables:

    ```env
    DATABASE_URL=postgresql://username:password@localhost:5432/database
    REDIS_URL=redis://localhost:6379
    AWS_ACCESS_KEY_ID=your-aws-access-key-id
    AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
    AWS_S3_BUCKET=your-s3-bucket-name
    AWS_DEFAULT_REGION=your-s3-bucket-region
    JWT_SECRET=your-jwt-secret
    GOOGLE_CLIENT_ID=your-google-client-id
    GOOGLE_CLIENT_SECRET=your-google-client-secret
    ```

4. Run database migrations:

    ```sh
    npx prisma migrate dev
    ```

5. Start the development server:

    ```sh
    npm run dev
    # or
    yarn dev
    ```

6. Install frontend dependencies:

   ```sh
   npm install
   # or
   yarn install
   ```

7. Start the frontend application:

   ```sh
   npx create-next-app my-next-app
   # or
   yarn create next-app my-next-app
   ```


## Usage

### User Authentication

- **Register**: Create a new user account.
- **Login**: Log into an existing account.

   ![alt text](https://github.com/Vineet829/thunder-link/blob/main/images/2.png)

<img src="https://github.com/Vineet829/thunder-link/blob/main/images/th1.png" alt="alt text" width="1000" height="600">



### Posts

- **Create Post**: Add new posts with text and optional images.
- **View Posts**: Browse all posts or a specific user's posts.
- **Delete Post**: Remove a post.


 ![alt text](https://github.com/Vineet829/thunder-link/blob/main/images/thunder5.png)
  ![alt text](https://github.com/Vineet829/thunder-link/blob/main/images/thunder6.png)
 <img src="https://github.com/Vineet829/thunder-link/blob/main/images/th2.png" alt="alt text" width="400" height="800">

### Comments

- **Add Comment**: Comment on posts.
- **Delete Comment**: Remove a specific comment.
- **Delete All Comments**: Remove all comments for a post.

 ![alt text](https://github.com/Vineet829/thunder-link/blob/main/images/thunder2.png)
 ![alt text](https://github.com/Vineet829/thunder-link/blob/main/images/thunder3.png)
 ![alt text](https://github.com/Vineet829/thunder-link/blob/main/images/thunder4.png)
 <img src="https://github.com/Vineet829/thunder-link/blob/main/images/th5.png" alt="alt text" width="400" height="800">
 <img src="https://github.com/Vineet829/thunder-link/blob/main/images/th6.png" alt="alt text" width="400" height="800">
 

### Likes

- **Like Post**: Like a post.
- **Unlike Post**: Unlike a post.
- **Delete All Likes**: Remove all likes for a post.

### Follow System

- **Follow User**: Follow another user.
- **Unfollow User**: Unfollow a user.
 ![alt text](https://github.com/Vineet829/thunder-link/blob/main/images/thunder7.png)
 ![alt text](https://github.com/Vineet829/thunder-link/blob/main/images/thunder8.png)
 <img src="https://github.com/Vineet829/thunder-link/blob/main/images/th3.png" alt="alt text" width="400" height="800">
  <img src="https://github.com/Vineet829/thunder-link/blob/main/images/th4.png" alt="alt text" width="400" height="800">

### Image Uploads

- **Upload Images**: Upload images to AWS S3 for inclusion in posts.
