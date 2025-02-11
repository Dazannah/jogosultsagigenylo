using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace jogosultsagigenylo.Server.Models {
	public class AuthItem {
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int Id { get; set; }
		//public required string Name { get; set; }
		public required string DisplayName { get; set; }
		public int ColumnId { get; set; }
		[ForeignKey("ColumnId")]
		public Column Column { get; set; }
		public int StatusId { get; set; }
		[ForeignKey("StatusId")]
		public Status Status { get; set; }
		public int Position { get; set; }
	}
}
