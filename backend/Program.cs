using DotNetEnv;
using Npgsql.EntityFrameworkCore.PostgreSQL;

namespace backend;

using Data;
using Microsoft.EntityFrameworkCore;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        Env.Load();

        builder.Services.AddDbContext<ApplicationDbContext>(options =>
        {
            options.UseNpgsql(
                $"User ID={Env.GetString("DB_USER")};" +
                $"Password={Env.GetString("DB_PASSWORD")};" +
                $"Host={Env.GetString("DB_HOST")};" +
                $"Port={Env.GetString("DB_PORT")};" +
                $"Database={Env.GetString("DB_NAME")}"
            );
        });

        // Add services to the container.
        builder.Services.AddAuthorization();

        builder.Services.AddAuthentication()
            .AddJwtBearer(options =>
            {
                options.Authority = "http://localhost:8081/realms/gaming-forum";
                options.Audience = "gaming-forum-api";
                options.RequireHttpsMetadata = false;
            });

        builder.Services.AddAuthorizationBuilder();

        // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
        builder.Services.AddOpenApi();

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();
        }

        using (var scope = app.Services.CreateScope())
        {
            System.Diagnostics.Process.Start("bash", "dotnet ef migrations add InitialMigration");

            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            context.Database.MigrateAsync();
        }

        app.UseHttpsRedirection();

        app.UseAuthorization();

        var summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        app.MapGet("/weatherforecast", (HttpContext httpContext) =>
        {
            var forecast =  Enumerable.Range(1, 5).Select(index =>
                new WeatherForecast
                {
                    Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                    TemperatureC = Random.Shared.Next(-20, 55),
                    Summary = summaries[Random.Shared.Next(summaries.Length)]
                })
                .ToArray();
            return forecast;
        })
        .WithName("GetWeatherForecast");

        app.Run();
    }
}
