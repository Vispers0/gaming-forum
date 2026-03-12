using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

using backend.Models;
using Interfaces.Services;

[ApiController]
[Route("/api")]
public class PostController : ControllerBase
{
    private readonly IPostService _postService;

    public PostController(IPostService postService)
    {
        _postService = postService;
    }

    [HttpGet]
    [Route("posts")]
    public IResult FetchPosts()
    {
        List<Post>? posts = _postService.GetPosts();

        if (posts.Count > 0)
        {
            return TypedResults.Ok(posts);
        }
        else 
        {
            return TypedResults.NoContent();
        }
    }

    [HttpGet]
    [Route("post/{postId}")]
    public IResult FetchPost([FromRoute] Guid postId)
    {
        return TypedResults.NotFound();
    }

    [HttpPost]
    [Route("create/post")]
    public IResult CreatePost()
    {
        return TypedResults.NotFound();
    }

    [HttpDelete]
    [Route("delete/post")]
    public IResult DeletePost()
    {
        return TypedResults.NotFound();
    }

    [HttpPut]
    [Route("edit/post")]
    public IResult EditPost()
    {
        return TypedResults.NotFound();
    }
}