using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace jogosultsagigenylo.Server.Models {
	public class Category {
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int Id { get; set; }
		[Required(AllowEmptyStrings = false, ErrorMessage = "Elnevezés nem megfelelő.")]
		public required string DisplayName { get; set; }
	}
}
