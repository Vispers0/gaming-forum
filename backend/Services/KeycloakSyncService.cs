
using backend.Data;
using backend.Models;
using Keycloak.ApiClient.Net.Models.Users;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class KeycloakSyncService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<KeycloakSyncService> _logger;

    public KeycloakSyncService(IServiceProvider serviceProvider, ILogger<KeycloakSyncService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await Task.Delay(5000, stoppingToken);

        using var scope = _serviceProvider.CreateScope();
        var keycloakService = scope.ServiceProvider.GetRequiredService<IKeycloakService>();
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        try
        {
            _logger.LogInformation("Starting keycloak user sync...");

            var users = await keycloakService.GetAllUsersAsync();

            foreach (var user in users)
            {
                Guid userGuid = Guid.Parse(user.Id);

                var existingUser = await dbContext.userProfiles.FirstOrDefaultAsync(u => u.guid == userGuid, stoppingToken);

                if (existingUser == null)
                {
                    UserProfile userProfile = new UserProfile
                    {
                        guid = userGuid,
                        Username = user.Username
                    };

                    await dbContext.userProfiles.AddAsync(userProfile);
                    _logger.LogInformation($"Added user {userProfile.Username}. GUID: {userProfile.guid}");
                }
                else
                {
                    _logger.LogInformation($"User {user.Username} already exists.");
                }
            }

            await dbContext.SaveChangesAsync(stoppingToken);
            _logger.LogInformation($"Sync completed. Processed {users.Count} users.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occured dyring keycloak user sync");
        }
    }
}