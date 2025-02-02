using jogosultsagigenylo.Server.Data;
using jogosultsagigenylo.Server.DTO;
using jogosultsagigenylo.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace jogosultsagigenylo.Server.Controllers {
	[ApiController]
	[Route("api/[controller]")]
	public class ColumnsController : Controller {
		private readonly ApplicationDbContext _context;
		public ColumnsController(ApplicationDbContext context) {
			_context = context;
		}

		[HttpGet("")]
		public async Task<IActionResult> Index() {
			IEnumerable<Column> columns = await _context.Columns
				.Include(c => c.Status)
				.Include(c => c.AuthItems)
				.ThenInclude(ai => ai.Status)
				.ToListAsync();
			foreach(var column in columns) {
				Console.WriteLine(column);
			}
			IEnumerable<ColumnDTO> response = ColumnDTO.ToDTOIEnumrable(columns);

			return Json(response);
		}

		[HttpPost("create")]
		public async Task<IActionResult> Create([FromBody] ColumnDTO columnDTO) {
			try {
				var status = await _context.Status.FirstOrDefaultAsync(s => s.Id == columnDTO.StatusId)
					?? throw new KeyNotFoundException($"Státusz {columnDTO.StatusId} id-val nem található.");

				var newColumn = new Column {
					DisplayName = columnDTO.DisplayName,
					Status = status
				};

				_context.Columns.Add(newColumn);
				await _context.SaveChangesAsync();

				return Ok(new { message = "Column created successfully" });
			} catch(KeyNotFoundException err) {
				return NotFound(new { error = err.Message });
			} catch(Exception err) {
				return BadRequest(new { error = err.Message });
			}
		}


		[HttpPatch("edit/{id}")]
		public async Task<IActionResult> Edit(int id, [FromBody] ColumnDTO columnDTO) {
			try {
				Console.WriteLine("asd");
				var column = await _context.Columns.FirstOrDefaultAsync(c => c.Id == id)
					?? throw new KeyNotFoundException($"Státusz {id} id-val nem található.");

				column.DisplayName = columnDTO.DisplayName;
				column.StatusId = columnDTO.StatusId;

				_context.Columns.Update(column);
				await _context.SaveChangesAsync();

				return Ok(new { message = "Sikeres módosítás." });
			} catch(KeyNotFoundException err) {
				return NotFound(new { message = err.Message });
			} catch(Exception err) {
				return BadRequest(new { message = err.Message });
			}
		}

		[HttpDelete("delete/{id}")]
		public async Task<IActionResult> Delete(int id) {
			try {
				ArgumentOutOfRangeException.ThrowIfNegativeOrZero(id, "Hibás id.");

				await _context.Columns.Where(c => c.Id == id).ExecuteDeleteAsync();
				await _context.SaveChangesAsync();

				return Ok(new { message = "Oszlop sikeresen törölve" });
			} catch(ArgumentOutOfRangeException err) {
				return NotFound(new { error = err.Message });
			} catch(Exception err) {
				return BadRequest(new { error = err.Message });
			}
		}
	}
}
