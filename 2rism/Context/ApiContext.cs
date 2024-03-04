using _2rism.Models;
using Microsoft.EntityFrameworkCore;

namespace _2rism.Context
{
    public class ApiContext : DbContext
    {
        public DbSet<Category> Category { get; set; }
        public DbSet<City> City { get; set; }
        public DbSet<Country> Country { get; set; }
        public DbSet<Place> Place { get; set; }
        public DbSet<Review> Review { get; set; }
        public DbSet<Role> Role { get; set; }
        public DbSet<Models.Route> Route { get; set; }
        public DbSet<RoutePlace> RoutePlace { get; set; }
        public DbSet<Status> Status { get; set; }
        public DbSet<Street> Street { get; set; }
        public DbSet<User> User { get; set; }

        public ApiContext(DbContextOptions<ApiContext> options): base(options)
        {
            Database.EnsureCreated();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
        }
    }
}
