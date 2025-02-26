using jogosultsagigenylo.Server.DTO;

namespace jogosultsagigenylo.Server.Interfaces {
	public interface IColumn {
		public Task<IEnumerable<ColumnDTO>> GetColumnsDTO();
	}
}
