using backend.Models;

namespace backend.Interfaces.Repositories;

public interface ICommentRepository
{
    public Task<List<Comment>> GetPostComments(Guid postId);
}