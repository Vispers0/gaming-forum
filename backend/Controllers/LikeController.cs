using backend.DTOs;
using backend.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/likes")]
public class LikeController
{
    private readonly ILikeService _likeService;

    public LikeController(ILikeService likeService)
    {
        _likeService = likeService;
    }

    [HttpGet]
    [Route("{postId}")]
    public async Task<IResult> GetPostLikes([FromRoute] Guid postId, CancellationToken cancellationToken)
    {
        List<GetLikeDTO> likeDTOs = await _likeService.GetPostLikes(postId, cancellationToken);
        return TypedResults.Ok(likeDTOs);
    }

    [HttpPost]
    public async Task<IResult> CreateLike([FromBody] CreateLikeDTO createLikeDTO, CancellationToken cancellationToken)
    {
        await _likeService.CreateLike(createLikeDTO, cancellationToken);
        return TypedResults.Created();
    }

    [HttpDelete]
    [Route("{likeId}")]
    public async Task<IResult> RemoveLike([FromRoute] Guid likeId, CancellationToken cancellationToken)
    {
        await _likeService.RemoveLike(likeId, cancellationToken);
        return TypedResults.NoContent();
    }

    [HttpDelete]
    public async Task<IResult> RemoveLike([FromBody] RemoveLikeDTO removeLikeDTO, CancellationToken cancellationToken)
    {
        await _likeService.RemoveLike(removeLikeDTO, cancellationToken);
        return TypedResults.NoContent();
    }
}