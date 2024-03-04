using Microsoft.AspNetCore.Mvc;

namespace _2rism.Controllers
{
    public class LogonController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Authorization(string email)
        {
            ViewBag.Email = email;
            return View();
        }

        public IActionResult Registration() 
        {
            return View();
        }

        public IActionResult RegistrationContinue(string email, string name, string surname)
        {
            ViewBag.Email = email;
            ViewBag.Name = name;
            ViewBag.Surname = surname;
            return View();
        }
    }
}
