import { useEffect, useState } from "react";

import "../styles/Post.css"

import noAvatarPicture from "../assets/User_Circle.svg"
import testPicture from "../assets/image-test.jpg"

function Post() {
  const [avatar, setAvatar] = useState(noAvatarPicture)
  const [publishDate, setPublishDate] = useState(0)
  const [postTitle, setPostTitle] = useState("Test title dummy")
  const [postImage, setPostImage] = useState<string | null>(null)
  const [postText, setPostText] = useState("Post text dummy")

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
      </div>
    </>
  )
}

export default Post;