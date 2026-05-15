using backend.DTOs;
using backend.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/games")]
public class GameController(IGameService gameService) : ControllerBase
{
    [HttpGet]
    public IResult GetAllGames()
    {
        var games = gameService.GetAllGames().ToList();

        if (!games.Any())
        {
            return TypedResults.NoContent();
        }

        return TypedResults.Ok(games);
    }

    [HttpPost]
    public IResult AddGame([FromBody] AddGameDTO gameDto)
    {
        gameService.AddGame(gameDto);
        return TypedResults.Created();
    }
}