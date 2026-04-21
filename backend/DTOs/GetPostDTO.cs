using backend.Models;

namespace backend.DTOs;

public class GetPostDTO
{
    public Guid Guid { get; set; }
    public Guid AuthorId { get; set; }
    public PostContent PostContent { get; set; }
    public int TimePosted { get; set; }
    public string DateType { get; set; } = String.Empty;
    public uint Likes { get; set; }
    public uint Comments { get; set; }
}