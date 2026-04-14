// CreatePost.tsx
import React, { useState, useRef } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import '../styles/CreatePost.css';

interface PostContent {
    guid: string;
    Title: string;
    BodyText?: string | null;
    Image?: string | null;
}

const CreatePost: React.FC = () => {
    const [formData, setFormData] = useState<PostContent>({
        guid: '00000000-0000-0000-0000-000000000000',
        Title: '',
        BodyText: '',
        Image: ''
    });

    const [errors, setErrors] = useState({
        Title: '',
        BodyText: '',
        Image: ''
    });

    const [imagePreview, setImagePreview] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

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

        if (formData.BodyText && formData.BodyText.length > 5000) {
            newErrors.BodyText = 'Текст не должен превышать 5000 символов';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Post created:', result);
                alert('Публикация успешно создана!');
                
                setFormData({
                    guid: '00000000-0000-0000-0000-000000000000',
                    Title: '',
                    BodyText: '',
                    Image: ''
                });
                setImagePreview('');
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            } else {
                const error = await response.json();
                alert('Ошибка при создании публикации: ' + (error.message || 'Неизвестная ошибка'));
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
                guid: '00000000-0000-0000-0000-000000000000',
                Title: '',
                BodyText: '',
                Image: ''
            });
            setImagePreview('');
            setErrors({ Title: '', BodyText: '', Image: '' });
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <div className="post-form-container">
            <div className="form-header">
                <h1>Создать публикацию</h1>
            </div>
            
            <div className="form-body">
                <form onSubmit={handleSubmit}>
                    {/* Hidden input for GUID */}
                    <input 
                        type="hidden" 
                        name="guid" 
                        value={formData.guid}
                        onChange={() => {}}
                    />
                    
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