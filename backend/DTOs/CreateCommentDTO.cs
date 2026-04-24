namespace backend.DTOs;

public class CreateCommentDTO
{
    public required Guid PostId { get; set; }
    public required Guid AuthorId { get; set; }
    public required string CommentText { get; set; } = String.Empty;
}