using backend.DTOs;
using backend.Interfaces.Repositories;
using backend.Interfaces.Services;
using backend.Mappers;
using backend.Models;

namespace backend.Services;

public class CommentService : ICommentService
{
    private readonly ICommentRepository _commentRepository;

    public CommentService(ICommentRepository commentRepository)
    {
        _commentRepository = commentRepository;
    }

    public async Task CreateComment(CreateCommentDTO createCommentDTO, CancellationToken cancellationToken)
    {
        Comment commentToAdd = createCommentDTO.ToComment();

        await _commentRepository.CreateComment(commentToAdd, cancellationToken);
    }

    public async Task<List<GetCommentDTO>> GetPostComments(Guid postId)
    {
        List<Comment> postComments = await _commentRepository.GetPostComments(postId);
        List<GetCommentDTO> postCommentsDTOs = new List<GetCommentDTO>();

        foreach(Comment comment in postComments)
        {
            var diff = DateTime.UtcNow - comment.PublishDate;
            int timePosted = diff.Days;
            string dateType = "days";

            if (timePosted == 0)
            {
                timePosted = diff.Hours;
                dateType = "hours";
                
                if (timePosted == 0)
                {
                    timePosted = diff.Minutes;
                    dateType = "minutes";
                    
                    if (timePosted == 0)
                    {
                        timePosted = diff.Seconds;
                        dateType = "seconds";
                    }
                }
            }

            postCommentsDTOs.Add(new GetCommentDTO
            {
                PostId = comment.PostId,
                AuthorId = comment.AuthorId,
                TimePosted = timePosted,
                DateType = dateType,
                CommentText = comment.CommentText,
                Reputation = comment.Reputation
            });
        }

        return postCommentsDTOs;
    }
}