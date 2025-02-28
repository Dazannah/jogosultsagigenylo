using jogosultsagigenylo.Server.Data;
using jogosultsagigenylo.Server.DTO;
using jogosultsagigenylo.Server.Interfaces;
using jogosultsagigenylo.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace jogosultsagigenylo.Server.Services {
	public class AuthItemService : IAuthItemService {

		private readonly ApplicationDbContext _context;

		public AuthItemService(ApplicationDbContext context) {
			_context = context;
		}

		/// <summary>
		/// Check if IDs exist and create the auth item.
		/// </summary>
		/// <exception cref="KeyNotFoundException">Thrown when authItemDTO ColumnId or StatusId is not found in DB.</exception>
		public async Task<bool> CreateOne(IAuthItemDTO authItemDTO) {
			var column = await _context.Columns.FirstOrDefaultAsync(c => c.Id == authItemDTO.ColumnId)
				?? throw new KeyNotFoundException($"Oszlop {authItemDTO.ColumnId} id-val nem található.");

			var status = await _context.Status.FirstOrDefaultAsync(s => s.Id == authItemDTO.StatusId)
				?? throw new KeyNotFoundException($"Státusz {authItemDTO.StatusId} id-val nem található");

			var lastInColumn = _context.AuthItems
				.Where(a => a.ColumnId == authItemDTO.ColumnId)
				.OrderByDescending(a => a.Position)
				.FirstOrDefault()?.Position;

			var authItem = new AuthItem {
				DisplayName = authItemDTO.DisplayName,
				ColumnId = authItemDTO.ColumnId,
				Column = column,
				Status = status,
				Position = ++lastInColumn ?? 1
			};

			_context.AuthItems.Add(authItem);
			var saved = await _context.SaveChangesAsync();

			if(saved <= 0)
				return false;

			return true;
		}

		public async Task<bool> Update(int id, IAuthItemDTO authItemDTO) {
			var authItem = await _context.AuthItems
				.FirstOrDefaultAsync(ai => ai.Id == id)
				?? throw new KeyNotFoundException($"Jogosultság {id} id-val nem található.");

			authItem.DisplayName = authItemDTO.DisplayName;
			authItem.StatusId = authItemDTO.StatusId;
			authItem.ColumnId = authItemDTO.ColumnId;
			authItem.Position = authItemDTO.Position;

			_context.AuthItems.Update(authItem);
			var updated = await _context.SaveChangesAsync();

			if(updated < 1)
				return false;

			return true;
		}

		public async Task<int> UpdateOrder(int columnId, List<AuthItemDTO> authItemDTOs) {
			var authItems = _context.AuthItems.Where(a => a.ColumnId == columnId)
				?? throw new KeyNotFoundException($"Oszlop {columnId} id-val nem található.");

			if(authItems != null) {
				var positions = new Dictionary<int, int>();

				foreach(var authItemDTO in authItemDTOs) {
					positions.Add(authItemDTO.Id, authItemDTO.Position);
				}

				foreach(var authItem in authItems) {
					authItem.Position = positions[authItem.Id];
				}

				_context.AuthItems.UpdateRange(authItems);
				return await _context.SaveChangesAsync();
			}

			return 0;
		}
	}
}

