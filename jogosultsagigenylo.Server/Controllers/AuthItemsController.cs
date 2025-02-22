using jogosultsagigenylo.Server.Data;
using jogosultsagigenylo.Server.DTO;
using jogosultsagigenylo.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace jogosultsagigenylo.Server.Controllers {
	[ApiController]
	[Route("api/[controller]")]
	public class AuthItemsController : Controller {
		private readonly ApplicationDbContext _context;

		public AuthItemsController(ApplicationDbContext context) {
			_context = context;
		}

		[HttpGet("")]
		public async Task<IActionResult> Index() {
			IEnumerable<Column> columns = await _context.Columns
				.OrderBy(c => c.Position)
				.Include(c => c.Status)
				.Include(c => c.AuthItems.OrderBy(a => a.Position))
				.ThenInclude(ai => ai.Status)
				.ToListAsync();

			IEnumerable<ColumnDTO> columnsDTO = ColumnDTO.ToDTOIEnumrable(columns);
			IEnumerable<Status> statuses = await _context.Status.ToArrayAsync();

			return Json(new { columnsDTO, statuses });
		}

		[HttpPost("create")]
		public async Task<IActionResult> Create([FromBody] AuthItemDTO authItemDTO) {
			try {
				if(!ModelState.IsValid)
					return BadRequest(ModelState);

				var column = await _context.Columns.FirstOrDefaultAsync(c => c.Id == authItemDTO.ColumnId)
					?? throw new KeyNotFoundException($"Oszlop {authItemDTO.ColumnId} id-val nem található.");

				var status = await _context.Status.FirstOrDefaultAsync(s => s.Id == authItemDTO.StatusId)
					?? throw new KeyNotFoundException($"Státusz {authItemDTO.StatusId} id-val nem található");

				var lastInColumn = _context.AuthItems.Where(a => a.ColumnId == authItemDTO.ColumnId).OrderByDescending(a => a.Position).FirstOrDefault()?.Position;

				var authItem = new AuthItem {
					DisplayName = authItemDTO.DisplayName,
					ColumnId = authItemDTO.ColumnId,
					Column = column,
					Status = status,
					Position = ++lastInColumn ?? 1
				};

				_context.AuthItems.Add(authItem);
				await _context.SaveChangesAsync();

				return Ok(new { message = "Jogosultság sikeresen létrehozva" });
			} catch(KeyNotFoundException err) {
				return NotFound(new { error = err.Message });
			} catch(Exception err) {
				return BadRequest(new { error = err.Message });
			}
		}

		[HttpPatch("edit/{id}")]
		public async Task<IActionResult> Edit(int id, [FromBody] AuthItemDTO authItemDTO) {
			try {
				if(!ModelState.IsValid)
					return BadRequest(ModelState);

				var allAuthItems = await _context.AuthItems
					.Where(ai => ai.ColumnId == authItemDTO.ColumnId)
					.ToListAsync();

				var authItem = allAuthItems.FirstOrDefault(ai => ai.Id == id)
					?? throw new KeyNotFoundException($"Jogosultság {id} id-val nem található.");

				authItem.DisplayName = authItemDTO.DisplayName;
				authItem.StatusId = authItemDTO.StatusId;
				authItem.ColumnId = authItemDTO.ColumnId;
				authItem.Position = authItemDTO.Position;

				var sortedAllAuthItems = allAuthItems.OrderBy(ai => ai.Position).ThenBy(ai => ai.DisplayName);

				int newPosition = 1;
				foreach(var item in sortedAllAuthItems) {
					item.Position = newPosition;
					newPosition++;
				}

				_context.AuthItems.UpdateRange(sortedAllAuthItems);
				await _context.SaveChangesAsync();

				return Ok(new { message = "Jogosultság sikeresen frissítve." });
			} catch(KeyNotFoundException err) {
				return NotFound(new { error = err.Message });
			} catch(Exception err) {
				return BadRequest(new { error = err.Message });
			}
		}

		[HttpDelete("delete/{id}")]
		public async Task<IActionResult> Delete(int id) {
			try {
				ArgumentOutOfRangeException.ThrowIfNegativeOrZero(id, "Id megadása kötelező.");

				int deletedRows = await _context.AuthItems.Where(ai => ai.Id == id).ExecuteDeleteAsync();

				if(deletedRows == 0)
					return NotFound(new { error = $"Nem található jogosultság {id} id-val." });

				return Ok(new { message = "Jogosultság sikeresen törölve" });
			} catch(ArgumentOutOfRangeException err) {
				return NotFound(new { error = err.Message });
			} catch(Exception err) {
				return BadRequest(new { error = err.Message });
			}
		}

		[HttpPatch("update-order/{columnId}")]
		public async Task<IActionResult> UpdateOrder(int columnId, [FromBody] List<AuthItemDTO> authItemDTOs) {
			try {
				if(!ModelState.IsValid)
					return BadRequest(ModelState);

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
					await _context.SaveChangesAsync();
				}

				return Ok();
			} catch(KeyNotFoundException err) {
				return NotFound(new { error = err.Message });
			} catch(Exception err) {
				return BadRequest(new { error = err.Message });
			}
		}
	}
}
