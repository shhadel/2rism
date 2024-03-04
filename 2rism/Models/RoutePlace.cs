using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace _2rism.Models
{
    public class RoutePlace
    {
        [ForeignKey("RouteID")]
        public int RouteID { get; set; }
        [ForeignKey("PlaceID")]
        public int PlaceID { get; set; }
        [Key]
        public int ID { get; set; }

        public Route? Route { get; set; }
        public Place Place { get; set; }
    }
}
