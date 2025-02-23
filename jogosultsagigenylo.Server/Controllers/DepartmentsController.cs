using jogosultsagigenylo.Server.Data;
using jogosultsagigenylo.Server.DTO;
using jogosultsagigenylo.Server.Models;
using jogosultsagigenylo.Server.SearchModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace jogosultsagigenylo.Server.Controllers {
	[Controller]
	[Route("api/[controller]")]
	public class DepartmentsController : ControllerBase {
		private readonly ApplicationDbContext _context;

		public DepartmentsController(ApplicationDbContext context) {
			_context = context;
		}

		[HttpGet("")]
		public async Task<IActionResult> Index([FromQuery] DepartmentQuerry departmentQuerry) {
			try {
				var numOfSkips = (departmentQuerry.Page - 1) * departmentQuerry.ItemsOnPage;

				var departments = await _context.Departments
					.Where(d => string.IsNullOrEmpty(departmentQuerry.DepartmentNumber) || d.DepartmentNumber.ToLower().Contains(departmentQuerry.DepartmentNumber.ToLower()))
					.Where(d => string.IsNullOrEmpty(departmentQuerry.DisplayName) || d.DisplayName.ToLower().Contains(departmentQuerry.DisplayName.ToLower()))
					.Where(d => departmentQuerry.LocationId.GetValueOrDefault(0) == 0 || d.LocationId == departmentQuerry.LocationId)
					.Where(d => departmentQuerry.CategoryId.GetValueOrDefault(0) == 0 || d.CategoryId == departmentQuerry.CategoryId)
					.ToListAsync();

				var filteredDepartments = departments
					.OrderBy(d => d.DisplayName)
					.ThenBy(d => d.Location.DisplayName)
					.Skip(numOfSkips)
					.Take(departmentQuerry.ItemsOnPage);

				var locations = await _context.Locations.ToListAsync();
				var categories = await _context.Categories.ToListAsync();

				var maxPageNumber = departments != null ? departments.Count() / (double)departmentQuerry.ItemsOnPage : 10.0;

				if(maxPageNumber == 0)
					maxPageNumber = 1;

				return new JsonResult(new { departments = filteredDepartments, locations, categories, maxPageNumber });
			} catch(Exception err) {
				return BadRequest(new { message = err.Message });
			}
		}

		[HttpPost("create")]
		public async Task<IActionResult> Create([FromBody] DepartmentDTO departmentDTO) {
			try {
				if(!ModelState.IsValid)
					return BadRequest(ModelState);

				var newDepartment = new Department {
					CategoryId = departmentDTO.CategoryId,
					DisplayName = departmentDTO.DisplayName,
					DepartmentNumber = departmentDTO.DepartmentNumber,
					LocationId = departmentDTO.LocationId
				};

				_context.Departments.Add(newDepartment);
				await _context.SaveChangesAsync();

				return Ok(new { message = "Osztály sikeresen létrehozva" });
			} catch(Exception err) {
				return BadRequest(new { message = err.Message });
			}
		}

		[HttpPatch("edit/{id}")]
		public async Task<IActionResult> Edit(int id, [FromBody] DepartmentDTO departmentDTO) {
			try {
				if(!ModelState.IsValid)
					return BadRequest(ModelState);

				ArgumentOutOfRangeException.ThrowIfNegativeOrZero(id, "Id megadása kötelező.");

				var departmentToEdit = await _context.Departments.FirstOrDefaultAsync(c => c.Id == id)
					?? throw new KeyNotFoundException($"Osztály {id} id-val nem található.");

				departmentToEdit.DepartmentNumber = departmentDTO.DepartmentNumber;
				departmentToEdit.LocationId = departmentDTO.LocationId;
				departmentToEdit.CategoryId = departmentDTO.CategoryId;
				departmentToEdit.DisplayName = departmentDTO.DisplayName;

				await _context.SaveChangesAsync();

				return Ok(new { message = "Szerkesztés sikeres." });
			} catch(ArgumentOutOfRangeException err) {
				return NotFound(new { message = err.Message });
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
				return NotFound(new { message = err.Message });
			} catch(Exception err) {
				return BadRequest(new { message = err.Message });
			}
		}
	}
}
