using _2rism.Context;
using _2rism.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace _2rism.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlaceController : ControllerBase
    {
        private readonly ApiContext context;

        public PlaceController(ApiContext _context)
        {
            context = _context;
        }

        [HttpGet("GetAll")]
        public JsonResult GetAll()
        {
            var places = context.Place.OrderBy(x => x.Id).ToList();
            return new JsonResult(Ok(places));
        }

        [HttpGet("GetCityName/{placeid}")]
        public JsonResult GetCityName(int placeid)
        {
            var place = context.Place.First(x => x.Id == placeid);
            if (place != null)
            {
                var street = context.Street.First(x => x.ID == place.StreetID);
                var city = context.City.First(x => x.ID == street.CityID);

                return new JsonResult(Ok(city.Name));
            }
            return new JsonResult(NotFound());
        }

        [HttpGet("GetCountryName/{placeid}")]
        public JsonResult GetCountryName(int placeid)
        {
            var place = context.Place.First(x => x.Id == placeid);
            if (place != null)
            {
                var street = context.Street.First(x => x.ID == place.StreetID);
                var city = context.City.First(x => x.ID == street.CityID);
                var country = context.Country.First(x => x.ID == city.CountryID);

                return new JsonResult(Ok(country.Name));
            }
            return new JsonResult(NotFound());
        }

        [HttpGet("GetNames")]
        public JsonResult GetNames(int cityid)
        {
            List<Tuple<int, string>> placename = new List<Tuple<int, string>>();

            var streets = context.Street.Where(x => x.CityID == cityid);
            
            foreach (var place in context.Place.ToList())
            {
                foreach (var street in streets)
                {
                    if (place.StreetID == street.ID)
                    {
                        placename.Add(new Tuple<int, string>(place.Id, place.Name));
                    }
                }
            }

            return new JsonResult(Ok(placename));
        }

        [HttpGet("GetById/{placeid}")]
        public JsonResult GetById(int placeid)
        {
            var place = context.Place.FirstOrDefault(x => x.Id == placeid);
            return new JsonResult(Ok(place));
        }

        [HttpGet("GetLocation/{placeid}")]
        public JsonResult GetLocation(int placeid) 
        {
            var place = context.Place.First(x => x.Id == placeid);

            string result = context.Country.First(v => v.ID == context.City.First(c => c.ID == context.Street.First(x => x.ID == place.StreetID).CityID).CountryID).Name + ", " + context.City.First(c => c.ID == context.Street.First(x => x.ID == place.StreetID).CityID).Name + ", " + context.Street.First(x => x.ID == place.StreetID).Name + ", " + place.House;
            return new JsonResult(Ok(result));
        }

        [HttpPost("Add/{name}/{description}/{cityid}/{street}/{house}")]
        public JsonResult Add(string name, string description, int cityid, string street, int house, string imageurl)
        {
            var streetavailable = context.Street.First(x => x.CityID == cityid && x.Name == street);
            if (streetavailable != null)
            {
                Place place = new()
                {
                    Name = name,
                    House = house,
                    StreetID = streetavailable.ID,
                    CategoryID = 1,
                    Description = description,
                    ImageURL = imageurl
                };

                context.Place.Add(place);
                context.SaveChanges();
            }
            else
            {
                var newstreet = new Street()
                {
                    Name = street,
                    CityID = cityid
                };

                context.Street.Add(newstreet);
                context.SaveChanges();

                Place place = new()
                {
                    Name = name,
                    House = house,
                    StreetID = newstreet.ID,
                    CategoryID = 1,
                    Description = description,
                    ImageURL = imageurl
                };

                context.Place.Add(place);
                context.SaveChanges();
            }

            return new JsonResult(Ok());
        }

        [HttpPost("Edit/{placeid}/{name}/{description}/{cityid}/{street}/{house}")]
        public JsonResult Edit(int placeid, string name, string description, int cityid, string street, int house, string imageurl)
        {
            var place = context.Place.First(x => x.Id == placeid);

            place.Name = name;
            place.House = house;
            place.CategoryID = 1;
            place.Description = description;
            place.ImageURL = imageurl;

            var streetavailable = context.Street.First(x => x.CityID == cityid && x.Name == street);
            if (streetavailable != null)
            {
                place.StreetID = streetavailable.ID;

                context.Place.Update(place);
                context.SaveChanges();
            }
            else
            {
                var newstreet = new Street()
                {
                    Name = street,
                    CityID = cityid
                };

                context.Street.Add(newstreet);
                context.SaveChanges();

                place.StreetID = newstreet.ID;

                context.Place.Add(place);
                context.SaveChanges();
            }

            return new JsonResult(Ok());
        }

        [HttpGet("GetStreetName/{placeid}")]
        public JsonResult GetStreetName(int placeid)
        {
            var place = context.Place.First(x => x.Id == placeid);
            string placestreet = context.Street.First(x => x.ID == place.StreetID).Name;
            return new JsonResult(Ok(placestreet));
        }
    }
}
