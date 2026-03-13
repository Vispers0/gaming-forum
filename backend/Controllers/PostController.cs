using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

using backend.DTOs;
using backend.Mappers;
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

        if (posts != null && posts.Count > 0)
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
        Post? post = _postService.GetPost(postId);

        if (post != null)
        {
            return TypedResults.Ok(post);
        }
        else
        {
            return TypedResults.NotFound();
        }
    }

    [HttpPost]
    [Route("create/post")]
    public IResult CreatePost([FromBody] CreatePostDTO createPostDTO)
    {
        Post post = createPostDTO.ToPost();

        _postService.CreatePost(post);

        return TypedResults.Created();
    }

    [HttpDelete]
    [Route("delete/post/{postId}")]
    public IResult DeletePost([FromRoute] Guid postId)
    {
        _postService.DeletePost(postId);
        return TypedResults.NoContent();
    }

    [HttpPut]
    [Route("edit/post/{postId}")]
    public IResult EditPost([FromRoute] Guid postId, [FromBody] UpdatePostDTO updatePostDTO)
    {
        if (!ModelState.IsValid)
        {
            return TypedResults.BadRequest();
        }

        _postService.UpdatePost(postId, updatePostDTO);

        return TypedResults.Ok(_postService.GetPost(postId));
    }
}