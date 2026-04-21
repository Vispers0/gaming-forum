import { useState } from "react";

import "../styles/Post.css"

import noAvatarPicture from "../assets/User_Circle.svg"
import likeIcon from "../assets/Heart_01.svg"
import commentIcon from "../assets/Chat_Conversation_Circle.svg"

interface PostProps {
  guid: string
  authorName: string;
  authorAvatar?: string | null;
  publishDate: string;
  postTitle: string;
  postImage?: string | null;
  postText: string;
  likeCount: number;
  commentCount: number;
}

function Post({ 
  guid,
  authorName,
  authorAvatar,
  publishDate,
  postTitle,
  postImage,
  postText,
  likeCount,
  commentCount
}: PostProps) {
  const [avatar] = useState(authorAvatar || noAvatarPicture)
  const [likes, setLikes] = useState(likeCount)
  const [isLiked, setIsLiked] = useState(false)

  const handleLike = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/posts/${guid}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        if (isLiked) {
          setLikes(prev => prev - 1);
        } else {
          setLikes(prev => prev + 1);
        }
        setIsLiked(!isLiked);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  return (
    <div className="post-body">
      <div className="author-label">
        <img 
          className="profile-picture" 
          src={avatar} 
          alt="Фото профиля пользователя"
          onError={(e) => {
            (e.target as HTMLImageElement).src = noAvatarPicture;
          }}
        />
        <span className="author-name">
          {authorName}
        </span>
        <div className="circle-decoration"/>
        <span className="publish-date-label">
          {publishDate}
        </span>
      </div>
      <div className="post-tags">
          <span className="game-tag">
              {/* Можно добавить теги, если они будут в API */}
          </span>
          <span className="post-type-tag">
              {/* Можно добавить тип поста, если будет в API */}
          </span>
      </div>
      <span className="post-title">
        {postTitle}
      </span>
      <div className="post-content">
        {postImage && (
          <img 
            src={postImage} 
            alt="Картинка публикации"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        )}
        <p className="post-text">
          {postText}
        </p>
      </div>
      <div className="interactions-container">
        <button 
          className={`like-button ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
        >
          <img src={likeIcon} alt="Нравится"/>
          <span>{likes}</span>
        </button>
        <button className="comment-button">
          <img src={commentIcon} alt="Комментарии"/>
          <span>{commentCount}</span>
        </button>
      </div>
    </div>
  )
}

export default Post;