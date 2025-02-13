using jogosultsagigenylo.Server.Data;
using jogosultsagigenylo.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace jogosultsagigenylo.Server.Controllers {
	[ApiController]
	[Route("api/[controller]")]
	public class LocationsController : Controller {
		private readonly ApplicationDbContext _context;

		public LocationsController(ApplicationDbContext context) {
			_context = context;
		}

		[HttpGet("")]
		public async Task<IActionResult> Index() {
			var locations = await _context.Locations.ToArrayAsync();

			return Json(new { locations });
		}

		[HttpPost("create")]
		public async Task<IActionResult> Create([FromBody] Location location) {
			try {
				_context.Locations.Add(location);
				await _context.SaveChangesAsync();

				return Ok(new { message = "Helyszín sikeresen létrehozva." });
			} catch(Exception err) {
				return BadRequest(new { error = err.Message });
			}
		}

		[HttpPatch("edit/{id}")]
		public async Task<IActionResult> Edit(int id, [FromBody] Location locationNewData) {
			try {
				ArgumentOutOfRangeException.ThrowIfNegativeOrZero(id, "Id megadása kötelező.");

				var locationToEdit = await _context.Locations.FirstOrDefaultAsync(c => c.Id == id)
					?? throw new KeyNotFoundException($"Osztály {id} id-val nem található.");

				locationToEdit.DisplayName = locationNewData.DisplayName;
				locationToEdit.Note = locationNewData.Note;

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

				var deleted = await _context.Locations.Where(c => c.Id == id).ExecuteDeleteAsync();

				if(deleted == 0)
					return NotFound(new { error = $"Nem található helyszín {id} id-val." });

				return Ok(new { message = "Helyszín sikeresen törölve" });
			} catch(ArgumentOutOfRangeException err) {
				return NotFound(new { error = err.Message });
			} catch(Exception err) {
				return BadRequest(new { error = err.Message });
			}
		}
	}
}
