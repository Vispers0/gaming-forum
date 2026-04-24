using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Configuration;

public class CommentConfiguration : IEntityTypeConfiguration<Comment>
{

    public void Configure(EntityTypeBuilder<Comment> builder)
    {
        builder.HasKey(comment => comment.Guid);

        builder.HasOne<UserProfile>()
        .WithMany()
        .HasForeignKey(comment => comment.AuthorId)
        .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne<Post>()
        .WithMany()
        .HasForeignKey(comment => comment.PostId)
        .OnDelete(DeleteBehavior.Cascade);
    }
}