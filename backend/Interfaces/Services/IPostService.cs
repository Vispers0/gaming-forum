namespace backend.Interfaces.Services;

using backend.Models;

public interface IPostService
{
    public List<Post>? GetPosts();
    public Post? GetPost(Guid guid);
    public void CreatePost(Post post);
    public void DeletePost(Guid guid);
}