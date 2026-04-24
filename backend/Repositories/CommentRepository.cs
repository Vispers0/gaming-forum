using backend.Data;
using backend.Interfaces.Repositories;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories;

public class CommentRepository : ICommentRepository
{
    private readonly ApplicationDbContext _context;

    public CommentRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Comment>> GetPostComments(Guid postId)
    {
        List<Comment> postComments = await _context.Comments
            .Where(comment => comment.PostId == postId)
            .ToListAsync();

        return postComments;
    }
}