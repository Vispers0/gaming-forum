namespace backend.Services;

using System.Collections.Generic;
using backend.Models;
using Interfaces.Services;

using backend.Interfaces.Repositories;
using backend.DTOs;

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

    public void UpdatePost(Guid guid, UpdatePostDTO updatePostDTO)
    {
        _postRepository.UpdatePost(guid, updatePostDTO);
    }

    public void DeletePost(Guid guid)
    {
        _postRepository.DeletePost(guid);
    }
}