using backend.Models;

namespace backend.Interfaces.Repositories;

public interface IPostRepository
{
    public Task<List<Post>?> GetPostsAsync();
}