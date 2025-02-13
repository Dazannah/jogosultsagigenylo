import Container from "../Container";
function Locations() {
    const title = "Helyszínek"
  return (
      <Container title={title}>
          <div className="shadow-sm w-fit mt-1 mx-auto break-words">
              <table className="w-full text-sm text-left rtl:text-right">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                          <th scope="col" className="px-6 py-3">
                              Elnevezés
                          </th>
                          <th scope="col" className="px-6 py-3">
                              Helyszín
                          </th>
                          <th scope="col" className="px-6 py-3">
                              Megjegyzés
                          </th>
                          <th scope="col" className="px-6 py-3"></th>
                      </tr>
                  </thead>
                  <tbody>

                  </tbody>
              </table>
          </div>

      </Container>
  );
}

export default Locations;