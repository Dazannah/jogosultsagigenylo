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

			base.OnModelCreating(modelBuilder);
		}

		public DbSet<AuthItem> AuthItems { get; set; }
		public DbSet<Column> Columns { get; set; }
		public DbSet<Status> Status { get; set; }
		public DbSet<Department> Departments { get; set; }
	}
}
