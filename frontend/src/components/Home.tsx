import { useEffect, useState } from "react";
import Post from "./Post";
import "../styles/Home.css"

interface PostContent {
    title: string;
    bodyText?: string | null;
    image?: string | null;
}

interface GetPostDTO {
    guid: string;
    authorId: string;
    postContent: PostContent;
    timePosted: number;
    dateType: string;
    likes: number;
    comments: number;
}

interface UserProfile {
    username: string;
    profilePicture?: string | null;
}

function Home() {
  const [posts, setPosts] = useState<GetPostDTO[]>([]);
  const [authors, setAuthors] = useState<Map<string, UserProfile>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Получаем посты
      const postsResponse = await fetch('http://localhost:8080/api/posts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!postsResponse.ok) {
        throw new Error(`HTTP error! status: ${postsResponse.status}`);
      }

      const postsData: GetPostDTO[] = await postsResponse.json();
      setPosts(postsData);

      // Собираем уникальные ID авторов
      const authorIds = [...new Set(postsData.map(post => post.authorId))];
      
      // Загружаем информацию об авторах
      await fetchAuthors(authorIds);

    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err instanceof Error ? err.message : 'Не удалось загрузить посты');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAuthors = async (authorIds: string[]) => {
    const authorsMap = new Map<string, UserProfile>();
      
      // Загружаем каждого автора отдельно (или можно сделать batch запрос)
    for (const authorId of authorIds) {
      try {
        const response = await fetch(`http://localhost:8080/api/users/${authorId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
          
        if (response.ok) {
          const userData: UserProfile = await response.json();
          authorsMap.set(authorId, userData);
        } else {
          // Если пользователь не найден, используем дефолтные данные
          authorsMap.set(authorId, {
            username: 'Пользователь',
            profilePicture: null
          });
        }
      } catch (error) {
        console.error(`Error fetching author ${authorId}:`, error);
        authorsMap.set(authorId, {
          username: 'Пользователь',
          profilePicture: null
        });
      }
    }
      
      setAuthors(authorsMap);
  };

  const formatDate = (timePosted: number, dateType: string): string => {
    switch (dateType) {
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

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Загрузка постов...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={fetchPosts} className="retry-button">
          Попробовать снова
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="empty-container">
        <p>Нет постов для отображения</p>
        <p>Будьте первым, кто создаст пост!</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="posts-feed">
          {posts.map((post) => {
            const author = authors.get(post.authorId);
            return (
              <Post
                key={post.guid}
                guid={post.guid}
                authorName={author?.username || 'Пользователь'}
                authorAvatar={author?.profilePicture || null}
                publishDate={formatDate(post.timePosted, post.dateType)}
                postTitle={post.postContent.title}
                postImage={post.postContent.image || null}
                postText={post.postContent.bodyText || ''}
                likeCount={post.likes}
                commentCount={post.comments}
              />
            );
          })}
      </div>
    </div>
  );
}

export default Home;