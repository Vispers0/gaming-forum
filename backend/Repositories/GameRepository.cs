using backend.Data;
using backend.Interfaces.Repositories;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories;

public class GameRepository(ApplicationDbContext context) : IGameRepository
{
    public async Task<IEnumerable<Game>> GetAllGamesAsync()
    {
        var games = await context.Games
            .OrderBy(x => x.Name)
            .ToListAsync();
        return games;
    }

    public Task AddGame(Game game)
    {
        if (!context.Games.Any(x => x.Name == game.Name))
        {
            context.Games.Add(game);
            context.SaveChanges();
        }
        else
        {
            throw new InvalidOperationException("Game already exists");
        }
        
        return Task.CompletedTask;
    }
}