namespace backend.DTOs;

public class GetUserDTO
{
    public string Username { get; set; } = String.Empty;
    public string? ProfilePicture { get; set; }
}