using jogosultsagigenylo.Server.Data;
using jogosultsagigenylo.Server.DTO;
using jogosultsagigenylo.Server.Interfaces;
using jogosultsagigenylo.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace jogosultsagigenylo.Server.Controllers {
	[ApiController]
	[Route("api/[controller]")]
	public class AuthItemsController : Controller {
		private readonly ApplicationDbContext _context;
		private readonly IAuthItemService _authItemService;
		private readonly IColumnService _columnService;

		public AuthItemsController(ApplicationDbContext context, IAuthItemService authItemService, IColumnService columnService) {
			_context = context;
			_authItemService = authItemService;
			_columnService = columnService;
		}

		[HttpGet("")]
		public async Task<IActionResult> Index() {
			var columnsDTO = await _columnService.GetColumnsDTO();
			IEnumerable<Status> statuses = await _context.Status.ToArrayAsync();

			return Json(new { columnsDTO, statuses });
		}

		[HttpPost("create")]
		public async Task<IActionResult> Create([FromBody] AuthItemDTO authItemDTO) {
			try {
				if(!ModelState.IsValid)
					return BadRequest(ModelState);

				var result = await _authItemService.CreateOne(authItemDTO);

				if(!result)
					return BadRequest(new { error = "Sikertelen jogosultság létrehozás." });

				await _columnService.SortAuthItemsByPositionInSpecificColumn(authItemDTO.ColumnId);

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

				var result = await _authItemService.Update(id, authItemDTO);
				await _columnService.SortAuthItemsByPositionInSpecificColumn(authItemDTO.ColumnId);

				if(!result)
					return BadRequest(new { error = "Sikertelen jogosultság szerkesztés." });


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

				var authItemToDelete = await _context.AuthItems.Where(ai => ai.Id == id).FirstOrDefaultAsync()
					?? throw new KeyNotFoundException($"Jogosultság {id} id-val nem található.");


				_context.AuthItems.Remove(authItemToDelete);
				await _context.SaveChangesAsync();
				await _columnService.SortAuthItemsByPositionInSpecificColumn(authItemToDelete.ColumnId);

				return Ok(new { message = "Jogosultság sikeresen törölve" });
			} catch(ArgumentOutOfRangeException err) {
				return NotFound(new { error = err.Message });
			} catch(KeyNotFoundException err) {
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

				await _authItemService.UpdateOrder(columnId, authItemDTOs);

				return Ok();
			} catch(KeyNotFoundException err) {
				return NotFound(new { error = err.Message });
			} catch(Exception err) {
				Console.WriteLine(err);
				return BadRequest(new { error = err.Message });
			}
		}
	}
}
