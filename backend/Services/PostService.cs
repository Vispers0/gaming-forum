namespace backend.Services;

using System.Collections.Generic;
using backend.Models;
using Interfaces.Services;

using backend.Interfaces.Repositories;
using backend.DTOs;
using backend.Mappers;
using System.Threading.Tasks;
using System.Threading;

public class PostService : IPostService
{
    private readonly IPostRepository _postRepository;

    public PostService(IPostRepository postRepository)
    {
        _postRepository = postRepository;
    }

    public async Task<List<GetPostDTO>> GetPosts()
    {
        List<Post> posts = await _postRepository.GetPostsAsync();

        List<GetPostDTO> postDTOs = new List<GetPostDTO>();
        foreach (Post post in posts)
        {
            int timePosted = (DateTime.UtcNow - post.publishDate).Days;
            string dateType = "days";
            if (timePosted == 0)
            {
                timePosted = (DateTime.UtcNow - post.publishDate).Hours;
                dateType = "hours";
            }

            postDTOs.Add(post.ToGetPostDTO(timePosted, dateType));
        }

        return postDTOs;
    }

    public async Task<GetPostDTO> GetPost(Guid guid)
    {
        Post post = await _postRepository.GetPostAsync(guid);

        int timePosted = (DateTime.UtcNow - post.publishDate).Days;
        string dateType = "days";
        if (timePosted == 0)
        {
            timePosted = (DateTime.UtcNow - post.publishDate).Hours;
            dateType = "hours";
        }

        GetPostDTO postDTO = post.ToGetPostDTO(timePosted, dateType);

        return postDTO;
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

    public async Task LikePost(LikePostDTO likePostDTO, CancellationToken cancellationToken)
    {
        await _postRepository.LikePost(likePostDTO.PostId, likePostDTO.IsDislike, cancellationToken);
    }
}