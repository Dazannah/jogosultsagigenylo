﻿using jogosultsagigenylo.Server.Models;
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

			modelBuilder.Entity<AuthItem>()
				.HasMany(ai => ai.SubAuthItems)
				.WithOne()
				.HasForeignKey(sai => sai.AuthItemId)
				.IsRequired()
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
					new Location { Id = 5, DisplayName = "Egyéb" }
				);

			base.OnModelCreating(modelBuilder);
		}

		public DbSet<AuthItem> AuthItems { get; set; }
		public DbSet<Column> Columns { get; set; }
		public DbSet<Status> Status { get; set; }
		public DbSet<Department> Departments { get; set; }
		public DbSet<Location> Locations { get; set; }
		public DbSet<SubAuthItem> SubAuthItems { get; set; }
	}
}
