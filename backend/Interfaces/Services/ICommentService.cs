
using backend.DTOs;

namespace backend.Interfaces.Services;

public interface ICommentService
{
    public Task<List<GetCommentDTO>> GetPostComments(Guid postId);
    public Task CreateComment(CreateCommentDTO createCommentDTO, CancellationToken cancellationToken);
}