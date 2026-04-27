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

    public async Task<List<GetLikeDTO>> GetPostLikes(Guid postId, CancellationToken cancellationToken)
    {
        List<Like> likes = await _likeRepository.GetPostLikes(postId, cancellationToken);
        List<GetLikeDTO> likeDTOs = new List<GetLikeDTO>();

        foreach(Like like in likes)
        {
            likeDTOs.Add(like.ToGetLikeDTO());
        }

        return likeDTOs;
    }

    public async Task RemoveLike(Guid likeId, CancellationToken cancellationToken)
    {
        await _likeRepository.RemoveLike(likeId, cancellationToken);
    }

    public async Task RemoveLike(RemoveLikeDTO removeLikeDTO, CancellationToken cancellationToken)
    {
        await _likeRepository.RemoveLike(removeLikeDTO.userId, removeLikeDTO.postId, cancellationToken);
    }
}