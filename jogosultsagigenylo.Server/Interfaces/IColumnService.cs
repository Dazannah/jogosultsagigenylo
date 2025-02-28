using jogosultsagigenylo.Server.DTO;

namespace jogosultsagigenylo.Server.Interfaces {
	public interface IColumnService {
		public Task<IEnumerable<ColumnDTO>> GetColumnsDTO();
		public Task<int> SortAuthItemsByPositionInSpecificColumn(int id);
	}
}
