using backend.DTOs;
using backend.Interfaces.Repositories;
using backend.Interfaces.Services;
using backend.Mappers;
using backend.Models;

namespace backend.Services;

public class LikeService : ILikeService
{
    private readonly ILikeRepository _likeRepository;

    public LikeService(ILikeRepository likeRepository)
    {
        _likeRepository = likeRepository;
    }

    public async Task CreateLike(CreateLikeDTO createLikeDTO, CancellationToken cancellationToken)
    {
        Like likeToAdd = createLikeDTO.ToLike();
        await _likeRepository.CreateLike(likeToAdd, cancellationToken);
    }

    public Task RemoveLike()
    {
        throw new NotImplementedException();
    }
}