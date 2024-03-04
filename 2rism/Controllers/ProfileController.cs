using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;

namespace _2rism.Controllers
{
    public class ProfileController : Controller
    {
        public IActionResult Index() => View();
        public IActionResult Edit(int userid)
        {
            return PartialView("Edit");
        }
    }
}
