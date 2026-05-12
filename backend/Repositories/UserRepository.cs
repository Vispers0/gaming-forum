using backend.Data;
using backend.DTOs;
using backend.Interfaces.Repositories;
using backend.Mappers;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories;

public class UserRepository : IUserRepository
{
    private readonly ApplicationDbContext _context;

    public UserRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<UserProfile> GetUserAsync(Guid userId)
    {
        UserProfile? user = await _context.userProfiles.FirstOrDefaultAsync(u => u.guid == userId);

        if (user is null)
        {
            throw new KeyNotFoundException();
        }

        return user;
    }

    public async Task UpdateUserAsync(Guid userId, UpdateUserDTO user)
    {
        UserProfile? userToUpdate = await _context.userProfiles.FirstOrDefaultAsync(u => u.guid == userId);

        if (userToUpdate is null)
        {
            throw new KeyNotFoundException();
        }
        
        userToUpdate.ProfilePicture = user.ProfilePicture;
        
        await _context.SaveChangesAsync();
    }
}