namespace backend.DTOs;

public class RemoveLikeDTO
{
    public Guid userId { get; set; }
    public Guid postId { get; set; }
}