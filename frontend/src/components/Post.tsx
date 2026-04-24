// Post.tsx
import { useState } from "react";

import "../styles/Post.css"
import PostOverlay from "./PostOverlay";

import noAvatarPicture from "../assets/User_Circle.svg"
import likeIcon from "../assets/Heart_01.svg"
import commentIcon from "../assets/Chat_Conversation_Circle.svg"

interface PostProps {
    guid: string;
    authorName: string;
    authorAvatar?: string | null;
    publishDate: string;
    postTitle: string;
    postImage?: string | null;
    postText: string;
    likeCount: number;
    commentCount: number;
    gameTag?: string;
    postTypeTag?: string;
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
    commentCount,
    gameTag,
    postTypeTag
}: PostProps) {
    const [avatar] = useState(authorAvatar || noAvatarPicture)
    const [likes, setLikes] = useState(likeCount)
    const [isLiked, setIsLiked] = useState(false)
    const [isOverlayOpen, setIsOverlayOpen] = useState(false)

    // Получаем первые 3 предложения для превью
    const getPreviewText = (text: string, sentencesCount: number = 3): string => {
        if (!text) return '';
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
        const preview = sentences.slice(0, sentencesCount).join(' ');
        return preview;
    };

    const previewText = getPreviewText(postText, 3);
    const hasMoreText = postText.length > previewText.length;

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

    const handleOpenOverlay = () => {
        setIsOverlayOpen(true);
    };

    const handleCloseOverlay = () => {
        setIsOverlayOpen(false);
    };

    return (
        <>
            <div className="post-body" onClick={handleOpenOverlay}>
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
                    <div className="circle-decoration" />
                    <span className="publish-date-label">
                        {publishDate}
                    </span>
                </div>
                <div className="post-tags">
                    {gameTag && (
                        <span className="game-tag">{gameTag}</span>
                    )}
                    {postTypeTag && (
                        <span className="post-type-tag">{postTypeTag}</span>
                    )}
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
                        {previewText}
                        {hasMoreText && <span className="read-more">... Читать далее</span>}
                    </p>
                </div>
                <div className="interactions-container" onClick={(e) => e.stopPropagation()}>
                    <button
                        className={`like-button ${isLiked ? 'liked' : ''}`}
                        onClick={handleLike}
                    >
                        <img src={likeIcon} alt="Нравится" />
                        <span>{likes}</span>
                    </button>
                    <button className="comment-button">
                        <img src={commentIcon} alt="Комментарии" />
                        <span>{commentCount}</span>
                    </button>
                </div>
            </div>

            <PostOverlay
                isOpen={isOverlayOpen}
                onClose={handleCloseOverlay}
                    post={{
                    guid,
                    authorName,
                    authorAvatar,
                    publishDate,
                    postTitle,
                    postImage,
                    postText,
                    likeCount: likes,
                    commentCount,
                    gameTag,
                    postTypeTag
                }}
            />
        </>
    )
}

export default Post;