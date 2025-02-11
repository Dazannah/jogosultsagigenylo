using jogosultsagigenylo.Server.Models;
using System.ComponentModel.DataAnnotations;

namespace jogosultsagigenylo.Server.DTO {
	public class ColumnDTO {
		[Key]
		public int Id { get; set; }
		[Required(AllowEmptyStrings = false, ErrorMessage = "Elnevezés nem megfelelő.")]
		public required string DisplayName { get; set; }
		public IEnumerable<AuthItemDTO>? AuthItems { get; set; }
		[Range(1, int.MaxValue, ErrorMessage = "Hibás státusz id.")]
		public int StatusId { get; set; }
		public Status? Status { get; set; }
		public int Position { get; set; }

		public override string ToString() {
			return DisplayName;
		}

		public static IEnumerable<ColumnDTO> ToDTOIEnumrable(IEnumerable<Column> columns) {
			IEnumerable<ColumnDTO> result = [];

			foreach(var column in columns) {
				result = result.Append(new ColumnDTO {
					Id = column.Id,
					DisplayName = column.DisplayName,
					AuthItems = AuthItemDTO.ToDTOList(column.AuthItems),
					StatusId = column.StatusId,
					Status = column.Status,
					Position = column.Position
				});
			}

			return result;
		}
	}
}
