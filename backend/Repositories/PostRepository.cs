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

    public async Task<List<Post>?> GetPostsAsync()
    {
        List<Post>? posts = await _context.posts
            .Include(p => p.author)
            .Include(p => p.postContent)
            .ToListAsync();
        return posts;
    }

    public async Task<Post?> GetPostAsync(Guid guid)
    {
        Post? post = await _context.posts
            .Include(p => p.author)
            .Include(p => p.postContent)
            .FirstOrDefaultAsync(p => p.guid == guid);
        return post;
    }

    public void CreatePost(Post post)
    {
        _context.posts.Add(post);
        _context.SaveChanges();
    }

    public void UpdatePost(Guid guid, UpdatePostDTO updatePostDTO)
    {
        Post? post = GetPostAsync(guid).Result;

        post.postType = updatePostDTO.PostType;
        post.postContent = updatePostDTO.PostContent;

        _context.SaveChanges();
    }

    public void DeletePost(Post post)
    {
        _context.posts.Remove(post);
        _context.SaveChanges();
    }
}