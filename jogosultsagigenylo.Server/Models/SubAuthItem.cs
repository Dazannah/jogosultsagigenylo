using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace jogosultsagigenylo.Server.Models {
	public class SubAuthItem {
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int Id { get; set; }
		public required string DisplayName { get; set; }
		public int AuthItemId { get; set; }
		[ForeignKey("AuthItemId")]
		public AuthItem? AuthItem { get; set; }
	}
}
