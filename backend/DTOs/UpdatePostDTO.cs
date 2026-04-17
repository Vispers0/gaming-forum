using System.ComponentModel.DataAnnotations;
using backend.Enums;
using backend.Models;

namespace backend.DTOs;

public class UpdatePostDTO
{
    [Required]
    public PostContent PostContent { get; set; }
}