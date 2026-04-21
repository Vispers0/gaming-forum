using backend.DTOs;
using backend.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/users")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    [Route("{userID}")]
    public async Task<IResult> GetUser([FromRoute] Guid userID)
    {
        try
        {
            GetUserDTO userDTO = await _userService.GetUser(userID);
            return TypedResults.Ok(userDTO);
        }
        catch (KeyNotFoundException)
        {
            return TypedResults.NotFound();
        }
    }
}