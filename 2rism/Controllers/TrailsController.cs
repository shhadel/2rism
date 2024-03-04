using _2rism.Context;
using _2rism.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System.Linq;

namespace _2rism.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TrailsController : ControllerBase
    {
        private readonly ApiContext context;

        public TrailsController(ApiContext _context)
        {
            context = _context;
        }

        [HttpPost("Add")]
        public IActionResult Add([FromBody] AddRouteRequest request)
        {
            Models.Route route = new Models.Route
            {
                Name = request.Name,
                Saved = true,
                UserID = request.UserId,
                IsPublic = request.IsPublic
            };

            context.Route.Add(route);
            context.SaveChanges();

            foreach (int placeId in request.PlacesIds)
            {
                RoutePlace routePlace = new RoutePlace
                {
                    RouteID = route.ID,
                    PlaceID = placeId
                };

                context.RoutePlace.Add(routePlace);
            }

            context.SaveChanges();

            return new JsonResult(route); // Возвращаем созданный маршрут
        }

        [HttpGet("GetAll")]
        public JsonResult GetAll(int? cityid)
        {
            if (cityid != null)
            {
                var streets = context.Street.Where(x => x.CityID == cityid).ToList();
                var placesinthiscity = new List<Place>();

                foreach (var place in context.Place.ToList())
                {
                    foreach (var street in streets)
                    {
                        if (place.StreetID == street.ID)
                        {
                            placesinthiscity.Add(place);
                        }
                    }
                }

                var routeplacesinthiscity = new List<RoutePlace>();
                foreach (var routeplace in context.RoutePlace.ToList())
                {
                    foreach (var place in placesinthiscity)
                    {
                        if (routeplace.PlaceID == place.Id)
                        {
                            routeplacesinthiscity.Add(routeplace);
                        }
                    }
                }

                var routesinthiscity = new List<Models.Route>();
                foreach (var route in context.Route.ToList())
                {
                    foreach (var routeplace in routeplacesinthiscity)
                    {
                        if (route.ID == routeplace.RouteID)
                        {
                            routesinthiscity.Add(route);
                        }
                    }
                }

                // Для хранения уникальных значений используем HashSet
                HashSet<Models.Route> uniqueRoutes = new HashSet<Models.Route>(routesinthiscity);

                // Преобразуем обратно в список, если это необходимо
                List<Models.Route> uniqueRoutesList = uniqueRoutes.ToList();

                return new JsonResult(Ok(uniqueRoutesList));
            }
            else
            {
                var routes = context.Route.Where(x => x.IsPublic == true).ToList();
                return new JsonResult(Ok(routes));
            }
            
        }

        [HttpGet("GetSaved/{userid}")]
        public JsonResult GetSaved(int userid)
        {
            var routes = context.Route.Where(x => x.UserID == userid).ToList();
            return new JsonResult(Ok(routes));
        }

        [HttpGet("GetRouteLocation/{routeid}")]
        public JsonResult GetRouteLocation(int routeid)
        {
            var routplace = context.RoutePlace.First(x => x.RouteID == routeid);
            var place = context.Place.First(x => x.Id == routplace.PlaceID);
            var street = context.Street.First(x => x.ID == place.StreetID);
            var city = context.City.First(x => x.ID == street.CityID);
            var country = context.Country.First(x => x.ID == city.CountryID);
            return new JsonResult(Ok(country.Name + ", " + city.Name));
        }

        [HttpGet("GetById/{routeid}")]
        public JsonResult GetById(int routeid)
        {
            var route = context.Route.First(x => x.ID == routeid);
            return new JsonResult(Ok(route));
        }
    }

    public class AddRouteRequest
    {
        public string Name { get; set; }
        public int UserId { get; set; }
        public bool IsPublic { get; set; }
        public int[] PlacesIds { get; set; }
    }
}
