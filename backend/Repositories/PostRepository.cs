namespace backend.Repositories;

using System.Collections.Generic;
using System.Threading.Tasks;
using backend.DTOs;
using backend.Models;
using Data;
using Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

public class PostRepository : IPostRepository
{
    private readonly ApplicationDbContext _context;

    public PostRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Post>> GetPostsAsync()
    {
        List<Post> posts = await _context.posts
            .Include(p => p.PostContent)
            .ToListAsync();
        return posts;
    }

    public async Task<Post> GetPostAsync(Guid guid)
    {
        Post? post = await _context.posts
            .Include(p => p.PostContent)
            .FirstOrDefaultAsync(p => p.Guid == guid);

        if (post is null)
        {
            throw new KeyNotFoundException($"Post with guid {guid} not found");
        }

        return post;
    }

    public void CreatePost(Post post)
    {
        _context.posts.Add(post);
        _context.SaveChanges();
    }

    public void UpdatePost(Guid guid, UpdatePostDTO updatePostDTO) //ExecuteUpdateAsync
    {
        Post? post = GetPostAsync(guid).Result;

        post.PostContent = updatePostDTO.PostContent;

         _context.SaveChanges();
        //_context.posts.Where(p => p.guid == guid)
        //    .ExecuteUpdateAsync(setter => setter
        //        .SetProperty(p => p.PostContent.Title, updatePostDTO.PostContent.Title)
        //        .SetProperty(p => p.PostContent.BodyText, updatePostDTO.PostContent.BodyText)
        //        .SetProperty(p => p.PostType, updatePostDTO.PostType)
        //    );
    }

    public async Task DeletePost(Guid postId) //.ExecuteDeleteAsync();
    {
        await _context.posts.Where(p => p.Guid == postId).ExecuteDeleteAsync();
    }

    public async Task LikePost(Guid postId, bool isDislike, CancellationToken cancellationToken)
    {
        Post? postToChange = await _context.posts.FirstOrDefaultAsync(p => p.Guid == postId);

        if (postToChange is null)
        {
            throw new KeyNotFoundException($"Post with guid {postId} not found");
        }

        if (isDislike)
        {
            postToChange.Likes -= 1;
        }
        else
        {
            postToChange.Likes += 1;
        }

        await _context.SaveChangesAsync();
    }

    // todo метод для получения статей по конкретному тегу
    // todo поиск на сайте по содержимому текста
}