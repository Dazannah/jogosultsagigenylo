using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace jogosultsagigenylo.Server.Models {
	public class Column {
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int Id { get; set; }
		//public required string Name { get; set; }
		public required string DisplayName { get; set; }
		public virtual ICollection<AuthItem> AuthItems { get; set; } = [];
		public int StatusId { get; set; }
		[ForeignKey("StatusId")]
		public required Status Status { get; set; }
		public int Position { get; set; } = int.MaxValue;
		public override string ToString() {
			return DisplayName;
		}
	}
}
