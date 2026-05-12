using backend.DTOs;

namespace backend.Interfaces.Services;

public interface IUserService
{
    public Task<GetUserDTO> GetUser(Guid userId);
    public Task UpdateUser(Guid guid, UpdateUserDTO user);
}
