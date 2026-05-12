// Home.tsx
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
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
  gameTag: string;
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState<GetPostDTO[]>([]);
  const [authors, setAuthors] = useState<Map<string, UserProfile>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const searchQuery = searchParams.get("search") || "";
  const tagQuery = searchParams.get("tag") || "";

  const fetchPosts = useCallback(async (searchCriteria?: string, tagCriteria?: string) => {
    setIsLoading(true);
    setError(null);
    setIsSearching(!!(searchCriteria || tagCriteria));

    try {
      let url = 'http://localhost:8080/api/posts';

      if (tagCriteria && tagCriteria.trim()) {
        url = `http://localhost:8080/api/posts/tag?name=${encodeURIComponent(tagCriteria)}`;
        console.log('Searching posts by tag:', tagCriteria);
      } else if (searchCriteria && searchCriteria.trim()) {
        url = `http://localhost:8080/api/posts/search?searchCriteria=${encodeURIComponent(searchCriteria)}`;
        console.log('Searching posts by text:', searchCriteria);
      }

      const postsResponse = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      // Обработка HTTP 204 (No Content) - посты не найдены
      if (postsResponse.status === 204) {
        console.log('No posts found (HTTP 204)');
        setPosts([]);
        setIsLoading(false);
        return;
      }

      if (!postsResponse.ok) {
        throw new Error(`HTTP error! status: ${postsResponse.status}`);
      }

      const postsData: GetPostDTO[] = await postsResponse.json();
      setPosts(postsData);

      const authorIds = [...new Set(postsData.map(post => post.authorId))];

      if (authorIds.length > 0) {
        await fetchAuthors(authorIds);
      } else {
        setAuthors(new Map());
      }

    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err instanceof Error ? err.message : 'Не удалось загрузить посты');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAuthors = async (authorIds: string[]) => {
    const authorsMap = new Map<string, UserProfile>();

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
        } else if (response.status === 204) {
          authorsMap.set(authorId, {
            username: 'Пользователь',
            profilePicture: null
          });
        } else {
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

  useEffect(() => {
    if (tagQuery) {
      fetchPosts(undefined, tagQuery);
    } else if (searchQuery) {
      fetchPosts(searchQuery, undefined);
    } else {
      fetchPosts();
    }
  }, [searchQuery, tagQuery, fetchPosts]);

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

  const handleClearSearch = () => {
    setSearchParams({});
  };

  const getSearchDisplayText = (): string => {
    if (tagQuery) {
      return `по тегу "${tagQuery}"`;
    }
    if (searchQuery) {
      return `по запросу "${searchQuery}"`;
    }
    return '';
  };

  if (isLoading && posts.length === 0) {
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
          <button onClick={() => {
            if (tagQuery) {
              fetchPosts(undefined, tagQuery);
            } else if (searchQuery) {
              fetchPosts(searchQuery, undefined);
            } else {
              fetchPosts();
            }
          }} className="retry-button">
            Попробовать снова
          </button>
        </div>
    );
  }

  // Пустое состояние для обычной ленты (без поиска)
  if (posts.length === 0 && !isSearching && !isLoading) {
    return (
        <div className="empty-container">
          <p>Нет постов для отображения</p>
          <p>Будьте первым, кто создаст пост!</p>
        </div>
    );
  }

  // Пустое состояние для поиска (ничего не найдено)
  if (posts.length === 0 && isSearching && !isLoading) {
    return (
        <div className="empty-container">
          <p>По вашему запросу {getSearchDisplayText()} ничего не найдено</p>
          <p>Попробуйте изменить критерии поиска</p>
          <button
              onClick={handleClearSearch}
              className="retry-button"
              style={{ marginTop: '16px' }}
          >
            Показать все посты
          </button>
        </div>
    );
  }

  return (
      <div className="home-container">
        {isSearching && (
            <div style={{ marginBottom: '16px', color: '#888888', fontSize: '14px' }}>
              Результаты поиска {getSearchDisplayText()}
              <button
                  onClick={handleClearSearch}
                  style={{
                    marginLeft: '12px',
                    background: 'none',
                    border: 'none',
                    color: '#5A5A5A',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
              >
                Очистить
              </button>
            </div>
        )}
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
                    gameTag={post.gameTag}
                />
            );
          })}
        </div>
      </div>
  );
}

export default Home;