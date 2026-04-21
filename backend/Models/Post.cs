namespace backend.Models;

using Enums;
using Microsoft.EntityFrameworkCore;

public class Post
{
    public required Guid Guid { get; set; } = Guid.Empty;
    public required Guid AuthorId {get; set;}
    public required PostContent PostContent { get; set; }
    public required DateTime publishDate { get; set; }
    public uint Likes { get; set; }
    public uint Comments { get; set; }
}
