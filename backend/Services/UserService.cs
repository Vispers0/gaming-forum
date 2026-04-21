using backend.DTOs;
using backend.Interfaces.Repositories;
using backend.Interfaces.Services;
using backend.Mappers;
using backend.Models;

namespace backend.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;

    public UserService (IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<GetUserDTO> GetUser(Guid userId)
    {
        UserProfile user = await _userRepository.GetUserAsync(userId);
        return user.ToUserDTO();
    }
}