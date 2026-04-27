using backend.DTOs;
using backend.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/like")]
public class LikeController
{
    private readonly ILikeService _likeService;

    public LikeController(ILikeService likeService)
    {
        _likeService = likeService;
    }

    [HttpPost]
    public async Task<IResult> CreateLike([FromBody] CreateLikeDTO createLikeDTO, CancellationToken cancellationToken)
    {
        await _likeService.CreateLike(createLikeDTO, cancellationToken);
        return TypedResults.Created();
    }
}