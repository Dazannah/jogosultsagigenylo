using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace jogosultsagigenylo.Server.Models {
	public class Department {
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int Id { get; set; }
		public required string ClassNumber { get; set; }
		public required string DisplayName { get; set; }
		public required string Location { get; set; }
		public required string Category { get; set; }
	}
}
