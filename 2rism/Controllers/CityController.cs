using _2rism.Context;
using _2rism.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace _2rism.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CityController : ControllerBase
    {
        private readonly ApiContext context;
        public CityController(ApiContext _context)
        {
            context = _context;
        }

        [HttpGet("GetCitiesWithCountries")]
        public JsonResult GetCitiesWithCountries()
        {
            var cities = context.City.ToList();
            var countries = context.Country.ToList();

            var result = new List<object>();

            foreach (var country in countries)
            {
                var citiesInCountry = cities.Where(c => c.CountryID == country.ID)
                                            .Select(c => new { Id = c.ID, Name = c.Name });

                if (citiesInCountry.Any())
                {
                    result.Add(new { Country = country.Name, Cities = citiesInCountry });
                }
            }

            return new JsonResult( Ok(result));
        }

        [HttpGet("GetCityNameById/{cityid}")]
        public JsonResult GetCityNameById(int cityid)
        {
            var city = context.City.First(x => x.ID == cityid);
            return new JsonResult(Ok(city.Name));
        }

        [HttpGet("GetCityId/{placeid}")]
        public JsonResult GetCityId(int placeid)
        {
            var place = context.Place.First(x => x.Id == placeid);
            var street = context.Street.First(x => x.ID == place.StreetID);
            var city = context.City.First(x => x.ID == street.CityID);
            return new JsonResult(Ok(city.ID));
        }
    }
}
