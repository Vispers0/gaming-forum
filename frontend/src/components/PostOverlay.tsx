// PostOverlay.tsx
import { useEffect, useState, useRef, useCallback } from "react";
import { useKeycloak } from "@react-keycloak-fork/web";
import "../styles/PostOverlay.css";

import closeIcon from "../assets/Close_LG.svg";
import likeIcon from "../assets/Heart_01.svg";
import commentIcon from "../assets/Chat_Conversation_Circle.svg";
import sendIcon from "../assets/Paper_Plane.svg";
import noAvatarPicture from "../assets/User_Circle.svg";
import upvoteIcon from "../assets/Add_Plus_Circle.svg";
import downvoteIcon from "../assets/Remove_Minus_Circle.svg";

interface Comment {
    id: string;
    authorId: string;
    authorName: string;
    authorAvatar: string;
    content: string;
    timePosted: number;
    dateType: string;
    reputation: number;
}

interface PostOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    post: {
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
    };
}

const API_BASE = 'http://localhost:8080/api';

function PostOverlay({ isOpen, onClose, post }: PostOverlayProps) {
    const { keycloak } = useKeycloak();
    
    // Состояния
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [newCommentText, setNewCommentText] = useState("");
    const [likes, setLikes] = useState(post.likeCount);
    const [isLiked, setIsLiked] = useState(false);
    const [isCheckingLike, setIsCheckingLike] = useState(true);
    
    const commentsEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Получение ID текущего пользователя
    const getCurrentUserId = useCallback((): string | null => {
        if (keycloak?.authenticated && keycloak.tokenParsed?.sub) {
            return keycloak.tokenParsed.sub;
        }
        return null;
    }, [keycloak]);

    // Проверка статуса лайка для поста
    const checkLikeStatus = useCallback(async () => {
        const userId = getCurrentUserId();
        console.log('PostOverlay - Checking like status - authenticated:', keycloak?.authenticated, 'userId:', userId);
        
        if (!userId) {
            console.log('PostOverlay - No userId, setting isLiked to false');
            setIsLiked(false);
            setIsCheckingLike(false);
            return;
        }

        setIsCheckingLike(true);
        
        try {
            console.log(`PostOverlay - Checking like status for post ${post.guid}, user ${userId}`);
            const response = await fetch(`${API_BASE}/likes/check?userId=${userId}&postId=${post.guid}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('PostOverlay - Check like response status:', response.status);

            if (response.ok) {
                const textResponse = await response.text();
                console.log('PostOverlay - Raw response:', textResponse);
                
                const isLikedValue = textResponse === 'true';
                setIsLiked(isLikedValue);
                console.log('PostOverlay - Is liked:', isLikedValue);
            } else {
                console.error('PostOverlay - Check like failed with status:', response.status);
                setIsLiked(false);
            }
        } catch (error) {
            console.error('PostOverlay - Error checking like status:', error);
            setIsLiked(false);
        } finally {
            setIsCheckingLike(false);
        }
    }, [post.guid, keycloak?.authenticated, getCurrentUserId]);

    // Форматирование даты на основе timePosted и dateType
    const formatDate = useCallback((timePosted: number, dateType: string): string => {
        switch (dateType) {
            case 'seconds':
                return `${timePosted} ${declension(timePosted, ['секунду', 'секунды', 'секунд'])} назад`;
            case 'minutes':
                return `${timePosted} ${declension(timePosted, ['минуту', 'минуты', 'минут'])} назад`;
            case 'hours':
                return `${timePosted} ${declension(timePosted, ['час', 'часа', 'часов'])} назад`;
            case 'days':
                return `${timePosted} ${declension(timePosted, ['день', 'дня', 'дней'])} назад`;
            default:
                return 'Недавно';
        }
    }, []);

    const declension = (number: number, words: [string, string, string]): string => {
        const cases = [2, 0, 1, 1, 1, 2];
        return words[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
    };

    // Загрузка комментариев
    const loadComments = useCallback(async () => {
        if (!post.guid) return;
        
        console.log('Loading comments for post:', post.guid);
        setIsLoading(true);
        
        try {
            const response = await fetch(`${API_BASE}/comments/${post.guid}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });
            
            console.log('Comments response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Comments data:', data);
            
            if (Array.isArray(data)) {
                // Загружаем данные авторов для каждого комментария
                const commentsWithAuthors = await Promise.all(
                    data.map(async (comment: any, index: number) => {
                        let authorName = 'Пользователь';
                        let authorAvatar = noAvatarPicture;
                        
                        if (comment.authorId) {
                            try {
                                const userRes = await fetch(`${API_BASE}/users/${comment.authorId}`);
                                if (userRes.ok) {
                                    const userData = await userRes.json();
                                    authorName = userData.username || 'Пользователь';
                                    authorAvatar = userData.profilePicture || noAvatarPicture;
                                }
                            } catch (err) {
                                console.error('Error fetching user:', err);
                            }
                        }
                        
                        return {
                            id: comment.id || comment.guid || `temp-${index}`,
                            authorId: comment.authorId,
                            authorName,
                            authorAvatar,
                            content: comment.commentText || comment.content || '',
                            timePosted: comment.timePosted || 0,
                            dateType: comment.dateType || 'seconds',
                            reputation: comment.reputation || 0,
                        };
                    })
                );
                
                setComments(commentsWithAuthors);
            } else {
                setComments([]);
            }
        } catch (error) {
            console.error('Error loading comments:', error);
            setComments([]);
        } finally {
            setIsLoading(false);
        }
    }, [post.guid]);

    // Отправка комментария
    const sendComment = useCallback(async () => {
        const trimmedText = newCommentText.trim();
        if (!trimmedText) {
            console.log('Comment text is empty');
            return;
        }
        
        const userId = getCurrentUserId();
        if (!userId) {
            alert('Необходимо авторизоваться');
            return;
        }
        
        console.log('Sending comment...');
        setIsSending(true);
        
        try {
            const requestBody = {
                postId: post.guid,
                authorId: userId,
                commentText: trimmedText,
            };
            
            console.log('Request body:', requestBody);
            
            const response = await fetch(`${API_BASE}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });
            
            console.log('Send comment response status:', response.status);
            
            if (response.ok) {
                console.log('Comment sent successfully, HTTP 201');
                
                // Не ждём JSON, так как сервер возвращает только статус 201
                // Загружаем данные автора
                let authorName = 'Вы';
                let authorAvatar = noAvatarPicture;
                
                try {
                    const userRes = await fetch(`${API_BASE}/users/${userId}`);
                    if (userRes.ok) {
                        const userData = await userRes.json();
                        authorName = userData.username || 'Вы';
                        authorAvatar = userData.profilePicture || noAvatarPicture;
                    }
                } catch (err) {
                    console.error('Error fetching current user:', err);
                }
                
                // Создаём новый комментарий с локальными данными
                const newComment: Comment = {
                    id: Date.now().toString(),
                    authorId: userId,
                    authorName,
                    authorAvatar,
                    content: trimmedText,
                    timePosted: 0,
                    dateType: 'seconds',
                    reputation: 0,
                };
                
                setComments(prev => [...prev, newComment]);
                setNewCommentText("");
                
                // Фокус на textarea после отправки
                setTimeout(() => {
                    textareaRef.current?.focus();
                }, 100);
            } else {
                const errorText = await response.text();
                console.error('Failed to send comment:', response.status, errorText);
                alert('Не удалось отправить комментарий');
            }
        } catch (error) {
            console.error('Error sending comment:', error);
            alert('Ошибка при отправке комментария');
        } finally {
            setIsSending(false);
        }
    }, [newCommentText, post.guid, getCurrentUserId]);

    // Обработка лайка поста
    const handleLike = useCallback(async () => {
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
                        postId: post.guid
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
                        postId: post.guid,
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
                        postId: post.guid
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
                        postId: post.guid,
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
    }, [post.guid, isLiked, getCurrentUserId]);

    // Обработка голосования за комментарий
    const handleVote = useCallback(async (commentId: string, currentRep: number, voteType: 'up' | 'down') => {
        try {
            const response = await fetch(`${API_BASE}/comments/${commentId}/vote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ voteType }),
            });
            
            if (response.ok) {
                setComments(prev => prev.map(c => 
                    c.id === commentId 
                        ? { ...c, reputation: currentRep + (voteType === 'up' ? 1 : -1) }
                        : c
                ));
            }
        } catch (error) {
            console.error('Error voting:', error);
        }
    }, []);

    // Обработка нажатия Enter
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendComment();
        }
    };

    // Прокрутка к последнему комментарию
    useEffect(() => {
        if (commentsEndRef.current) {
            commentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [comments]);

    // Загрузка комментариев при открытии
    useEffect(() => {
        if (isOpen && post.guid) {
            console.log('Overlay opened, loading comments...');
            loadComments();
        }
    }, [isOpen, post.guid, loadComments]);

    // Проверка статуса лайка при открытии оверлея или изменении авторизации
    useEffect(() => {
        if (isOpen && post.guid) {
            console.log('Overlay opened, checking like status...');
            checkLikeStatus();
        }
    }, [isOpen, post.guid, keycloak?.authenticated, checkLikeStatus]);

    // Фокус на textarea при открытии
    useEffect(() => {
        if (isOpen && textareaRef.current) {
            setTimeout(() => {
                textareaRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="overlay-container" onClick={onClose}>
            <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="overlay-header">
                    <h2>Публикация</h2>
                    <button className="close-btn" onClick={onClose}>
                        <img src={closeIcon} alt="Закрыть" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="overlay-body">
                    {/* Post Author */}
                    <div className="post-author">
                        <img 
                            src={post.authorAvatar || noAvatarPicture} 
                            alt={post.authorName}
                            className="author-avatar"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = noAvatarPicture;
                            }}
                        />
                        <div className="author-details">
                            <span className="author-name">{post.authorName}</span>
                            <span className="post-date">{post.publishDate}</span>
                        </div>
                    </div>

                    {/* Tags */}
                    {(post.gameTag || post.postTypeTag) && (
                        <div className="post-tags">
                            {post.gameTag && <span className="tag game-tag">{post.gameTag}</span>}
                            {post.postTypeTag && <span className="tag type-tag">{post.postTypeTag}</span>}
                        </div>
                    )}

                    {/* Title */}
                    <h1 className="post-title">{post.postTitle}</h1>

                    {/* Image */}
                    {post.postImage && (
                        <div className="post-image">
                            <img src={post.postImage} alt="Post" />
                        </div>
                    )}

                    {/* Text */}
                    <div className="post-text">
                        <p>{post.postText}</p>
                    </div>

                    {/* Stats */}
                    <div className="post-stats">
                        <button 
                            className={`stat-btn like-btn ${isLiked ? 'active' : ''}`}
                            onClick={handleLike}
                            disabled={isCheckingLike}
                        >
                            <img src={likeIcon} alt="Like" />
                            <span>{likes}</span>
                        </button>
                        <div className="stat-btn">
                            <img src={commentIcon} alt="Comments" />
                            <span>{comments.length}</span>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className="comments-section">
                        <h3>Комментарии ({comments.length})</h3>
                        
                        {isLoading ? (
                            <div className="loading-state">
                                <div className="spinner"></div>
                                <p>Загрузка комментариев...</p>
                            </div>
                        ) : comments.length === 0 ? (
                            <div className="empty-state">
                                <p>Нет комментариев</p>
                                <p className="empty-hint">Будьте первым, кто оставит комментарий!</p>
                            </div>
                        ) : (
                            <div className="comments-list">
                                {comments.map((comment) => (
                                    <div key={comment.id} className="comment">
                                        <img 
                                            src={comment.authorAvatar} 
                                            alt={comment.authorName}
                                            className="comment-avatar"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = noAvatarPicture;
                                            }}
                                        />
                                        <div className="comment-content">
                                            <div className="comment-header">
                                                <span className="comment-author">{comment.authorName}</span>
                                                <span className="comment-date">
                                                    {formatDate(comment.timePosted, comment.dateType)}
                                                </span>
                                            </div>
                                            <p className="comment-text">{comment.content}</p>
                                            <div className="comment-footer">
                                                <div className="reputation">
                                                    <button 
                                                        className="reputation-up"
                                                        onClick={() => handleVote(comment.id, comment.reputation, 'up')}
                                                    >
                                                        <img src={upvoteIcon} alt="+" />
                                                    </button>
                                                    <span className={`reputation-value ${comment.reputation > 0 ? 'positive' : comment.reputation < 0 ? 'negative' : ''}`}>
                                                        {comment.reputation > 0 ? `+${comment.reputation}` : comment.reputation}
                                                    </span>
                                                    <button 
                                                        className="reputation-down"
                                                        onClick={() => handleVote(comment.id, comment.reputation, 'down')}
                                                    >
                                                        <img src={downvoteIcon} alt="-" />
                                                    </button>
                                                </div>
                                                <button className="reply-btn">Ответить</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div ref={commentsEndRef} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Comment Input */}
                <div className="comment-input-container">
                    <textarea
                        ref={textareaRef}
                        className="comment-input"
                        placeholder="Напишите комментарий..."
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        rows={2}
                        disabled={isSending}
                    />
                    <button 
                        className="send-btn"
                        onClick={sendComment}
                        disabled={isSending || !newCommentText.trim()}
                    >
                        <img src={sendIcon} alt="Send" />
                        <span>{isSending ? "Отправка..." : "Отправить"}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PostOverlay;