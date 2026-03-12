using System.Runtime.CompilerServices;
using backend.Models;

namespace backend.Interfaces.Repositories;

public interface IPostRepository
{
    public Task<List<Post>?> GetPostsAsync();
    public Task<Post?> GetPostAsync(Guid guid);
    public void CreatePost(Post post);
    public void DeletePost(Post post);
}