namespace backend.Models;

using Enums;
using Microsoft.EntityFrameworkCore;

public class Post
{
    public required Guid Guid { get; init; }
    public required Guid AuthorId { get; init; }
    public required string GameTag { get; init; } = String.Empty;
    public required PostContent PostContent { get; set; }
    public required DateTime publishDate { get; init; }
    public uint Likes { get; set; }
    public uint Comments { get; set; }
}
