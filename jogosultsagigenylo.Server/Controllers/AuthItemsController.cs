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
				.Include(c => c.Status)
				.Include(c => c.AuthItems)
				.ThenInclude(ai => ai.Status)
				.ToListAsync();

			IEnumerable<ColumnDTO> columnsDTO = ColumnDTO.ToDTOIEnumrable(columns);
			IEnumerable<Status> statuses = await _context.Status.ToArrayAsync();

			return Json(new { columnsDTO, statuses });
		}

		[HttpPost("create")]
		public async Task<IActionResult> Create([FromBody] AuthItemDTO authItemDTO) {
			try {
				var column = await _context.Columns.FirstOrDefaultAsync(c => c.Id == authItemDTO.ColumnId)
					?? throw new KeyNotFoundException($"Oszlop {authItemDTO.ColumnId} id-val nem található.");

				var status = await _context.Status.FirstOrDefaultAsync(s => s.Id == authItemDTO.StatusId)
					?? throw new KeyNotFoundException($"Státusz {authItemDTO.StatusId} id-val nem található");

				var authItem = new AuthItem {
					DisplayName = authItemDTO.DisplayName,
					ColumnId = authItemDTO.ColumnId,
					Column = column,
					Status = status
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

		[HttpPatch("inactivate/{id}")]
		public async Task<IActionResult> Inactivate(int id) {
			try {
				ArgumentOutOfRangeException.ThrowIfNegativeOrZero(id, "Id megadása kötelező.");

				var authItem = await _context.AuthItems.FirstOrDefaultAsync(ai => ai.Id == id)
					?? throw new KeyNotFoundException($"Jogosultság {id} id-val nem található.");

				authItem.StatusId = 2;

				_context.AuthItems.Update(authItem);
				await _context.SaveChangesAsync();

				return Ok(new { message = "Jogosultság sikeresen inaktivála" });
			} catch(KeyNotFoundException err) {
				return NotFound(new { error = err.Message });
			} catch(Exception err) {
				return BadRequest(new { error = err.Message });
			}
		}

		[HttpPatch("activate/{id}")]
		public async Task<IActionResult> Activate(int id) {
			try {
				ArgumentOutOfRangeException.ThrowIfNegativeOrZero(id, "Id megadása kötelező.");

				var authItem = await _context.AuthItems.FirstOrDefaultAsync(ai => ai.Id == id)
					?? throw new KeyNotFoundException($"Jogosultság {id} id-val nem található.");

				authItem.StatusId = 1;

				_context.AuthItems.Update(authItem);
				await _context.SaveChangesAsync();

				return Ok(new { message = "Jogosultság sikeresen aktivála" });
			} catch(KeyNotFoundException err) {
				return NotFound(new { error = err.Message });
			} catch(Exception err) {
				return BadRequest(new { error = err.Message });
			}
		}

		// POST: AuthItemController/Edit/5
		[HttpPost]
		[ValidateAntiForgeryToken]
		public ActionResult Edit(int id, IFormCollection collection) {
			try {
				return RedirectToAction(nameof(Index));
			} catch {
				return View();
			}
		}

		// POST: AuthItemController/Delete/5
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
	}
}
