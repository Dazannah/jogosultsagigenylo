using jogosultsagigenylo.Server.Models;

namespace jogosultsagigenylo.Server.Interfaces {
	public interface IAuthItemDTO {
		public int Id { get; set; }
		public string DisplayName { get; set; }
		public int StatusId { get; set; }
		public Status? Status { get; set; }
		public int ColumnId { get; set; }
		public string? Column { get; set; }
		public int Position { get; set; }
	}
}
