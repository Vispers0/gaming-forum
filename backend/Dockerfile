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
USER root
RUN apt-get update && apt-get install -y libgssapi-krb5-2 && rm -rf /var/lib/apt/lists/*
USER app
WORKDIR /app
ENV ASPNETCORE_HTTP_PORTS=5001
EXPOSE 5001
COPY --from=publish /app/publish .
ENTRYPOINT [ "dotnet", "backend.dll" ]