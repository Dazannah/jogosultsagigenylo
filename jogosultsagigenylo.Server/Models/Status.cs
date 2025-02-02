using System.ComponentModel.DataAnnotations;

namespace jogosultsagigenylo.Server.Models {
	public class Status {
		[Key]
		public int Id { get; set; }
		public required string Name { get; set; }
		public required string DisplayName { get; set; }
	}
}
