using backend.Data;
using backend.Interfaces.Repositories;
using backend.Models;

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

    public Task RemoveLike(Like like, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}