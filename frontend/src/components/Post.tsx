// Post.tsx
import { useState, useEffect } from "react";
import { useKeycloak } from "@react-keycloak-fork/web";

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

const API_BASE = 'http://localhost:8080/api';

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
    const { keycloak } = useKeycloak();
    const [avatar] = useState(authorAvatar || noAvatarPicture)
    const [likes, setLikes] = useState(likeCount)
    const [isLiked, setIsLiked] = useState(false)
    const [isOverlayOpen, setIsOverlayOpen] = useState(false)
    const [isCheckingLike, setIsCheckingLike] = useState(true)

    // Получаем ID текущего пользователя
    const getCurrentUserId = (): string | null => {
        if (keycloak?.authenticated && keycloak.tokenParsed?.sub) {
            return keycloak.tokenParsed.sub;
        }
        return null;
    };

    // Проверяем, поставил ли пользователь лайк этому посту
    useEffect(() => {
        const checkIfLiked = async () => {
            const userId = getCurrentUserId();
            if (!userId) {
                setIsCheckingLike(false);
                return;
            }

            try {
                const response = await fetch(`${API_BASE}/likes/check?userId=${userId}&postId=${guid}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setIsLiked(data.isLiked || false);
                }
            } catch (error) {
                console.error('Error checking like status:', error);
            } finally {
                setIsCheckingLike(false);
            }
        };

        checkIfLiked();
    }, [guid]);

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
        const userId = getCurrentUserId();
        if (!userId) {
            alert('Необходимо авторизоваться');
            return;
        }

        try {
            if (!isLiked) {
                // Ставим лайк
                // 1. Создаём запись о лайке
                const likeResponse = await fetch(`${API_BASE}/likes`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: userId,
                        postId: guid
                    }),
                });

                if (!likeResponse.ok) {
                    throw new Error('Failed to create like');
                }

                // 2. Обновляем счётчик лайков поста (isDislike = false - ставим лайк)
                const patchResponse = await fetch(`${API_BASE}/like/post`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        postId: guid,
                        isDislike: false
                    }),
                });

                if (patchResponse.ok) {
                    setLikes(prev => prev + 1);
                    setIsLiked(true);
                }
            } else {
                // Убираем лайк
                // 1. Удаляем запись о лайке
                const deleteResponse = await fetch(`${API_BASE}/likes`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: userId,
                        postId: guid
                    }),
                });

                if (!deleteResponse.ok) {
                    throw new Error('Failed to delete like');
                }

                // 2. Обновляем счётчик лайков поста (isDislike = true - убираем лайк)
                const patchResponse = await fetch(`${API_BASE}/like/post`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        postId: guid,
                        isDislike: true
                    }),
                });

                if (patchResponse.ok) {
                    setLikes(prev => Math.max(0, prev - 1));
                    setIsLiked(false);
                }
            }
        } catch (error) {
            console.error('Error liking post:', error);
            alert('Не удалось обработать лайк');
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
                        disabled={isCheckingLike}
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