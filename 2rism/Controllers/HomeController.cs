using Microsoft.AspNetCore.Mvc;

namespace _2rism.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index() => View();
    }
}
