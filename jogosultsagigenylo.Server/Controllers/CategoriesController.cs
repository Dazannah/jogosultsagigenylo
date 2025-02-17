using jogosultsagigenylo.Server.Data;
using jogosultsagigenylo.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace jogosultsagigenylo.Server.Controllers {
	[ApiController]
	[Route("api/[controller]")]
	public class CategoriesController : Controller {
		private readonly ApplicationDbContext _context;
		public CategoriesController(ApplicationDbContext context) {
			_context = context;
		}

		[HttpGet("")]
		public async Task<IActionResult> Index() {
			var categories = await _context.Categories.ToListAsync();


			return Json(new { categories });
		}

		// POST: CategoriesController/Create
		[HttpPost("create")]
		public async Task<IActionResult> Create([FromBody] Category newCategory) {
			try {
				_context.Categories.Add(newCategory);

				await _context.SaveChangesAsync();

				return Ok(new { message = "Kategória sikeresen létrehozva" });
			} catch(Exception err) {
				return BadRequest(new { error = err.Message });
			}
		}

		[HttpPatch("edit/{id}")]
		public async Task<IActionResult> Edit(int id, Category categoryEdited) {
			try {
				ArgumentOutOfRangeException.ThrowIfNegativeOrZero(id, "Id megadása kötelező.");

				var categoryToEdit = await _context.Categories.FirstOrDefaultAsync(c => c.Id == id)
					?? throw new KeyNotFoundException($"Kategória {id} id-val nem található.");

				categoryToEdit.DisplayName = categoryEdited.DisplayName;

				await _context.SaveChangesAsync();

				return Ok(new { message = "Szerkesztés sikeres." });
			} catch(ArgumentOutOfRangeException err) {
				return NotFound(new { error = err.Message });
			} catch(KeyNotFoundException err) {
				return NotFound(new { message = err.Message });
			} catch(Exception err) {
				return BadRequest(new { message = err.Message });
			}
		}

		[HttpDelete("delete/{id}")]
		public async Task<IActionResult> Delete(int id) {
			try {
				ArgumentOutOfRangeException.ThrowIfNegativeOrZero(id, "Id megadása kötelező.");

				var deleted = await _context.Categories.Where(c => c.Id == id).ExecuteDeleteAsync();

				if(deleted == 0)
					return NotFound(new { error = $"Nem található kategória {id} id-val." });

				return Ok(new { message = "Kategória sikeresen törölve" });
			} catch(ArgumentOutOfRangeException err) {
				return NotFound(new { error = err.Message });
			} catch(Exception err) {
				return BadRequest(new { error = err.Message });
			}
		}
	}
}
