using backend.Data;
using backend.Interfaces.Repositories;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories;

public class GameRepository(ApplicationDbContext context) : IGameRepository
{
    public async Task<IEnumerable<Game>> GetAllGamesAsync()
    {
        var games = await context.Games.ToListAsync();
        return games;
    }

    public async Task AddGame(Game game)
    {
        context.Games.Add(game);
        await context.SaveChangesAsync();
    }
}