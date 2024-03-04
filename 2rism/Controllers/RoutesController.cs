using Microsoft.AspNetCore.Mvc;

namespace _2rism.Controllers
{
    public class RoutesController : Controller
    {
        public IActionResult Index(int cityid, DateTime arrivaldate, DateTime departuredate)
        {
            ViewBag.CityId = cityid; ViewBag.ArrivalDate = arrivaldate; ViewBag.DepartureDate = departuredate;
            return View();
        }

        public IActionResult Add()
        {
            return PartialView("Add");
        }

        public IActionResult Display(int routeid)
        {
            ViewBag.RouteId = routeid;
            return PartialView("Display");
        }
    }
}
