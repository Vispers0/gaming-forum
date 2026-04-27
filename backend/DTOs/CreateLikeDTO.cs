namespace backend.DTOs;

public class CreateLikeDTO
{
    public Guid UserId { get; set; }
    public Guid PostId { get; set; }
}