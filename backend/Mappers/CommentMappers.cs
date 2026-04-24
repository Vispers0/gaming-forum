using System.Net.Http.Headers;
using backend.DTOs;
using backend.Models;

namespace backend.Mappers;

public static class CommentMappers
{
    public static Comment ToComment(this CreateCommentDTO createCommentDTO)
    {
        return new Comment
        {
            Guid = Guid.NewGuid(),
            PostId = createCommentDTO.PostId,
            AuthorId = createCommentDTO.AuthorId,
            PublishDate = DateTime.UtcNow,
            CommentText = createCommentDTO.CommentText,
            Reputation = 0
        };
    }
}