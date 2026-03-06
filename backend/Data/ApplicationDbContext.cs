using Microsoft.EntityFrameworkCore;

namespace backend.Data;

using Models;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions options) : base(options)
    {
        Database.EnsureCreated();
    }

    public DbSet<UserProfile> userProfiles { get; set; }
    public DbSet<Post> posts { get; set; }
    public DbSet<PostContent> postContents { get; set; }
}