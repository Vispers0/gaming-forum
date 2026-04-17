using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Configuration;

using Models;

public class PostConfiguration : IEntityTypeConfiguration<Post>
{
    public void Configure(EntityTypeBuilder<Post> builder)
    {
        builder.HasKey(post => post.Guid);

        builder.HasOne<UserProfile>()
            .WithMany()
            .HasForeignKey(post => post.AuthorId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}