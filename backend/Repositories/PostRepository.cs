namespace backend.Repositories;

using System.Collections.Generic;
using System.Threading.Tasks;

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
        List<Post>? posts = await _context.posts.ToListAsync();
        return posts;
    }
}