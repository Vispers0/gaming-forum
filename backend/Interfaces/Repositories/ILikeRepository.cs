using backend.Models;

namespace backend.Interfaces.Repositories;

public interface ILikeRepository
{
    public Task CreateLike(Like like, CancellationToken cancellationToken);
    public Task RemoveLike(Like like, CancellationToken cancellationToken);
}