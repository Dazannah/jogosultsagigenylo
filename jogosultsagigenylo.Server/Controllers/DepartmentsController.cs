using jogosultsagigenylo.Server.Data;
using jogosultsagigenylo.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace jogosultsagigenylo.Server.Controllers {
	[ApiController]
	[Route("api/[controller]")]
	public class DepartmentsController : Controller {
		private readonly ApplicationDbContext _context;

		public DepartmentsController(ApplicationDbContext context) {
			_context = context;
		}

		[HttpGet("")]
		public async Task<IActionResult> Index() {
			var departments = await _context.Departments.ToListAsync();

			return Json(new { departments });
		}

		public ActionResult Details(int id) {
			return View();
		}

		[HttpPost("create")]
		public async Task<IActionResult> Create([FromBody] Department newClass) {
			_context.Departments.Add(newClass);
			await _context.SaveChangesAsync();

			return Ok(new { message = "Osztály sikeresen létrehozva" });
		}

		[HttpPatch("edit/{id}")]
		public async Task<IActionResult> Edit(int id, Department classNewDatas) {
			try {
				ArgumentOutOfRangeException.ThrowIfNegativeOrZero(id, "Id megadása kötelező.");

				var classToEdit = await _context.Departments.FirstOrDefaultAsync(c => c.Id == id)
					?? throw new KeyNotFoundException($"Osztály {id} id-val nem található.");

				classToEdit.ClassNumber = classNewDatas.ClassNumber;
				classToEdit.Location = classNewDatas.Location;
				classToEdit.Category = classNewDatas.Category;
				classToEdit.DisplayName = classNewDatas.DisplayName;

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

				var deleted = await _context.Departments.Where(c => c.Id == id).ExecuteDeleteAsync();

				if(deleted == 0)
					return NotFound(new { error = $"Nem található osztály {id} id-val." });

				return Ok(new { message = "Osztály sikeresen törölve" });
			} catch(ArgumentOutOfRangeException err) {
				return NotFound(new { error = err.Message });
			} catch(Exception err) {
				return BadRequest(new { error = err.Message });
			}
		}
	}
}
