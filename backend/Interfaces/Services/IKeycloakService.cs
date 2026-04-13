using Keycloak.ApiClient.Net.Models.Users;

public interface IKeycloakService
{
    Task<List<User>> GetAllUsersAsync();
}