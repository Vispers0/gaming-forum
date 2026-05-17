// CreatePost.tsx
import React, { useState, useRef } from 'react';
import type { ChangeEvent, DragEvent, FormEvent } from 'react';
import { useKeycloak } from '@react-keycloak-fork/web';
import '../styles/CreatePost.css';

interface PostContent {
    Title: string;
    BodyText?: string | null;
    Image?: string | null;
}

interface CreatePostRequest {
    AuthorId: string;
    GameTag: string;
    PostContent: PostContent;
}

interface AddGameDTO {
    name: string;
    cover?: string | null;
}

const API_BASE = 'http://localhost:8080/api';

const CreatePost: React.FC = () => {
    const { keycloak } = useKeycloak();

    const [formData, setFormData] = useState<PostContent>({
        Title: '',
        BodyText: '',
        Image: ''
    });

    const [gameTag, setGameTag] = useState<string>('');
    const [gameTagError, setGameTagError] = useState<string>('');

    const [errors, setErrors] = useState({
        Title: '',
        BodyText: '',
        Image: ''
    });

    const [imagePreview, setImagePreview] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Получаем ID пользователя из Keycloak
    const getAuthorId = (): string => {
        if (keycloak.authenticated && keycloak.tokenParsed?.sub) {
            return keycloak.tokenParsed.sub;
        }
        throw new Error('Пользователь не авторизован');
    };

    // Добавление игры в базу данных
    const addGameToDatabase = async (gameName: string, coverImage?: string | null): Promise<boolean> => {
        try {
            const gameData: AddGameDTO = {
                name: gameName,
                cover: coverImage || null
            };

            console.log('Adding game to database:', gameData);

            const response = await fetch(`${API_BASE}/games`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(gameData),
            });

            console.log('Add game response status:', response.status);

            if (response.ok) {
                console.log('Game added successfully:', gameName);
                return true;
            } else if (response.status === 409) {
                const errorText = await response.text();
                console.log('Game already exists:', errorText);
                return true; // Игра уже существует - это не ошибка, продолжаем
            } else {
                console.error('Failed to add game:', response.status);
                return false;
            }
        } catch (error) {
            console.error('Error adding game:', error);
            return false;
        }
    };

    // Обработчики изменения полей
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Обработка изменения GameTag
    const handleGameTagChange = (e: ChangeEvent<HTMLInputElement>) => {
        setGameTag(e.target.value);
        if (gameTagError) {
            setGameTagError('');
        }
    };

    // Обработка загрузки изображения
    const handleImageUpload = (file: File) => {
        if (file.size > 10 * 1024 * 1024) {
            setErrors(prev => ({ ...prev, Image: 'Размер изображения не должен превышать 10MB' }));
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            setErrors(prev => ({ ...prev, Image: 'Поддерживаются только форматы JPG, PNG, GIF и WEBP' }));
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;
            setImagePreview(result);
            setFormData(prev => ({ ...prev, Image: result }));
            setErrors(prev => ({ ...prev, Image: '' }));
        };
        reader.readAsDataURL(file);
    };

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleImageUpload(file);
        }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.currentTarget.classList.add('dragover');
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.currentTarget.classList.remove('dragover');
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.currentTarget.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleImageUpload(file);
        } else {
            setErrors(prev => ({ ...prev, Image: 'Пожалуйста, выберите изображение' }));
        }
    };

    const removeImage = () => {
        setImagePreview('');
        setFormData(prev => ({ ...prev, Image: '' }));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const validateForm = (): boolean => {
        const newErrors = { Title: '', BodyText: '', Image: '' };
        let isValid = true;

        if (!formData.Title.trim()) {
            newErrors.Title = 'Заголовок обязателен для заполнения';
            isValid = false;
        } else if (formData.Title.length < 3) {
            newErrors.Title = 'Заголовок должен содержать минимум 3 символа';
            isValid = false;
        }

        if (!gameTag.trim()) {
            setGameTagError('Укажите название игры');
            isValid = false;
        } else if (gameTag.length < 2) {
            setGameTagError('Название игры должно содержать минимум 2 символа');
            isValid = false;
        } else if (gameTag.length > 100) {
            setGameTagError('Название игры не должно превышать 100 символов');
            isValid = false;
        }

        if (formData.BodyText && formData.BodyText.length > 5000) {
            newErrors.BodyText = 'Текст не должен превышать 5000 символов';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    // Отправка формы
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // 1. Сначала добавляем игру в базу данных (если её там нет)
            const gameAdded = await addGameToDatabase(gameTag.trim(), formData.Image);

            if (!gameAdded) {
                console.warn('Game could not be added, but continuing with post creation');
            }

            // 2. Формируем тело запроса для создания поста
            const requestData: CreatePostRequest = {
                AuthorId: getAuthorId(),
                GameTag: gameTag.trim(),
                PostContent: {
                    Title: formData.Title,
                    BodyText: formData.BodyText || null,
                    Image: formData.Image || null
                }
            };

            console.log('Отправляемые данные для поста:', requestData);

            // 3. Отправляем запрос на создание поста
            const response = await fetch(`${API_BASE}/create/post`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            });

            console.log('Create post response status:', response.status);

            if (response.ok) {
                alert('Публикация успешно создана!');

                // Сброс формы
                setFormData({
                    Title: '',
                    BodyText: '',
                    Image: ''
                });
                setGameTag('');
                setImagePreview('');
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            } else {
                let errorMessage = 'Ошибка при создании публикации';
                try {
                    const errorText = await response.text();
                    if (errorText) {
                        errorMessage = errorText;
                    }
                } catch (err) {
                    console.error('Could not parse error response');
                }
                console.error('Error response:', errorMessage);
                alert(errorMessage);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Произошла ошибка при отправке данных');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        if (window.confirm('Вы уверены, что хотите отменить создание публикации? Все несохранённые данные будут потеряны.')) {
            setFormData({
                Title: '',
                BodyText: '',
                Image: ''
            });
            setGameTag('');
            setImagePreview('');
            setErrors({ Title: '', BodyText: '', Image: '' });
            setGameTagError('');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
      <div className="post-form-container">
          <div className="form-header">
              <h1>Создать публикацию</h1>
              <p>Поделитесь своими мыслями с сообществом</p>
          </div>

          <div className="form-body">
              <form onSubmit={handleSubmit}>
                  {/* Game Tag field - input */}
                  <div className="form-group">
                      <label htmlFor="gameTag">
                          Игра
                          <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        id="gameTag"
                        name="GameTag"
                        className="form-input"
                        value={gameTag}
                        onChange={handleGameTagChange}
                        placeholder="Введите название игры (например, Resident Evil 4 Remake)"
                        maxLength={100}
                        required
                      />
                      <div className="char-counter">
                          <span>{gameTag.length}</span> / 100
                      </div>
                      {gameTagError && <span className="error-message">{gameTagError}</span>}
                  </div>

                  {/* Title field */}
                  <div className={`form-group ${errors.Title ? 'error' : ''}`}>
                      <label htmlFor="title">
                          Заголовок
                          <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="Title"
                        className="form-input"
                        value={formData.Title}
                        onChange={handleInputChange}
                        placeholder="Введите заголовок публикации..."
                        maxLength={200}
                        required
                      />
                      <div className="char-counter">
                          <span>{formData.Title.length}</span> / 200
                      </div>
                      {errors.Title && <span className="error-message">{errors.Title}</span>}
                  </div>

                  {/* Body text field */}
                  <div className={`form-group ${errors.BodyText ? 'error' : ''}`}>
                      <label htmlFor="bodyText">
                          Текст публикации
                      </label>
                      <textarea
                        id="bodyText"
                        name="BodyText"
                        className="form-textarea"
                        value={formData.BodyText || ''}
                        onChange={handleInputChange}
                        placeholder="Напишите что-нибудь..."
                        maxLength={5000}
                        rows={6}
                      />
                      <div className="char-counter">
                          <span>{formData.BodyText?.length || 0}</span> / 5000
                      </div>
                      {errors.BodyText && <span className="error-message">{errors.BodyText}</span>}
                  </div>

                  {/* Image upload field */}
                  <div className="form-group">
                      <label>Изображение</label>
                      <div
                        className="image-upload-area"
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                          <div className="upload-icon">🖼️</div>
                          <div className="upload-text">
                              Перетащите изображение сюда или <span className="browse">выберите файл</span>
                          </div>
                          <div className="upload-hint">
                              Поддерживаются форматы: JPG, PNG, GIF, WEBP (макс. 10MB)
                          </div>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        id="imageInput"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleFileSelect}
                      />
                      {imagePreview && (
                        <div className="image-preview">
                            <img src={imagePreview} alt="Preview" />
                            <button
                              type="button"
                              className="remove-image"
                              onClick={removeImage}
                            >
                                ×
                            </button>
                        </div>
                      )}
                      {errors.Image && <span className="error-message">{errors.Image}</span>}
                  </div>

                  {/* Form actions */}
                  <div className="form-actions">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleCancel}
                      >
                          Отмена
                      </button>
                      <button
                        type="submit"
                        className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
                        disabled={isLoading}
                      >
                          {isLoading ? 'Публикация...' : 'Опубликовать'}
                      </button>
                  </div>
              </form>
          </div>
      </div>
    );
};

export default CreatePost;