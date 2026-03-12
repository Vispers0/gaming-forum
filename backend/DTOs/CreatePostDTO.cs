using System.ComponentModel.DataAnnotations;
using backend.Enums;
using backend.Models;
using Microsoft.AspNetCore.SignalR;

namespace backend.DTOs;

public class CreatePostDTO
{
    [Required]
    public UserProfile Author { get; set; }
    [Required]
    public PostType PostType { get; set; }
    public PostContent PostContent { get; set; }
}