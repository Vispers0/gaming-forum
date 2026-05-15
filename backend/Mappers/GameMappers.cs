using backend.DTOs;
using backend.Models;

namespace backend.Mappers;

public static class GameMappers
{
    public static Game ToGame(this AddGameDTO gameDto)
    {
        return new Game
        {
            Guid = Guid.NewGuid(),
            Name = gameDto.Name,
            Cover = gameDto.Cover
        };
    }

    public static GetGameDTO ToGetGameDTO(this Game game)
    {
        return new GetGameDTO
        {
            Name = game.Name,
            Cover = game.Cover
        };
    }
}