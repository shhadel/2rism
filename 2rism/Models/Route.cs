namespace _2rism.Models
{
    public class Route
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public bool Saved { get; set; }
        public int UserID { get; set; }
        public bool IsPublic { get; set; }

        public User? User { get; set; }
    }
}
