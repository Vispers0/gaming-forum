namespace backend.Models;

public class Game
{
    public Guid Guid { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Cover { get; set; } = string.Empty;
}