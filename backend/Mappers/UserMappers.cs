using backend.DTOs;
using backend.Models;

namespace backend.Mappers;

public static class UserMappers
{
    public static GetUserDTO ToUserDTO(this UserProfile user)
    {
        return new GetUserDTO
        {
            Username = user.Username,
            ProfilePicture = user.ProfilePicture
        };
    }
}