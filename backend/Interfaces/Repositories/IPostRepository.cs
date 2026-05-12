using System.Runtime.CompilerServices;
using backend.DTOs;
using backend.Models;

namespace backend.Interfaces.Repositories;

public interface IPostRepository
{
    public Task<List<Post>> GetPostsAsync();
    public Task<Post> GetPostAsync(Guid guid);
    public void CreatePost(Post post);
    public void UpdatePost(Guid guid, UpdatePostDTO updatePostDTO);
    public Task LikePost(Guid postId, bool isDislike, CancellationToken cancellationToken);
    public Task<List<Post>> SearchPosts(string searchCriteria);
    public Task<List<Post>> GetPostsByTag(string tag);
    public Task DeletePost(Guid postId);
}