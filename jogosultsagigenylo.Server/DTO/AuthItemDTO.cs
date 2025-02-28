using jogosultsagigenylo.Server.Interfaces;
using jogosultsagigenylo.Server.Models;
using System.ComponentModel.DataAnnotations;

namespace jogosultsagigenylo.Server.DTO {
	public class AuthItemDTO : IAuthItemDTO {
		[Key]
		public int Id { get; set; }
		[Required(AllowEmptyStrings = false, ErrorMessage = "Elnevezés nem megfelelő.")]
		public required string DisplayName { get; set; }
		[Range(1, int.MaxValue, ErrorMessage = "Hibás státusz id.")]
		public int StatusId { get; set; }
		public Status? Status { get; set; }
		[Range(1, int.MaxValue, ErrorMessage = "Hibás oszlop id.")]
		public int ColumnId { get; set; }
		public string? Column { get; set; }
		public int Position { get; set; }

		public static IEnumerable<AuthItemDTO> ToDTOList(IEnumerable<AuthItem> authItems) {
			var temp = new List<AuthItemDTO> { };

			foreach(var authItem in authItems) {
				temp.Add(new AuthItemDTO {
					Id = authItem.Id,
					DisplayName = authItem.DisplayName,
					Status = authItem.Status,
					StatusId = authItem.StatusId,
					ColumnId = authItem.Column.Id,
					Column = authItem.Column.ToString(),
					Position = authItem.Position
				});
			}

			IEnumerable<AuthItemDTO> result = temp.OrderBy(ai => ai.Position);

			return result;
		}
	}
}
