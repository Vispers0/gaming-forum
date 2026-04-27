using backend.Models;

namespace backend.Interfaces.Repositories;

public interface ILikeRepository
{
    public Task<List<Like>> GetPostLikes(Guid postId, CancellationToken cancellationToken);
    public Task CreateLike(Like like, CancellationToken cancellationToken);
    public Task RemoveLike(Guid likeId, CancellationToken cancellationToken);
    public Task RemoveLike(Guid userId, Guid postId, CancellationToken cancellationToken);
}