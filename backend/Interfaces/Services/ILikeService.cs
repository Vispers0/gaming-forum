using backend.DTOs;

namespace backend.Interfaces.Services;

public interface ILikeService
{
    public Task CreateLike(CreateLikeDTO createLikeDTO, CancellationToken cancellationToken);
    public Task RemoveLike();
}