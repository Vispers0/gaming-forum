using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Configuration;

using Models;

public class PostContentConfiguration : IEntityTypeConfiguration<PostContent>
{
    public void Configure(EntityTypeBuilder<PostContent> builder)
    {
        builder.HasKey(postContent => postContent.guid);
    }
}