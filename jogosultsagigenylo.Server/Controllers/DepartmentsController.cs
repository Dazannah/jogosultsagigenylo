using jogosultsagigenylo.Server.Data;
using jogosultsagigenylo.Server.DTO;
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
			var locations = await _context.Locations.ToListAsync();

			return Json(new { departments, locations });
		}

		[HttpPost("create")]
		public async Task<IActionResult> Create([FromBody] DepartmentDTO departmentDTO) {
			try {
				var newDepartment = new Department {
					Category = departmentDTO.Category,
					DisplayName = departmentDTO.DisplayName,
					ClassNumber = departmentDTO.ClassNumber,
					LocationId = departmentDTO.LocationId
				};

				_context.Departments.Add(newDepartment);
				await _context.SaveChangesAsync();

				return Ok(new { message = "Osztály sikeresen létrehozva" });
			} catch(Exception err) {
				return BadRequest(new { error = err.Message });
			}
		}

		[HttpPatch("edit/{id}")]
		public async Task<IActionResult> Edit(int id, DepartmentDTO departmentDTO) {
			try {
				ArgumentOutOfRangeException.ThrowIfNegativeOrZero(id, "Id megadása kötelező.");

				var departmentToEdit = await _context.Departments.FirstOrDefaultAsync(c => c.Id == id)
					?? throw new KeyNotFoundException($"Osztály {id} id-val nem található.");

				departmentToEdit.ClassNumber = departmentDTO.ClassNumber;
				departmentToEdit.LocationId = departmentDTO.LocationId;
				departmentToEdit.Category = departmentDTO.Category;
				departmentToEdit.DisplayName = departmentDTO.DisplayName;

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
