namespace _2rism.Models
{
    public class Street
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public int CityID { get; set; }

        public City? City { get; set; }
    }
}
