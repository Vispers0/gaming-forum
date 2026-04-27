namespace backend.Models;

public class Like
{
    public Guid Guid { get; set; }
    public Guid UserId { get; set; }
    public Guid PostId { get; set; }
}