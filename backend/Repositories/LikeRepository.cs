using backend.Data;
using backend.Interfaces.Repositories;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories;

public class LikeRepository : ILikeRepository
{
    private readonly ApplicationDbContext _context;

    public LikeRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task CreateLike(Like like, CancellationToken cancellationToken)
    {
        await _context.Likes.AddAsync(like, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task RemoveLike(Guid likeId, CancellationToken cancellationToken)
    {
        await _context.Likes.Where(l => l.Guid == likeId).ExecuteDeleteAsync();
    }

    public async Task<List<Like>> GetPostLikes(Guid postId, CancellationToken cancellationToken)
    {
        List<Like> likes = await _context.Likes.Where(l => l.PostId == postId).ToListAsync();
        return likes;
    }

    public async Task RemoveLike(Guid userId, Guid postId, CancellationToken cancellationToken)
    {
        await _context.Likes.Where(l => l.UserId == userId && l.PostId == postId).ExecuteDeleteAsync();
    }
}