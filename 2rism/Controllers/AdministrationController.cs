using Microsoft.AspNetCore.Mvc;

namespace _2rism.Controllers
{
    public class AdministrationController : Controller
    {
        public IActionResult Index() => View();
        public IActionResult AddPlace() => PartialView("AddPlace");
        public IActionResult Place(int placeid)
        {
            ViewBag.PlaceId = placeid; 
            return View();
        }
        public IActionResult EditPlace() => PartialView("EditPlace");
    }
}
