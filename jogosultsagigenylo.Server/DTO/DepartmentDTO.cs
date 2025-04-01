using jogosultsagigenylo.Server.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace jogosultsagigenylo.Server.DTO {
	public class DepartmentDTO {
		[Key]
		public int Id { get; set; }
		public string? DepartmentNumber { get; set; }
		public string? DepartmentNumber2 { get; set; }
		[Required(AllowEmptyStrings = false, ErrorMessage = "Elnevezés nem megfelelő.")]
		public required string DisplayName { get; set; }
		[Range(1, int.MaxValue, ErrorMessage = "Hibás helyszín id.")]
		public required int LocationId { get; set; }
		[ForeignKey("LocationId")]
		public Location? Location { get; set; }
	}
}

