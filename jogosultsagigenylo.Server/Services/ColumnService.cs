using jogosultsagigenylo.Server.Data;
using jogosultsagigenylo.Server.DTO;
using jogosultsagigenylo.Server.Interfaces;
using jogosultsagigenylo.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace jogosultsagigenylo.Server.Services {
	public class ColumnService : IColumnService {
		private readonly ApplicationDbContext _context;

		public ColumnService(ApplicationDbContext context) {
			_context = context;
		}

		public async Task<IEnumerable<ColumnDTO>> GetColumnsDTO() {
			IEnumerable<Column> columns = await _context.Columns
				.OrderBy(c => c.Position)
				.Include(c => c.Status)
				.Include(c => c.AuthItems.OrderBy(a => a.Position))
				.ThenInclude(ai => ai.Status)
				.ToListAsync();

			IEnumerable<ColumnDTO> columnsDTO = ColumnDTO.ToDTOIEnumrable(columns);

			return columnsDTO;
		}

		public async Task<int> SortAuthItemsByPositionInSpecificColumn(int columnId) {
			var allAuthItems = await _context.AuthItems
				.Where(ai => ai.ColumnId == columnId)
				.ToListAsync();

			var sortedAllAuthItems = allAuthItems.OrderBy(ai => ai.Position).ThenBy(ai => ai.DisplayName);

			int newPosition = 1;
			foreach(var item in sortedAllAuthItems) {
				item.Position = newPosition;
				newPosition++;
			}

			_context.AuthItems.UpdateRange(sortedAllAuthItems);
			return await _context.SaveChangesAsync();
		}
	}
}
