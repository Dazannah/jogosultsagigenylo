using jogosultsagigenylo.Server.Data;
using jogosultsagigenylo.Server.DTO;
using jogosultsagigenylo.Server.Interfaces;
using jogosultsagigenylo.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace jogosultsagigenylo.Server.Services {
	public class AuthItemService : IAuthItem {

		private readonly ApplicationDbContext _context;

		public AuthItemService(ApplicationDbContext context) {
			_context = context;
		}

		/// <summary>
		/// Check if IDs exist and create the auth item.
		/// </summary>
		/// <exception cref="KeyNotFoundException">Thrown when authItemDTO ColumnId or StatusId is not found in DB.</exception>
		public async Task<bool> CreateOne(AuthItemDTO authItemDTO) {
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
	}
}
