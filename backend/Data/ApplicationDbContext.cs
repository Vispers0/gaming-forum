using Microsoft.EntityFrameworkCore;

namespace backend.Data;

using Models;
using Configuration;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions options) : base(options)
    {
        // Database.EnsureDeleted();
        Database.EnsureCreated();
    }

    public DbSet<UserProfile> userProfiles { get; set; }
    public DbSet<Post> posts { get; set; }
    public DbSet<PostContent> postContents { get; set; }
    public DbSet<Comment> Comments{ get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfiguration(new PostConfiguration());
        modelBuilder.ApplyConfiguration(new PostContentConfiguration());
        modelBuilder.ApplyConfiguration(new UserProfileConfiguration());
        modelBuilder.ApplyConfiguration(new CommentConfiguration());
    }
}