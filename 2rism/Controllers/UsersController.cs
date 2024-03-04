using _2rism.Context;
using _2rism.Models;
using events;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace _2rism.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApiContext context;
        private readonly IConfiguration configuration;
        private readonly IWebHostEnvironment hostEnvironment;
        public UsersController(ApiContext _context, IConfiguration _configuration, IWebHostEnvironment _hostEnvironment) 
        {
            context = _context;
            configuration = _configuration;
            hostEnvironment = _hostEnvironment;
        }

        [HttpGet("GetAll")]
        public JsonResult GetAll() => new(Ok(context.User.ToList()));

        [HttpPost("SendEmailForLogon/{email}")]
        public JsonResult SendEmailForLogon(string email)
        {
            if (context.User.Single(x => x.Email == email) != null)
            {
                int code = ProjectManager.GenerateRecoveryCode();
                ProjectManager.SendEmail(email, "Авторизация", $"Ваш код: {code}");
                return new JsonResult(Ok(email));
            }
            else
                return new JsonResult(NotFound());
        }

        [HttpGet("GetCode")]
        public JsonResult GetCode()
        {
            return new JsonResult(Ok(ProjectManager.code));
        }

        [HttpPost("AddCookie/{email}")]
        public JsonResult AddCookie(string email)
        {
            var user = context.User.SingleOrDefault(q => q.Email == email);
            if (user != null)
            {
                var jwtConfig = configuration.GetSection("JwtConfig").Get<JwtConfig>();
                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, user.RoleID.ToString())
                };
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(jwtConfig.Secret);
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new[]
                    {
                        new Claim("userId", user.Id.ToString()),
                        new Claim("email", user.Email),
                        new Claim("role", user.RoleID.ToString())
                    }),
                    Expires = DateTime.UtcNow.AddMinutes(jwtConfig.ExpirationInMinutes),
                    NotBefore = DateTime.UtcNow,
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };
                var token = tokenHandler.CreateToken(tokenDescriptor);
                Response.Cookies.Append(jwtConfig.CookieName, tokenHandler.WriteToken(token), new CookieOptions
                {
                    HttpOnly = true,
                    Expires = DateTime.UtcNow.AddMinutes(jwtConfig.ExpirationInMinutes)
                });

                return new JsonResult(Ok(user));
            }
            else
                return new JsonResult(BadRequest());
        }

        [HttpGet("Get/{email}/{password}")]
        public JsonResult Get(string email, string password) 
        {
            var user = context.User.Single(x => x.Email == email && x.Password == ProjectManager.GetHash(password));
            if (user != null)
                return new JsonResult(Ok(user));
            else
                return new JsonResult(NotFound());
        }

        [HttpPost("Register/{email}/{password}/{name}/{surname}")]
        public async Task<JsonResult> Register(string email, string password, string name, string surname)
        {
            User user = new()
            {
                Email = email,
                Password = ProjectManager.GetHash(password),
                Name = name,
                Surname = surname,
                RoleID = 1,
                StatusID = 1
            };

            var entry = context.User.Add(user);
            await context.SaveChangesAsync();
            return new JsonResult(Ok(entry.Entity));
        }

        [HttpGet("GetCurrentUser")]
        public JsonResult GetCurrentUser()
        {
            string? jwtToken = Request.Cookies["2rism"];
            if (!string.IsNullOrEmpty(jwtToken))
            {
                var jwt = Request.Cookies["2rism"];
                var handler = new JwtSecurityTokenHandler();
                var token = handler.ReadJwtToken(jwt);
                var userId = token.Claims.First(c => c.Type == "userId").Value;

                var user = context.User.First(x => x.Id == int.Parse(userId));
                return new JsonResult(Ok(user));
            }
            return new JsonResult(NotFound());
        }

        [HttpPut("Update/{surname}/{name}/{patronymic}")]
        public JsonResult Update(string surname, string name, string patronymic)
        {
            string? jwtToken = Request.Cookies["2rism"];
            if (!string.IsNullOrEmpty(jwtToken))
            {
                var jwt = Request.Cookies["2rism"];
                var handler = new JwtSecurityTokenHandler();
                var token = handler.ReadJwtToken(jwt);
                var userId = token.Claims.First(c => c.Type == "userId").Value;

                var user = context.User.First(x => x.Id == int.Parse(userId));

                user.Surname = surname;
                user.Name = name;
                user.Patronymic = patronymic;

                context.User.Update(user);
                context.SaveChanges();

                return new JsonResult(Ok(user));
            }
            return new JsonResult(NotFound());
        }

        [HttpPost("UpdatePhoto/{userid}")]
        public async Task<IActionResult> UpdatePhoto(int userid, IFormFile photo)
        {
            if (photo == null || photo.Length == 0)
            {
                return new JsonResult(BadRequest(500));
            }
            try
            {
                using (var memoryStream = new MemoryStream())
                {
                    var user = context.User.SingleOrDefault(q => q.Id == userid);

                    if (user == null)
                    {
                        return new JsonResult(NotFound());
                    }

                    var uploadsFolder = Path.Combine(hostEnvironment.WebRootPath, "profileimages");

                    var uniqueFileName = Guid.NewGuid().ToString() + "_" + photo.FileName;
                    var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await photo.CopyToAsync(fileStream);
                    }

                    user.Photo = uniqueFileName;
                    context.User.Update(user);
                    context.SaveChanges();

                    return new JsonResult(Ok(user));
                }
            }
            catch
            {
                return new JsonResult(BadRequest(500));
            }
        }

        [HttpGet("GetTrueOldPass/{userid}/{password}")]
        public JsonResult GetTrueOldPass(int userid, string password)
        {
            var user = context.User.First(x => x.Id == userid);

            if (user.Password == ProjectManager.GetHash(password))
                return new JsonResult(Ok(true));
            else
                return new JsonResult(Ok(false));
        }

        [HttpPut("UpdatePassword/{userid}/{password}")]
        public JsonResult UpdatePassword(int userid, string password)
        {
            var user = context.User.First(x => x.Id == userid);
            user.Password = ProjectManager.GetHash(password);

            context.User.Update(user);
            context.SaveChanges();

            return new JsonResult(Ok());
        }
    }
}
