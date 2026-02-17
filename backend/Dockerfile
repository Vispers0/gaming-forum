FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Восстановление зависимостей
COPY ["backend.csproj", "Backend/"]
RUN dotnet restore "Backend/backend.csproj"

# Сборка
COPY . ["Backend/"]
RUN dotnet build 'Backend/backend.csproj' -c Release -o /app/build

# Публикация
FROM build AS publish
WORKDIR /src/Backend
RUN dotnet publish 'backend.csproj' -c Release -o /app/publish

# Запуск
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT [ "dotnet", "backend.dll" ]
ENV ASPNETCORE_HTTP_PORTS=5001
EXPOSE 5001