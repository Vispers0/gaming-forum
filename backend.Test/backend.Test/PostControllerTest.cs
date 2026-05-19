using backend.Controllers;
using backend.DTOs;
using backend.Interfaces.Services;
using backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace backend.Test;

[TestFixture]
public class PostControllerTest
{
    private Mock<IPostService> _postServiceMock;
    private PostController _postController;
    
    [SetUp]
    public void SetUp()
    {
        _postServiceMock = new Mock<IPostService>();
        _postController = new PostController(_postServiceMock.Object);
    }

    [Test]
    public async Task TestGetAllPosts()
    {
        var expectedPosts = new List<GetPostDTO>
        {
            new GetPostDTO()
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
                TimePosted = 4,
                DateType = "days"
            },
            new GetPostDTO()
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
                TimePosted = 3,
                DateType = "hours"
            }
        };

        _postServiceMock.Setup(x => x.GetPosts())
            .ReturnsAsync(expectedPosts);

        var result = await _postController.FetchPosts();
        
        Assert.That(result, Is.InstanceOf<Ok<List<GetPostDTO>>>());
    }

    [Test]
    public void TestGetPostById()
    {
        var postId = Guid.Parse("40604732-caaa-4751-b68b-0cf1ed0b2e70");
        var expectedPost = new GetPostDTO
        {
            Guid = postId,
            AuthorId = Guid.Parse("40604732-caaa-4751-b68b-0cf1ed0b2e71"),
            GameTag = "CS2",
            PostContent = new PostContent
            {
                Title = "Unittest cs 2 title"
            },
            Comments = 0,
            Likes = 0,
            TimePosted = 3,
            DateType = "hours"
        };
        
        _postServiceMock.Setup(x => x.GetPost(postId))
            .ReturnsAsync(expectedPost);
        
        var result = _postController.FetchPost(postId).Result;
        
        Assert.That(result, Is.InstanceOf<Ok<GetPostDTO>>());
    }

    [Test]
    public void TestGetPostByIdNotFound()
    {
        var postId = Guid.Parse("40604732-caaa-4751-b68b-0cf1ab0b2e70");
        
        _postServiceMock.Setup(x => x.GetPost(postId))
            .ThrowsAsync(new KeyNotFoundException());
        
        var result = _postController.FetchPost(postId).Result;
        
        Assert.That(result, Is.InstanceOf<NotFound>());
    }

    [Test]
    public void TestPostCreated()
    {
        var postDtoToCreate = new CreatePostDTO
        {
            AuthorId = Guid.NewGuid(),
            GameTag = "Garry's Mod",
            PostContent = new PostContent
            {
                Title = "Unittest title"
            },
        };
        
        var result = _postController.CreatePost(postDtoToCreate);
        
        Assert.That(result, Is.InstanceOf<Created>());
    }

    [Test]
    public void TestPostDeleted()
    {
        var postId = Guid.NewGuid();
        
        var result = _postController.DeletePost(postId);
        Assert.That(result, Is.InstanceOf<NoContent>());
    }

    [Test]
    public void TestPostEdited()
    {
        var postId = Guid.NewGuid();
        var updatePostDto = new UpdatePostDTO
        {
            PostContent = new PostContent
            {
                guid = Guid.NewGuid(),
                Title = "Unit test update title",
                BodyText = "Unit test update body",
            }
        };
        
        var result = _postController.EditPost(postId, updatePostDto);
        
        Assert.That(result, Is.InstanceOf<Ok>());
    }

    [Test]
    public void TestPostLiked()
    {
        var likePostDto = new LikePostDTO
        {
            PostId = Guid.NewGuid(),
            IsDislike = false
        };
        
        var result = _postController.LikePost(likePostDto, CancellationToken.None).Result;
        
        Assert.That(result, Is.InstanceOf<Ok>());
    }

    [Test]
    public void TestSearchPosts()
    {
        var searchCriteria = "Unittest";

        var expectedPosts = new List<GetPostDTO>
        {
            new GetPostDTO()
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
                TimePosted = 4,
                DateType = "days"
            },
            new GetPostDTO()
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
                TimePosted = 3,
                DateType = "hours"
            }
        };
        
        _postServiceMock.Setup(x => x.SearchPosts(searchCriteria))
            .ReturnsAsync(expectedPosts);
        
        var result = _postController.SearchPosts(searchCriteria).Result;
        
        Assert.That(result, Is.InstanceOf<Ok<List<GetPostDTO>>>());
    }

    [Test]
    public void TestSearchPostsNotFound()
    {
        var searchCriteria = "Unittest";
        
        _postServiceMock.Setup(x => x.SearchPosts(searchCriteria))
            .ReturnsAsync(new List<GetPostDTO>());
        
        var result = _postController.SearchPosts(searchCriteria).Result;
        
        Assert.That(result, Is.InstanceOf<NoContent>());
    }

    [Test]
    public void TestGetPostByTag()
    {
        var tag = "CS2";
        var expectedPost = new List<GetPostDTO>
        {
            new GetPostDTO
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
                TimePosted = 3,
                DateType = "hours"
            }
        };
        
        _postServiceMock.Setup(x => x.GetPostsByTag(tag))
            .ReturnsAsync(expectedPost);
        
        var result = _postController.GetPostsByTag(tag).Result;
        Assert.That(result, Is.InstanceOf<Ok<List<GetPostDTO>>>());
    }

    [Test]
    public void TestCommentCountIncreased()
    {
        var postId = Guid.NewGuid();
        
        var result = _postController.AddComment(postId);
        
        Assert.That(result, Is.InstanceOf<Ok>());
    }

    [Test]
    public void TestGetPostsByAuthor()
    {
        var authorId = Guid.NewGuid();
        
        var expectedPosts = new List<GetPostDTO>
        {
            new GetPostDTO()
            {
                Guid = Guid.Parse("9971cd28-fa00-46c1-b1f3-f4c402b12b90"),
                AuthorId = authorId,
                GameTag = "RE4",
                PostContent = new PostContent
                {
                    Title = "Unittest title"
                },
                Comments = 0,
                Likes = 0,
                TimePosted = 4,
                DateType = "days"
            },
            new GetPostDTO()
            {
                Guid = Guid.Parse("6f512b12-9612-45a5-924c-55e164541476"),
                AuthorId = authorId,
                GameTag = "CS2",
                PostContent = new PostContent
                {
                    Title = "Unittest cs 2 title"
                },
                Comments = 0,
                Likes = 0,
                TimePosted = 3,
                DateType = "hours"
            }
        };
        
        _postServiceMock.Setup(x => x.GetPostsByAuthor(authorId))
            .Returns(expectedPosts);
        
        var result = _postController.GetPostsByAuthor(authorId);
        
        Assert.That(result, Is.InstanceOf<Ok<List<GetPostDTO>>>());
    }
}