// Profile.tsx
import { useEffect, useState, useRef } from "react";
import { useKeycloak } from "@react-keycloak-fork/web";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";

import noAvatarPicture from "../assets/User_Circle.svg";
import editIcon from "../assets/Note_Edit.svg";
import deleteIcon from "../assets/Trash_Empty.svg";
import likeIcon from "../assets/Heart_01_black.svg";
import commentIcon from "../assets/Chat_Conversation_Circle_black.svg";
import lockIcon from "../assets/padlock.png";

interface PostContent {
    title: string;
    bodyText?: string | null;
    image?: string | null;
}

interface PostData {
    guid: string;
    authorId: string;
    gameTag: string;
    postContent: PostContent;
    timePosted: number;
    dateType: string;
    likes: number;
    comments: number;
}

interface UpdateUserDTO {
    profilePicture: string;
}

interface UpdatePostDTO {
    postContent: PostContent;
}

const API_BASE = 'http://localhost:8080/api';

function Profile() {
    const { keycloak } = useKeycloak();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [profilePicture, setProfilePicture] = useState<string>(noAvatarPicture);
    const [username, setUsername] = useState<string>("");
    const [fullName, setFullName] = useState<string>("");
    const [posts, setPosts] = useState<PostData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [editingPostId, setEditingPostId] = useState<string | null>(null);
    const [editFormData, setEditFormData] = useState<PostContent>({
        title: "",
        bodyText: "",
        image: null
    });

    const isAuthenticated = keycloak.authenticated;
    const userId = keycloak.tokenParsed?.sub || "";

    // Проверка авторизации
    useEffect(() => {
        if (!isAuthenticated) {
            // Если не авторизован, останавливаем загрузку
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    // Получение данных пользователя
    const fetchUserData = async () => {
        if (!userId) return;

        try {
            const response = await fetch(`${API_BASE}/users/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const userData = await response.json();
                if (userData.profilePicture) {
                    setProfilePicture(userData.profilePicture);
                }
                setUsername(userData.username || keycloak.tokenParsed?.preferred_username || "Пользователь");
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    // Получение постов пользователя
    const fetchUserPosts = async () => {
        if (!userId) return;

        try {
            const response = await fetch(`${API_BASE}/posts/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 204) {
                setPosts([]);
                return;
            }

            if (response.ok) {
                const postsData: PostData[] = await response.json();
                setPosts(postsData);
            }
        } catch (error) {
            console.error('Error fetching user posts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated && userId) {
            fetchUserData();
            fetchUserPosts();
        }

        // Получаем полное имя из Keycloak
        const name = keycloak.tokenParsed?.name || keycloak.tokenParsed?.given_name || "";
        setFullName(name);
    }, [userId, isAuthenticated]);

    // Загрузка изображения профиля
    const handleAvatarClick = () => {
        if (!isAuthenticated) {
            alert('Необходимо авторизоваться для изменения профиля');
            return;
        }
        fileInputRef.current?.click();
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            alert('Размер изображения не должен превышать 10MB');
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            alert('Поддерживаются только форматы JPG, PNG, GIF и WEBP');
            return;
        }

        const reader = new FileReader();
        reader.onload = async (event) => {
            const base64Image = event.target?.result as string;
            setProfilePicture(base64Image);

            setIsUploading(true);
            try {
                const updateData: UpdateUserDTO = {
                    profilePicture: base64Image
                };

                const response = await fetch(`${API_BASE}/users/${userId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updateData),
                });

                if (!response.ok) {
                    throw new Error('Failed to update profile picture');
                }

                console.log('Profile picture updated successfully');
            } catch (error) {
                console.error('Error uploading profile picture:', error);
                alert('Не удалось загрузить изображение профиля');
                // Откатываем изменение
                fetchUserData();
            } finally {
                setIsUploading(false);
            }
        };
        reader.readAsDataURL(file);
    };

    // Редактирование поста
    const handleEditPost = (post: PostData) => {
        if (!isAuthenticated) {
            alert('Необходимо авторизоваться для редактирования постов');
            return;
        }
        setEditingPostId(post.guid);
        setEditFormData({
            title: post.postContent.title,
            bodyText: post.postContent.bodyText || "",
            image: post.postContent.image || null
        });
    };

    const handleCancelEdit = () => {
        setEditingPostId(null);
        setEditFormData({ title: "", bodyText: "", image: null });
    };

    const handleUpdatePost = async (postId: string) => {
        try {
            const updateData: UpdatePostDTO = {
                postContent: {
                    title: editFormData.title,
                    bodyText: editFormData.bodyText || null,
                    image: editFormData.image || null
                }
            };

            const response = await fetch(`${API_BASE}/edit/post/${postId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });

            if (response.ok) {
                // Обновляем пост в списке
                setPosts(prev => prev.map(post =>
                  post.guid === postId
                    ? { ...post, postContent: { ...post.postContent, ...editFormData } }
                    : post
                ));
                setEditingPostId(null);
                alert('Пост успешно обновлён');
            } else {
                alert('Не удалось обновить пост');
            }
        } catch (error) {
            console.error('Error updating post:', error);
            alert('Ошибка при обновлении поста');
        }
    };

    // Удаление поста
    const handleDeletePost = async (postId: string) => {
        if (!isAuthenticated) {
            alert('Необходимо авторизоваться для удаления постов');
            return;
        }

        if (!confirm('Вы уверены, что хотите удалить этот пост?')) return;

        try {
            const response = await fetch(`${API_BASE}/delete/post/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setPosts(prev => prev.filter(post => post.guid !== postId));
                alert('Пост успешно удалён');
            } else {
                alert('Не удалось удалить пост');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Ошибка при удалении поста');
        }
    };

    const formatDate = (timePosted: number, dateType: string): string => {
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
                return `${timePosted} ${dateType} назад`;
        }
    };

    const declension = (number: number, words: [string, string, string]): string => {
        const cases = [2, 0, 1, 1, 1, 2];
        return words[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
    };

    const getPreviewText = (text: string, sentencesCount: number = 3): string => {
        if (!text) return '';
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
        const preview = sentences.slice(0, sentencesCount).join(' ');
        return preview;
    };

    // Если пользователь не авторизован, показываем предупреждение
    if (!isAuthenticated && !isLoading) {
        return (
          <div className="profile-unauthorized">
              <div className="unauthorized-container">
                  <img src={lockIcon} className="unauthorized-icon" alt="Доступ ограничен"/>
                  <h2>Доступ ограничен</h2>
                  <p>Для просмотра профиля необходимо войти в систему</p>
                  <div className="unauthorized-buttons">
                      <button
                        className="login-btn"
                        onClick={() => keycloak.login()}
                      >
                          Войти
                      </button>
                      <button
                        className="register-btn"
                        onClick={() => keycloak.register()}
                      >
                          Зарегистрироваться
                      </button>
                  </div>
              </div>
          </div>
        );
    }

    if (isLoading) {
        return (
          <div className="profile-loading">
              <div className="loading-spinner"></div>
              <p>Загрузка профиля...</p>
          </div>
        );
    }

    return (
      <div className="profile-container">
          {/* Секция профиля */}
          <div className="profile-header">
              <div className="avatar-container">
                  <img
                    src={profilePicture}
                    alt="Profile"
                    className="profile-avatar"
                    onClick={handleAvatarClick}
                    style={{ cursor: 'pointer' }}
                  />
                  {isUploading && <div className="avatar-overlay">Загрузка...</div>}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleFileSelect}
                  />
              </div>
              <div className="profile-info">
                  <h1 className="full-name">{fullName || "Пользователь"}</h1>
                  <p className="username">@{username}</p>
              </div>
          </div>

          {/* Секция постов */}
          <div className="profile-posts">
              <h2>Мои публикации</h2>
              {posts.length === 0 ? (
                <div className="empty-posts">
                    <p>У вас пока нет публикаций</p>
                    <button onClick={() => navigate('/post')} className="create-post-btn">
                        Создать первый пост
                    </button>
                </div>
              ) : (
                <div className="posts-grid">
                    {posts.map((post) => (
                      <div key={post.guid} className="profile-post-card">
                          {editingPostId === post.guid ? (
                            // Режим редактирования
                            <div className="edit-post-form">
                                <input
                                  type="text"
                                  className="edit-title"
                                  value={editFormData.title}
                                  onChange={(e) => setEditFormData(prev => ({ ...prev, title: e.target.value }))}
                                  placeholder="Заголовок"
                                />
                                <textarea
                                  className="edit-text"
                                  value={editFormData.bodyText || ""}
                                  onChange={(e) => setEditFormData(prev => ({ ...prev, bodyText: e.target.value }))}
                                  placeholder="Текст публикации"
                                  rows={6}
                                />
                                <div className="edit-actions">
                                    <button onClick={() => handleUpdatePost(post.guid)} className="save-btn">
                                        Сохранить
                                    </button>
                                    <button onClick={handleCancelEdit} className="cancel-btn">
                                        Отмена
                                    </button>
                                </div>
                            </div>
                          ) : (
                            <>
                                <div className="post-header">
                                    <span className="profile-post-game-tag">{post.gameTag}</span>
                                    <div className="post-actions">
                                        <button
                                          className="edit-post-btn"
                                          onClick={() => handleEditPost(post)}
                                          title="Редактировать"
                                        >
                                            <img src={editIcon} alt="Редактировать" />
                                        </button>
                                        <button
                                          className="delete-post-btn"
                                          onClick={() => handleDeletePost(post.guid)}
                                          title="Удалить"
                                        >
                                            <img src={deleteIcon} alt="Удалить" />
                                        </button>
                                    </div>
                                </div>
                                <h3 className="post-title">{post.postContent.title}</h3>
                                {post.postContent.image && (
                                  <img
                                    src={post.postContent.image}
                                    alt="Post"
                                    className="post-image"
                                  />
                                )}
                                <p className="post-text">
                                    {getPreviewText(post.postContent.bodyText || "", 3)}
                                </p>
                                <div className="post-meta">
                                            <span className="post-date">
                                                {formatDate(post.timePosted, post.dateType)}
                                            </span>
                                    <div className="post-stats">
                                                <span className="stat">
                                                    <img src={likeIcon} alt="Лайки" />
                                                    {post.likes}
                                                </span>
                                        <span className="stat">
                                                    <img src={commentIcon} alt="Комментарии" />
                                            {post.comments}
                                                </span>
                                    </div>
                                </div>
                            </>
                          )}
                      </div>
                    ))}
                </div>
              )}
          </div>
      </div>
    );
}

export default Profile;