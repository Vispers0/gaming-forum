using backend.DTOs;
using backend.Interfaces.Repositories;
using backend.Interfaces.Services;
using backend.Mappers;

namespace backend.Services;

public class GameService(IGameRepository gameRepository) : IGameService
{
    public IEnumerable<GetGameDTO> GetAllGames()
    {
        var games = gameRepository.GetAllGamesAsync().Result;
        var gamesDtos = new List<GetGameDTO>();

        foreach (var game in games)
        {
            gamesDtos.Add(game.ToGetGameDTO());
        }

        return gamesDtos;
    }

    public void AddGame(AddGameDTO gameDto)
    {
        var gameToAdd = gameDto.ToGame();
        try
        {
            gameRepository.AddGame(gameToAdd);
        }
        catch (InvalidOperationException e)
        {
            throw new InvalidOperationException(e.Message, e);
        }
    }
}