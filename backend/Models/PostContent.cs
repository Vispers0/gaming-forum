namespace backend.Models;

public class PostContent
{
    public Guid guid { get; set; } = Guid.Empty;
    public string Title { get; set; } = string.Empty;
    public string? BodyText { get; set; }
    public string? Image { get; set; }
}