using backend.DTOs;
using backend.Models;

namespace backend.Interfaces.Repositories;

public interface IGameRepository
{
    public Task<IEnumerable<Game>> GetAllGamesAsync();
    public Task AddGame(Game game);
}