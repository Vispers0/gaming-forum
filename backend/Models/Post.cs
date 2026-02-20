namespace backend.Models;

using Enums;

public class Post
{
    public required Guid guid = Guid.Empty;
    public required UserProfile author;
    public required PostType postType;
    public required PostContent postContent;
    public required DateTime publishDate;
    public uint likes = 0;
    public uint comments = 0;
}
