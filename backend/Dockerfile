FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Восстановление зависимостей
COPY ["backend.csproj", "Backend/"]
WORKDIR /src/Backend
RUN dotnet restore "backend.csproj"

# Сборка
COPY . .
RUN dotnet build "backend.csproj" -c Release -o /app/build

# Публикация
FROM build AS publish
WORKDIR /src/Backend
RUN dotnet publish 'backend.csproj' -c Release -o /app/publish

# Запуск
FROM mcr.microsoft.com/dotnet/aspnet:9.0
ENV ASPNETCORE_HTTP_PORTS=5001
EXPOSE 5001
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT [ "dotnet", "backend.dll" ]