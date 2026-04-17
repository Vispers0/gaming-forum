namespace backend.Models;

public class UserProfile
{
    public Guid guid { get; set; } = Guid.Empty;
    public string? ProfilePicture { get; set; }
    public string? Username { get; set; }
}