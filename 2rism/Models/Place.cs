using System.ComponentModel.DataAnnotations;

namespace _2rism.Models
{
    public class Place
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int House { get; set; }
        public int StreetID { get; set; }
        public int CategoryID { get; set; }
        public string Description { get; set; }
        public string ImageURL { get; set; }

        public Street? Street { get; set; }
        public Category? Category { get; set; }
    }
}
