using jogosultsagigenylo.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace jogosultsagigenylo.Server.Data {
	public class ApplicationDbContext : DbContext {
		public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

		protected override void OnModelCreating(ModelBuilder modelBuilder) {
			modelBuilder.Entity<AuthItem>()
				.HasOne(a => a.Column)
				.WithMany(c => c.AuthItems)
				.HasForeignKey(a => a.ColumnId)
				.OnDelete(DeleteBehavior.Cascade);

			modelBuilder.Entity<Status>().HasData(
					new Status { Id = 1, Name = "active", DisplayName = "Aktív" },
					new Status { Id = 2, Name = "inactive", DisplayName = "Inaktív" }
				);

			modelBuilder.Entity<Location>().HasData(
					new Location { Id = 1, DisplayName = "Makó" },
					new Location { Id = 2, DisplayName = "Hódmezővásárhely" },
					new Location { Id = 3, DisplayName = "Kakasszék" },
					new Location { Id = 4, DisplayName = "Központ" },
					new Location { Id = 4, DisplayName = "Egyéb" }
				);

			modelBuilder.Entity<Category>().HasData(
					new Category { Id = 1, DisplayName = "fekvőbeteg" },
					new Category { Id = 2, DisplayName = "járóbeteg" }
				);


			base.OnModelCreating(modelBuilder);
		}

		public DbSet<AuthItem> AuthItems { get; set; }
		public DbSet<Column> Columns { get; set; }
		public DbSet<Status> Status { get; set; }
		public DbSet<Department> Departments { get; set; }
		public DbSet<Location> Locations { get; set; }
		public DbSet<Category> Categories { get; set; }
	}
}
