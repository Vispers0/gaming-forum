// PostOverlay.tsx
import { useEffect, useState, useRef } from "react";
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
    authorName: string;
    authorAvatar?: string | null;
    content: string;
    publishDate: string;
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

function PostOverlay({ isOpen, onClose, post }: PostOverlayProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoadingComments, setIsLoadingComments] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [likes, setLikes] = useState(post.likeCount);
    const [isLiked, setIsLiked] = useState(false);
    const commentsEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && post.guid) {
            fetchComments();
        }
    }, [isOpen, post.guid]);

    useEffect(() => {
        scrollToBottom();
    }, [comments]);

    const fetchComments = async () => {
        setIsLoadingComments(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const mockComments: Comment[] = [
                {
                    id: "1",
                    authorName: "zzgaw",
                    authorAvatar: null,
                    content: "Главный дедлайн - это озерное чудовище, к нему нужно успеть к полутора часам, если опоздал можно смело перезаходить. Обязательно срезай через глифы в седьмой главе у стены слева от входа в лагерь и в двенадцатой справа перед крышей с арбалетчиками. Больше всего времени можно потерять на Мендесе в сарае если не использовать гранаты и огонь, а также в водном лабиринте где поможет прыжок-глиф к рычагам. Из оружия бери ТМР и Blacktail, прокачивай в первую очередь магазин и перезарядку.",
                    publishDate: "23 минуты назад",
                    reputation: 56
                },
                {
                    id: "2",
                    authorName: "SpeedMaster",
                    authorAvatar: null,
                    content: "Добавлю от себя: в главе 8 есть секретный проход через стену сразу после первого элеватора. Это экономит около 5 минут. Также рекомендую сохранить ручные гранаты для финальной битвы с Седлером - 3 гранаты в нужный момент позволяют пропустить целую фазу босса.",
                    publishDate: "1 час назад",
                    reputation: 23
                },
                {
                    id: "3",
                    authorName: "RE4Veteran",
                    authorAvatar: null,
                    content: "Важный момент: не забывай про черепа на стенах в замке! Есть один скрытый проход в комнате с рыцарями, который многие пропускают. И ещё - лучше не тратить время на всех врагов в деревне, беги мимо, где возможно.",
                    publishDate: "3 часа назад",
                    reputation: 12
                }
            ];
            
            setComments(mockComments);
        } catch (error) {
            console.error("Error fetching comments:", error);
        } finally {
            setIsLoadingComments(false);
        }
    };

    const scrollToBottom = () => {
        commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleLike = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/posts/${post.guid}/like`, {
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

    const handleVote = async (commentId: string, voteType: 'up' | 'down') => {
        try {
            // Заглушка - замените на реальный API
            setComments(prev => prev.map(comment => 
                comment.id === commentId 
                    ? { ...comment, reputation: comment.reputation + (voteType === 'up' ? 1 : -1) }
                    : comment
            ));
        } catch (error) {
            console.error('Error voting:', error);
        }
    };

    const handleSendComment = async () => {
        if (!newComment.trim()) return;
        
        setIsSending(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const newCommentObj: Comment = {
                id: Date.now().toString(),
                authorName: "Текущий пользователь",
                authorAvatar: null,
                content: newComment.trim(),
                publishDate: "Только что",
                reputation: 0
            };
            
            setComments(prev => [...prev, newCommentObj]);
            setNewComment("");
        } catch (error) {
            console.error("Error sending comment:", error);
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendComment();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="overlay-container" onClick={onClose}>
            <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
                <div className="overlay-header">
                    <h2>Публикация</h2>
                    <button className="close-button" onClick={onClose}>
                        <img src={closeIcon} alt="Закрыть" />
                    </button>
                </div>

                <div className="overlay-scrollable">
                    <div className="post-author">
                        <img 
                            className="author-avatar" 
                            src={post.authorAvatar || noAvatarPicture} 
                            alt={post.authorName}
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = noAvatarPicture;
                            }}
                        />
                        <div className="author-info">
                            <span className="author-name">{post.authorName}</span>
                            <span className="publish-date">{post.publishDate}</span>
                        </div>
                    </div>

                    <div className="post-tags">
                        {post.gameTag && (
                            <span className="game-tag">{post.gameTag}</span>
                        )}
                        {post.postTypeTag && (
                            <span className="post-type-tag">{post.postTypeTag}</span>
                        )}
                    </div>

                    <h1 className="post-title">{post.postTitle}</h1>

                    {post.postImage && (
                        <div className="post-image">
                            <img src={post.postImage} alt="Изображение публикации" />
                        </div>
                    )}

                    <div className="post-full-text">
                        <p>{post.postText}</p>
                    </div>

                    <div className="post-stats">
                        <button 
                            className={`stat-button like-button ${isLiked ? 'liked' : ''}`}
                            onClick={handleLike}
                        >
                            <img src={likeIcon} alt="Нравится" />
                            <span>{likes}</span>
                        </button>
                        <div className="stat-button">
                            <img src={commentIcon} alt="Комментарии" />
                            <span>{comments.length}</span>
                        </div>
                    </div>

                    <div className="comments-section">
                        <h3>Комментарии ({comments.length})</h3>
                        
                        {isLoadingComments ? (
                            <div className="loading-comments">
                                <div className="spinner"></div>
                                <p>Загрузка комментариев...</p>
                            </div>
                        ) : (
                            <div className="comments-list">
                                {comments.map((comment) => (
                                    <div key={comment.id} className="comment-item">
                                        <img 
                                            className="comment-avatar" 
                                            src={comment.authorAvatar || noAvatarPicture}
                                            alt={comment.authorName}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = noAvatarPicture;
                                            }}
                                        />
                                        <div className="comment-content">
                                            <div className="comment-header">
                                                <span className="comment-author">{comment.authorName}</span>
                                                <span className="comment-date">{comment.publishDate}</span>
                                            </div>
                                            <p className="comment-text">{comment.content}</p>
                                            <div className="comment-actions">
                                                <div className="reputation-control">
                                                    <button 
                                                        className="reputation-up"
                                                        onClick={() => handleVote(comment.id, 'up')}
                                                    >
                                                        <img src={upvoteIcon} alt="+" />
                                                    </button>
                                                    <span className={`reputation-value ${comment.reputation > 0 ? 'positive' : comment.reputation < 0 ? 'negative' : ''}`}>
                                                        {comment.reputation > 0 ? `+${comment.reputation}` : comment.reputation}
                                                    </span>
                                                    <button 
                                                        className="reputation-down"
                                                        onClick={() => handleVote(comment.id, 'down')}
                                                    >
                                                        <img src={downvoteIcon} alt="-" />
                                                    </button>
                                                </div>
                                                <button className="comment-reply">Ответить</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div ref={commentsEndRef} />
                            </div>
                        )}
                    </div>
                </div>

                <div className="comment-input-area">
                    <textarea
                        className="comment-input"
                        placeholder="Ваше сообщение"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyPress={handleKeyPress}
                        rows={3}
                    />
                    <button 
                        className="send-button"
                        onClick={handleSendComment}
                        disabled={isSending || !newComment.trim()}
                    >
                        <img src={sendIcon} alt="Отправить" />
                        <span>{isSending ? "Отправка..." : "Отправить"}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PostOverlay;