namespace backend.Interfaces.Services;

using backend.Models;

public interface IPostService
{
    public List<Post>? GetPosts(); 
}