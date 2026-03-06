namespace backend.Models;

using Enums;
using Microsoft.EntityFrameworkCore;

public class Post
{
    public required Guid guid { get; set; } = Guid.Empty;
    public required UserProfile author { get; set; }
    public required PostType postType { get; set; }
    public required PostContent postContent { get; set; }
    public required DateTime publishDate { get; set; }
    public uint likes { get; set; }
    public uint comments { get; set; }
}
