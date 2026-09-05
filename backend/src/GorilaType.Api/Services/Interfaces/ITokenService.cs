using GorilaType.Api.Models.Entities;

namespace GorilaType.Api.Services.Interfaces;

public interface ITokenService
{
    string GenerateAccessToken(User user);
}
