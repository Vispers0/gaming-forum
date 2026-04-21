using backend.Models;

namespace backend.Interfaces.Repositories;

public interface IUserRepository
{
    public Task<UserProfile> GetUserAsync(Guid userId);
}