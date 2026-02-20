using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

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
    [Route("/posts")]
    public IResult FetchPosts()
    {
        
    }

    [HttpGet]
    [Route("/post/{postId}")]
    public IResult FetchPost([FromRoute] Guid postId)
    {
        
    }

    [HttpPost]
    [Route("create/post")]
    public IResult CreatePost()
    {
        
    }

    [HttpDelete]
    [Route("delete/post")]
    public IResult DeletePost()
    {
        
    }

    [HttpPut]
    [Route("edit/post")]
    public IResult EditPost()
    {
        
    }
}