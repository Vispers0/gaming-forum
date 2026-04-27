using backend.DTOs;

namespace backend.Interfaces.Services;

public interface ILikeService
{
    public Task<List<GetLikeDTO>> GetPostLikes(Guid postId, CancellationToken cancellationToken);
    public Task CreateLike(CreateLikeDTO createLikeDTO, CancellationToken cancellationToken);
    public Task RemoveLike(Guid likeId, CancellationToken cancellationToken);
    public Task RemoveLike(RemoveLikeDTO removeLikeDTO, CancellationToken cancellationToken);
}