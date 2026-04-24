namespace backend.DTOs;

public class GetCommentDTO
{
    public required Guid PostId { get; set; }
    public required Guid AuthorId { get; set; }
    public required int TimePosted { get; set; }
    public required string CommentText { get; set; } = String.Empty;
    public int Reputation { get; set; }
}