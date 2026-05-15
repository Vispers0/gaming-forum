using backend.DTOs;
using backend.Models;

namespace backend.Interfaces.Services;

public interface IGameService
{
    public IEnumerable<GetGameDTO> GetAllGames();
    public void AddGame(AddGameDTO gameDto);
}