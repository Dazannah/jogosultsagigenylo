using jogosultsagigenylo.Server.Data;
using jogosultsagigenylo.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace jogosultsagigenylo.Server.Controllers {
	[ApiController]
	[Route("api/[controller]")]

	public class SubAuthItemsController : ControllerBase {
		private readonly ApplicationDbContext _context;

		public SubAuthItemsController(ApplicationDbContext context) {
			_context = context;
		}

		[HttpGet("")]
		public async Task<IActionResult> Index() {
			IEnumerable<AuthItem> authItems = await _context.AuthItems
				.Include(ai => ai.Status)
				.Include(ai => ai.SubAuthItems)
				.ThenInclude(sai => sai.Status)
				.ToListAsync();

			return new JsonResult(new { authItems });
		}

		// GET api/<SubAuthItemController>/5
		[HttpGet("{id}")]
		public string Get(int id) {
			return "value";
		}

		// POST api/<SubAuthItemController>
		[HttpPost]
		public void Post([FromBody] string value) {
		}

		// PUT api/<SubAuthItemController>/5
		[HttpPut("{id}")]
		public void Put(int id, [FromBody] string value) {
		}

		// DELETE api/<SubAuthItemController>/5
		[HttpDelete("{id}")]
		public void Delete(int id) {
		}

	}
}
