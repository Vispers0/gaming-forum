using backend.DTOs;
using backend.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/comments")]
public class CommentController : ControllerBase
{
    private readonly ICommentService _commentService;

    public CommentController (ICommentService commentService)
    {
        _commentService = commentService;
    }

    [HttpGet]
    [Route("{postId}")]
    public async Task<IResult> GetPostComments([FromRoute] Guid postId)
    {
        List<GetCommentDTO> postComments = await _commentService.GetPostComments(postId);

        if (postComments.Count == 0)
        {
            return TypedResults.NoContent();
        }

        return TypedResults.Ok(postComments);
    }
}