using backend.DTOs;
using backend.Models;

namespace backend.Mappers;

public static class PostMappers
{
    public static Post ToPost(this CreatePostDTO createPostDTO)
    {
        return new Post
        {
            Guid = Guid.NewGuid(),
            AuthorId = createPostDTO.AuthorId,
            PostContent = new PostContent
            {
                guid = Guid.NewGuid(),
                Title = createPostDTO.PostContent.Title,
                BodyText = createPostDTO.PostContent.BodyText,
                Image = createPostDTO.PostContent.Image
            },
            publishDate = DateTime.UtcNow,
            Likes = 0,
            Comments = 0
        };
    }
}