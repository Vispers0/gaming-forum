namespace backend;

using Data;
using Interfaces.Repositories;
using Repositories;
using Interfaces.Services;
using Services;
using Microsoft.EntityFrameworkCore;
using DotNetEnv;
using Npgsql.EntityFrameworkCore.PostgreSQL;

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

        builder.Services.AddControllers();

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

        builder.Services.AddHostedService<KeycloakSyncService>();

        builder.Services.AddScoped<IUserRepository, UserRepository>();
        builder.Services.AddScoped<IUserService, UserService>();
        builder.Services.AddScoped<IPostRepository, PostRepository>();
        builder.Services.AddScoped<IPostService, PostService>();
        builder.Services.AddScoped<IKeycloakService, KeycloakService>();

        builder.Services.AddCors(options =>
{
            options.AddPolicy("AllowFrontend", policy =>
            {
                policy.WithOrigins("http://localhost:8083")
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials();
            });
        });

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();
        }

        // using (var scope = app.Services.CreateScope())
        // {
        //     System.Diagnostics.Process.Start("bash", "dotnet ef migrations add InitialMigration");

        //     var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        //     context.Database.MigrateAsync();
        // }

        app.UseCors("AllowFrontend");   

        app.UseRouting();

        app.MapControllers();

        app.UseHttpsRedirection();

        app.UseAuthorization();

        app.Run();
    }
}
