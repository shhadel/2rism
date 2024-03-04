namespace _2rism.Models
{
    public class Review
    {
        public int ID { get; set; }
        public int PlaceID { get; set; }
        public int UserID { get; set; }
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public bool IsChecked { get; set; }

        public Place? Place { get; set; }
        public User? User { get; set; }
    }
}
