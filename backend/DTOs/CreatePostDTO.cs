using System.ComponentModel.DataAnnotations;
using backend.Enums;
using backend.Models;

namespace backend.DTOs;

public class CreatePostDTO
{
    [Required]
    public Guid AuthorId { get; set; }
    public string GameTag { get; set; }
    [Required]
    public PostContent PostContent { get; set; }
}