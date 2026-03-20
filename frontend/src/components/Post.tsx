import { useEffect, useState } from "react";

import "../styles/Post.css"

import noAvatarPicture from "../assets/User_Circle.svg"
import testPicture from "../assets/image-test.jpg"
import likeIcon from "../assets/Heart_01.svg"
import commentIcon from "../assets/Chat_Conversation_Circle.svg"

function Post() {
  const [avatar] = useState(noAvatarPicture)
  const [publishDate] = useState(0)
  const [postTitle] = useState("Test title dummy")
  const [postImage, setPostImage] = useState<string | null>(null)
  const [postText] = useState("Post text dummy")
  const [likeCount] = useState(0)
  const [commentCount] = useState(0)

  useEffect(() => {
    setPostImage(testPicture)
  }, [])

  return (
    <>
      <div className="post-body">
        <div className="author-label">
          <img className="profile-picture" src={avatar} alt="Фото профиля пользователя"/>
          <span>
            UserName
          </span>
          <div className="circle-decoration"/>
          <span className="publish-date-label">
            {publishDate} часов назад
          </span>
        </div>
        <div className="post-tags">
          <span className="game-tag">
            GameName
          </span>
          <span className="post-type-tag">
            PostType
          </span>
        </div>
        <span className="post-title">
          {postTitle}
        </span>
        <div className="post-content">
          {
            postImage != null ? (
              <img src={postImage} alt="Картинка публикации"/>
            ) : (
              null
            )
          }
          <p className="post-text">
            {postText}
          </p>
        </div>
        <div className="interactions-container">
          <button className="like-button">
            <img src={likeIcon}/>
            <span>{likeCount}</span>
          </button>
          <button className="comment-button">
              <img src={commentIcon}/>
              <span>{commentCount}</span>
          </button>
        </div>
      </div>
    </>
  )
}

export default Post;