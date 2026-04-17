using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/init-keycloak")]
public class KeycloakController : ControllerBase
{
    private readonly IKeycloakService _keycloakService;

    public KeycloakController(IKeycloakService keycloakService)
    {
        _keycloakService = keycloakService;
    }

    [HttpGet]
    public async Task<IResult> GetAllUsers()
    {
        var users = await _keycloakService.GetAllUsersAsync();

        return TypedResults.Ok(users);
    }
}