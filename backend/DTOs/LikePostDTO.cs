namespace backend.DTOs;

public class LikePostDTO
{
    public Guid PostId { get; set; }
    public bool IsDislike { get; set; }
}