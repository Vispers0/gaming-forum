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
            GameTag = createPostDTO.GameTag,
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

    public static GetPostDTO ToGetPostDTO(this Post post, int timePosted, string dateType)
    {
        return new GetPostDTO
        {
            Guid = post.Guid,
            AuthorId = post.AuthorId,
            GameTag =  post.GameTag,
            PostContent = new PostContent
            {
                guid = post.PostContent.guid,
                Title = post.PostContent.Title,
                BodyText = post.PostContent.BodyText,
                Image = post.PostContent.Image
            },
            TimePosted = timePosted,
            DateType = dateType,
            Likes = post.Likes,
            Comments = post.Comments
        };
    }
}