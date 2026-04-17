using Keycloak.ApiClient.Net;
using backend.Interfaces.Services;
using Keycloak.ApiClient.Net.Models.Users;
using Microsoft.AspNetCore.Identity;
using System.Text.Json;

namespace backend.Services;

public class KeycloakService : IKeycloakService
{
    private readonly KeycloakClient _keycloakClient;
    private readonly string _realm;
    private readonly HttpClient _httpClient;
    private readonly string _baseUrl;
    private readonly string _clientId;
    private readonly string _clientSecret;

    public KeycloakService(IConfiguration configuration)
    {
        var keycloakSettings = configuration.GetSection("keycloak");
        _realm = keycloakSettings["realm"];
        _baseUrl = keycloakSettings["BaseUrl"];
        _clientId = keycloakSettings["ClientId"];
        _clientSecret = keycloakSettings["ClientSecret"];
        _httpClient = new HttpClient();

        _keycloakClient = new KeycloakClient(_baseUrl, GetAccessToken);
    }

    private string GetAccessToken()
    {
        return GetAccessTokenAsync().GetAwaiter().GetResult();
    }

    private async Task<string> GetAccessTokenAsync()
    {
        var tokenRequest = new HttpRequestMessage(HttpMethod.Post, $"{_baseUrl}/realms/{_realm}/protocol/openid-connect/token");
        var parameters = new Dictionary<string, string>
        {
            ["client_id"] = _clientId,
            ["client_secret"] = _clientSecret,
            ["grant_type"] = "client_credentials"
        };

        tokenRequest.Content = new FormUrlEncodedContent(parameters);

        var response = await _httpClient.SendAsync(tokenRequest);
        
        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync();
            throw new HttpRequestException($"Failed to get token: {response.StatusCode} - {error}");
        }
        
        var json = await response.Content.ReadAsStringAsync();

        var options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower
        };

        var tokenResponse = JsonSerializer.Deserialize<TokenResponse>(json, options);

        return tokenResponse.AccessToken;
    }

    public async Task<List<User>> GetAllUsersAsync()
    {
        var users = await _keycloakClient.GetUsersAsync(_realm);
        return users.ToList();
    }
}

public class TokenResponse
{
    public string AccessToken { get; set; } = string.Empty;
    public int ExpiresIn { get; set; }
}