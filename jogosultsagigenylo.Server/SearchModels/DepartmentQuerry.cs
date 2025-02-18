﻿using Microsoft.AspNetCore.Mvc;

namespace jogosultsagigenylo.Server.SearchModels {
	public class DepartmentQuerry {
		public int? Id { get; set; }
		public string? DepartmentNumber { get; set; }
		public string? DisplayName { get; set; }
		public int? LocationId { get; set; }
		public int? CategoryId { get; set; }
		[FromQuery(Name = "Page")]
		public int Page { get; set; } = 1;
		public int ItemsOnPage { get; set; } = 10;

	}
}
