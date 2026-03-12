namespace backend.Services;

using System.Collections.Generic;
using backend.Models;
using Interfaces.Services;

using backend.Interfaces.Repositories;

public class PostService : IPostService
{
    private readonly IPostRepository _postRepository;

    public PostService(IPostRepository postRepository)
    {
        _postRepository = postRepository;
    }

    public List<Post>? GetPosts()
    {
        Task<List<Post>?> posts = _postRepository.GetPostsAsync();

        if (posts.Result != null)
        {
            return posts.Result;
        }
        else
        {
            return new List<Post>();
        }
    }

    public Post? GetPost(Guid guid)
    {
        Task<Post?> post = _postRepository.GetPostAsync(guid);

        return post.Result;
    }

    public void CreatePost(Post post)
    {
        _postRepository.CreatePost(post);
    }

    public void DeletePost(Guid guid)
    {
        Post? postToDelete = _postRepository.GetPostAsync(guid).Result;

        if (postToDelete != null)
        {
            _postRepository.DeletePost(postToDelete);
        }
    }
}