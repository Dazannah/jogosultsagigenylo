using jogosultsagigenylo.Server.DTO;

namespace jogosultsagigenylo.Server.Interfaces {
	public interface IAuthItem {
		public Task<bool> CreateOne(AuthItemDTO authItemDTO);
	}
}
