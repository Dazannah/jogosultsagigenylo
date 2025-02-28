using jogosultsagigenylo.Server.DTO;

namespace jogosultsagigenylo.Server.Interfaces {
	public interface IAuthItemService {
		public Task<bool> CreateOne(IAuthItemDTO authItemDTO);
		public Task<bool> Update(int id, IAuthItemDTO authItemDTO);
		public Task<int> UpdateOrder(int columnId, List<AuthItemDTO> authItemDTOs);
	}
}
