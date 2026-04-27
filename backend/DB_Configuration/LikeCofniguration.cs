using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Configuration;

public class LikeConfiguration : IEntityTypeConfiguration<Like>
{
    public void Configure(EntityTypeBuilder<Like> builder)
    {
        builder.HasKey(like => like.Guid);

        builder.HasOne<UserProfile>()
        .WithMany()
        .HasForeignKey(like => like.UserId)
        .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne<Post>()
        .WithMany()
        .HasForeignKey(like => like.PostId)
        .OnDelete(DeleteBehavior.Cascade);
    }
}