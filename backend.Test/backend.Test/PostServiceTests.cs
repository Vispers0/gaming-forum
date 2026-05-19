using backend.DTOs;
using backend.Interfaces.Repositories;
using backend.Interfaces.Services;
using backend.Models;
using backend.Services;
using NUnit.Framework;
using Moq;

namespace backend.Test;

[TestFixture]
public class PostServiceTests
{
    private Mock<IPostRepository>  _postRepositoryMock;
    private IPostService _postService;
    
    [SetUp]
    public void Setup()
    {
        _postRepositoryMock = new Mock<IPostRepository>();
        _postService = new PostService(_postRepositoryMock.Object);
    }

    [Test]
    public async Task TestPostsFetched()
    {
        var expectedPosts = new List<Post>
        {
            new Post
            {
                Guid = Guid.Parse("9971cd28-fa00-46c1-b1f3-f4c402b12b90"),
                AuthorId = Guid.Parse("55370931-643a-4363-aac3-f2f767463c6f"),
                GameTag = "RE4",
                PostContent = new PostContent
                {
                    Title = "Unittest title"
                },
                Comments = 0,
                Likes = 0,
                publishDate = DateTime.UtcNow,
            },
            new Post
            {
                Guid = Guid.Parse("6f512b12-9612-45a5-924c-55e164541476"),
                AuthorId = Guid.Parse("40604732-caaa-4751-b68b-0cf1ed0b2e70"),
                GameTag = "CS2",
                PostContent = new PostContent
                {
                    Title = "Unittest cs 2 title"
                },
                Comments = 0,
                Likes = 0,
                publishDate = DateTime.UtcNow,
            }
        };
        
        _postRepositoryMock.Setup(x => x.GetPostsAsync())
            .ReturnsAsync(expectedPosts);
        
        var result = await _postService.GetPosts();
        Assert.That(result, Is.Not.Empty);
    }

    [Test]
    public async Task TestPostFetched()
    {
        var postId = Guid.Parse("6f512b12-9612-45a5-924c-55e164541476");
        var expectedPost = new Post
        {
            Guid = Guid.Parse("6f512b12-9612-45a5-924c-55e164541476"),
            AuthorId = Guid.Parse("40604732-caaa-4751-b68b-0cf1ed0b2e70"),
            GameTag = "CS2",
            PostContent = new PostContent
            {
                Title = "Unittest cs 2 title"
            },
            Comments = 0,
            Likes = 0,
            publishDate = DateTime.UtcNow,
        };
        
        _postRepositoryMock.Setup(x => x.GetPostAsync(postId))
            .ReturnsAsync(expectedPost);

        var result = await _postService.GetPost(postId);
        Assert.That(result.Guid, Is.EqualTo(postId));
    }

    [Test]
    public void TestPostCreated()
    {
        var postToCreate = new Post()
        {
            Guid = Guid.NewGuid(),
            AuthorId = Guid.NewGuid(),
            GameTag = "Minecraft",
            PostContent = new PostContent
            {
                Title = "Create post test"
            },
            Comments = 0,
            Likes = 0,
            publishDate = DateTime.UtcNow,
        };
        
        _postService.CreatePost(postToCreate);
        
        _postRepositoryMock.Verify(x => x.CreatePost(postToCreate), Times.Once);
    }
    
    [Test]
    public void TestPostUpdated()
    {
        var postId = Guid.Parse("6f512b12-9612-45a5-924c-55e164541476");
        var postUpdates = new UpdatePostDTO()
        {
            PostContent = new PostContent
            {
                guid = Guid.NewGuid(),
                Title = "Unit test update title",
                BodyText = "Unit test update body",
            }
        };
        
        _postService.UpdatePost(postId, postUpdates);
        
        _postRepositoryMock.Verify(x => x.UpdatePost(postId, postUpdates), Times.Once);
    }

    [Test]
    public void TestPostDeleted()
    {
        var postId = Guid.Parse("6f512b12-9612-45a5-924c-55e164541476");
        
        _postService.DeletePost(postId);
        
        _postRepositoryMock.Verify(x => x.DeletePost(postId), Times.Once);
    }

    [Test]
    public void TestPostLiked()
    {
        var postId = Guid.Parse("6f512b12-9612-45a5-924c-55e164541476");
        var isDislike = false;
        var ct = CancellationToken.None;

        LikePostDTO likePostDTO = new LikePostDTO
        {
            PostId = postId,
            IsDislike = isDislike,
        };
        
        _postService.LikePost(likePostDTO, ct);
        
        _postRepositoryMock.Verify(x=>x.LikePost(likePostDTO.PostId, likePostDTO.IsDislike, ct), Times.Once);

    }

    [Test]
    public async Task TestPostsFound()
    {
        var searchCriteria = "how to";

        var expectedPosts = new List<Post>
        {
            new Post
            {
                Guid = Guid.Parse("9971cd28-fa00-46c1-b1f3-f4c402b12b90"),
                AuthorId = Guid.Parse("55370931-643a-4363-aac3-f2f767463c6f"),
                GameTag = "RE4",
                PostContent = new PostContent
                {
                    Title = "How to Unittest title"
                },
                Comments = 0,
                Likes = 0,
                publishDate = DateTime.UtcNow,
            },
            new Post
            {
                Guid = Guid.Parse("6f512b12-9612-45a5-924c-55e164541476"),
                AuthorId = Guid.Parse("40604732-caaa-4751-b68b-0cf1ed0b2e70"),
                GameTag = "CS2",
                PostContent = new PostContent
                {
                    Title = "Unittest how to cs 2 title"
                },
                Comments = 0,
                Likes = 0,
                publishDate = DateTime.UtcNow,
            }
        };
        
        _postRepositoryMock.Setup(x => x.SearchPosts(searchCriteria))
            .ReturnsAsync(expectedPosts);
        
        var result = await _postService.SearchPosts(searchCriteria);
        
        _postRepositoryMock.Verify(x => x.SearchPosts(searchCriteria), Times.Once);
        Assert.That(result, Is.Not.Empty);
        Assert.That(result.Count, Is.EqualTo(expectedPosts.Count));
        Assert.That(result.All(x => x.PostContent.Title.ToLower().Contains(searchCriteria)), Is.True);
    }
    
    [Test]
    public async Task TestPostsByTagFound()
    {
        var tag = "RE4";
        var expectedPosts = new List<Post>
        {
            new Post
            {
                Guid = Guid.Parse("9971cd28-fa00-46c1-b1f3-f4c402b12b90"),
                AuthorId = Guid.Parse("55370931-643a-4363-aac3-f2f767463c6f"),
                GameTag = "RE4",
                PostContent = new PostContent
                {
                    Title = "How to Unittest title"
                },
                Comments = 0,
                Likes = 0,
                publishDate = DateTime.UtcNow,
            }
        };
        
        _postRepositoryMock.Setup(x => x.GetPostsByTag(tag))
            .ReturnsAsync(expectedPosts);
        
        var result = await _postService.GetPostsByTag(tag);
        
        _postRepositoryMock.Verify(x => x.GetPostsByTag(tag), Times.Once);
        Assert.That(result, Is.Not.Empty);
        Assert.That(result.Count, Is.EqualTo(expectedPosts.Count));
        Assert.That(result.All(x => x.GameTag.ToLower().Contains(tag.ToLower())), Is.True);
    }

    [Test]
    public void TestCommentCountIncreased()
    {
        var postId = Guid.Parse("9971cd28-fa00-46c1-b1f3-f4c402b12b90");
        
        _postService.AddComment(postId);
        
        _postRepositoryMock.Verify(x => x.AddComment(postId), Times.Once);
    }

    [Test]
    public void TestsPostsFetchedByAuthor()
    {
        var authorId = Guid.Parse("9971cd28-fa00-46c1-b1f3-f4c402b12b90");

        var expectedPosts = new List<Post>
        {
            new Post
            {
                Guid = Guid.Parse("9971cd28-fa00-46c1-b1f3-f4c402b12b90"),
                AuthorId = authorId,
                GameTag = "RE4",
                PostContent = new PostContent
                {
                    Title = "How to Unittest title"
                },
                Comments = 0,
                Likes = 0,
                publishDate = DateTime.UtcNow,
            },
            new Post
            {
                Guid = Guid.Parse("6f512b12-9612-45a5-924c-55e164541476"),
                AuthorId = authorId,
                GameTag = "CS2",
                PostContent = new PostContent
                {
                    Title = "Unittest how to cs 2 title"
                },
                Comments = 0,
                Likes = 0,
                publishDate = DateTime.UtcNow,
            }
        };
        
        _postRepositoryMock.Setup(x => x.GetPostsByAuthor(authorId))
            .ReturnsAsync(expectedPosts);
        
        var result = _postService.GetPostsByAuthor(authorId);
        
        _postRepositoryMock.Verify(x => x.GetPostsByAuthor(authorId), Times.Once);
        Assert.That(result, Is.Not.Empty);
        Assert.That(result.Count, Is.EqualTo(expectedPosts.Count));
        Assert.That(result.All(x => x.AuthorId == authorId));
    }
}