using backend.DTOs;
using backend.Models;

namespace backend.Mappers;

public static class LikeMappers
{
    public static Like ToLike(this CreateLikeDTO createLikeDTO)
    {
        return new Like
        {
            Guid = Guid.NewGuid(),
            UserId = createLikeDTO.UserId,
            PostId = createLikeDTO.PostId
        };
    }

    public static GetLikeDTO ToGetLikeDTO(this Like like)
    {
        return new GetLikeDTO
        {
            Guid = like.Guid
        };
    }
}