using backend.DTOs;
using backend.Models;

namespace backend.Mappers;

public static class PostMappers
{
    public static Post ToPost(this CreatePostDTO createPostDTO)
    {
        return new Post
        {
            guid = Guid.NewGuid(),
            author = new UserProfile
            {
                guid = createPostDTO.Author.guid,
                ProfilePicture = createPostDTO.Author.ProfilePicture
                
            },
            postType = createPostDTO.PostType,
            postContent = new PostContent
            {
                guid = Guid.NewGuid(),
                Title = createPostDTO.PostContent.Title,
                BodyText = createPostDTO.PostContent.BodyText,
                Image = createPostDTO.PostContent.Image
            },
            publishDate = DateTime.UtcNow,
            likes = 0,
            comments = 0
        };
    }
}