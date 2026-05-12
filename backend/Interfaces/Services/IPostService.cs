namespace backend.Interfaces.Services;

using backend.DTOs;
using backend.Models;

public interface IPostService
{
    public Task<List<GetPostDTO>> GetPosts();
    public Task<GetPostDTO> GetPost(Guid guid);
    public void CreatePost(Post post);
    public void UpdatePost(Guid guid, UpdatePostDTO updatePostDTO);
    public void DeletePost(Guid guid);
    public Task LikePost(LikePostDTO likePostDTO, CancellationToken cancellationToken);
    public Task<List<GetPostDTO>> SearchPosts(string searchCriteria);
    public Task<List<GetPostDTO>> GetPostsByTag(string tag);
    public List<GetPostDTO> GetPostsByAuthor(Guid authorId);
    public Task AddComment(Guid postId);
}