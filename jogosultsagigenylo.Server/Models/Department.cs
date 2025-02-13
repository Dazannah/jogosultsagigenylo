using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace jogosultsagigenylo.Server.Models {
	public class Department {
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int Id { get; set; }
		public required string ClassNumber { get; set; }
		public required string DisplayName { get; set; }

		public required int LocationId { get; set; }
		[ForeignKey("LocationId")]
		public Location Location { get; set; }
		public required string Category { get; set; }
	}
}
