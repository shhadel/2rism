using _2rism.Context;
using _2rism.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace _2rism.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoutePlaceController : ControllerBase
    {
        private readonly ApiContext context;
        public RoutePlaceController(ApiContext _context)
        {
            context = _context;
        }

        [HttpGet("GetPlacesStringByRouteId/{routeid}")]
        public JsonResult GetPlacesStringByRouteId(int routeid)
        {
            var route_places = context.RoutePlace.Where(x => x.RouteID == routeid).ToList();

            var places = route_places.Select(place => context.Place.First(x => x.Id == place.PlaceID).Name);
            var result = string.Join(" -> ", places);

            return new JsonResult(Ok(result));
        }

        [HttpGet("GetPlacesIdsByRoute/{routeid}")]
        public JsonResult GetPlacesIdsByRoute(int routeid)
        {
            var route_places = context.RoutePlace.Where(x => x.RouteID == routeid).ToList();
            List<Place> places = new List<Place>();

            foreach(var rp in route_places)
            {
                var place = context.Place.First(x => x.Id == rp.PlaceID);
                places.Add(place);
            }

            return new JsonResult(Ok(places.Select(x => x.Id).ToList()));
        }
    }
}
