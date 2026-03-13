namespace backend.Interfaces.Services;

using backend.DTOs;
using backend.Models;

public interface IPostService
{
    public List<Post>? GetPosts();
    public Post? GetPost(Guid guid);
    public void CreatePost(Post post);
    public void UpdatePost(Guid guid, UpdatePostDTO updatePostDTO);
    public void DeletePost(Guid guid);
}