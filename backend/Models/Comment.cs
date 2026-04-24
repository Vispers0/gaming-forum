namespace backend.Models;

public class Comment
{
    public required Guid Guid { get; set; }
    public required Guid PostId { get; set; }
    public required Guid AuthorId { get; set; }
    public required DateTime PublishDate { get; set; }
    public required string CommentText { get; set; } = String.Empty;
    public uint Reputation { get; set; }
}