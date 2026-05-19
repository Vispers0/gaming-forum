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
            (int, string) publishedAgoTime = CalculatePostPublishTime(post);

            postDTOs.Add(post.ToGetPostDTO(publishedAgoTime.Item1, publishedAgoTime.Item2));
        }

        return postDTOs;
    }

    public async Task<GetPostDTO> GetPost(Guid guid)
    {
        try
        {
            Post post = await _postRepository.GetPostAsync(guid);
        
            (int, string) publishedAgoTime = CalculatePostPublishTime(post);

            GetPostDTO postDTO = post.ToGetPostDTO(publishedAgoTime.Item1, publishedAgoTime.Item2);

            return postDTO;
        }
        catch (KeyNotFoundException e)
        {
            throw new KeyNotFoundException();
        }
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

    public async Task<List<GetPostDTO>> SearchPosts(string searchCriteria)
    {
        List<Post> foundPosts = await _postRepository.SearchPosts(searchCriteria);

        List<GetPostDTO> postsDtos = new List<GetPostDTO>();

        foreach (var post in foundPosts)
        {
            (int, string) publishedAgoTime = CalculatePostPublishTime(post);
            postsDtos.Add(post.ToGetPostDTO(publishedAgoTime.Item1, publishedAgoTime.Item2));
        }
        
        return postsDtos;
    }

    public async Task<List<GetPostDTO>> GetPostsByTag(string tag)
    {
        List<Post> posts = await _postRepository.GetPostsByTag(tag);
        List<GetPostDTO> postDtos = new List<GetPostDTO>();
        
        foreach (Post post in posts)
        {
            (int, string) publishedAgoTime = CalculatePostPublishTime(post);
            postDtos.Add(post.ToGetPostDTO(publishedAgoTime.Item1, publishedAgoTime.Item2));
        }
        
        return postDtos;
    }

    public Task AddComment(Guid postId)
    {
        _postRepository.AddComment(postId);
        
        return Task.CompletedTask;
    }

    public List<GetPostDTO> GetPostsByAuthor(Guid authorId)
    {
        List<Post> authorPosts = _postRepository.GetPostsByAuthor(authorId).Result;
        List<GetPostDTO> authorPostDtos = new List<GetPostDTO>();

        foreach (Post post in authorPosts)
        {
            (int, string) publishedAgoTime = CalculatePostPublishTime(post);
            authorPostDtos.Add(post.ToGetPostDTO(publishedAgoTime.Item1, publishedAgoTime.Item2));
        }

        return authorPostDtos;
    }

    private (int, string) CalculatePostPublishTime(Post post)
    {
        int timePosted = (DateTime.UtcNow - post.publishDate).Days;
        string dateType = "days";
        
        if (timePosted == 0)
        {
            timePosted = (DateTime.UtcNow - post.publishDate).Hours;
            dateType = "hours";
        }

        if (timePosted == 0)
        {
            timePosted = (DateTime.UtcNow - post.publishDate).Minutes;
            dateType = "minutes";
        }

        if (timePosted == 0)
        {
            timePosted = (DateTime.UtcNow - post.publishDate).Seconds;
            dateType = "seconds";
        }
        
        return (timePosted, dateType);
    }
}