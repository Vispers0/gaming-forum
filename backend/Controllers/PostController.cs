using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

using System.Threading.Tasks;
using backend.DTOs;
using backend.Mappers;
using backend.Models;
using Interfaces.Services;

// TODO: связать backend и frontend
// TODO: определить на бэке какой пользователь подключён
// TODO: фиксы по синхронным запросам
// TODO: DTO для GET Post
// TODO: Нормальные миграции
// TODO: Таблица лайков пользователей
// TODO: убрать nullable
// TODO: Модерация продумать
// TODO: Миграции Metanit

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
    public async Task<IResult> FetchPosts()
    {
        List<GetPostDTO> posts = await _postService.GetPosts(); //todo dto - isLiked = true,false table userid postid

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
    public async Task<IResult> FetchPost([FromRoute] Guid postId)
    {
        try
        {
            GetPostDTO post = await _postService.GetPost(postId);

            return TypedResults.Ok(post);
        }
        catch (KeyNotFoundException)
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

    [HttpPatch]
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

    [HttpPatch]
    [Route("like/post/")]
    public async Task<IResult> LikePost([FromBody] LikePostDTO likePostDTO, CancellationToken cancellationToken)
    {
        await _postService.LikePost(likePostDTO, cancellationToken);
        return TypedResults.Ok();
    }
}