import React, { useEffect, useState, useRef } from "react"
import Container from "../Container";
import LocationsMenu from "./LocationsMenu"
import Loading from "../Loading";

import CssClasses from "../../CssClasses";

import { DispatchContext } from "../../main";

function Locations() {
    const dispatch = React.useContext(DispatchContext);

    const classFormRef = useRef();

    const [isLoading, setIsLoading] = useState(true)
    const [locations, setLocations] = useState([])

    useEffect(() => {
        if (isLoading) {
            fetch("/api/locations")
                .then(response => {
                    if (response.ok) {
                        return response.json()
                    } else {
                        throw new Error(response.statusText)
                    }
                })
                .then(data => {
                    setLocations(data.locations);
                    setIsLoading(false);
                })
                .catch(error => {
                    dispatch({ type: "flashMessageError", value: { error } });
                });
        }
    }, [isLoading])

    function showDiv(divId) {
        const div = document.getElementById(divId)

        div.classList.remove("hidden")
    }

    function hideDiv(divId) {
        const div = document.getElementById(divId)

        div.classList.add("hidden")
    }

    async function editLocation(e) {
        e.preventDefault();
        const locationId = e.target.id.value;

        const body = {
            displayName: e.target.displayName.value,
            note: e.target.note.value
        };

        fetch(`/api/locations/edit/${locationId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
            .then(async response => {
                if (response.ok) {
                    setIsLoading(true);
                    dispatch({ type: "flashMessageSuccess", value: { message: "Szerkesztés sikeres." } });
                } else {
                    dispatch({ type: "flashMessageWarning", value: { message: response.statusText } });
                }
            })
            .catch(error => {
                dispatch({ type: "flashMessageError", value: error.errors ?? { error } });
            });
    }

    async function deleteLocation(locationDisplayName, id) {
        if (confirm(`Ezzel törlöd mindenhonnan a/az ${locationDisplayName} osztályt`)) {
            fetch(`/api/locations/delete/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(response => {
                if (response.ok) {
                    setIsLoading(true);
                    dispatch({ type: "flashMessageSuccess", value: { message: "Törlés sikeres." } });
                } else {
                    dispatch({ type: "flashMessageWarning", value: { message: response.statusText } });
                }
            })
                .catch(error => {
                    dispatch({ type: "flashMessageError", value: error.errors ?? { error } });
                });
        }

    }

    function renderLocaions() {
        return locations.map(location => {
            return (
                <tr id={`${location.id}`} className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600`} key={`${location.id}`}>
                    <td className="px-6 py-4">
                        {location.displayName}
                    </td>
                    <td className="px-6 py-4">
                        <span>{location.note}</span>
                    </td>
                    <td className="px-1 py-4">
                        <div className="flex place-content-end">
                            <button id={`${location.id}EditButton`} onClick={() => showDiv(`edit-class-div-${location.id}`)} className="bg-transparent py-1 px-1 text-orange-500 text-sm transition-all hover:cursor-pointer hover:underline">
                                Szerkesztés
                            </button>
                        </div>
                    </td>
                </tr>
            )
        })
    }

    function renderEdit() {
        return locations.map(location => {
            return (
                <div id={`edit-class-div-${location.id}`} key={`edit-auth-item-key-${location.id}`} className="fixed top-0 left-0 w-screen h-screen flex items-center bg-gray-500/50 hidden">
                    <Container>
                        <div className="bg-white w-fit m-auto rounded-lg dark:bg-gray-800 dark:text-gray-300">
                            <div className="flex font-semibold text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-300 rounded-t-lg">
                                <div className="flex md:w-1/2 place-content-start p-2"><span>{location.displayName} szerkesztése</span></div>
                                <div className="flex md:w-1/2 place-content-end p-2">
                                    <svg onClick={() => hideDiv(`edit-class-div-${location.id}`)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 hover:cursor-pointer">
                                        <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            <form ref={classFormRef} onSubmit={editLocation} className="w-full max-w-5xl mx-auto p-5 shadow-md dark:bg-gray-800 rounded-b-lg">
                                <div className="flex flex-wrap -mx-3 mb-6">
                                    <input type="hidden" name="id" value={location.id}></input>
                                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                        <label className={`${CssClasses.label}`} htmlFor="displayName">
                                            Elnevezés
                                        </label>
                                        <input name="displayName" className={`${CssClasses.input}`} id="displayName" autoComplete="off" type="text" placeholder="Elnevezés" defaultValue={location.displayName} required />
                                    </div>
                                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                        <label className={`${CssClasses.label}`} htmlFor="note">
                                            Megjegyzés
                                        </label>
                                        <input name="note" className={`${CssClasses.input}`} id="note" autoComplete="off" type="text" placeholder="Megjegyzés" defaultValue={location.note} />
                                    </div>
                                </div>
                                <div className="md:w-2/3">
                                    <button className="shadow rounded-r-none bg-teal-700 hover:bg-orange-500 cursor-pointer focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="submit">
                                        Küldés
                                    </button>
                                    <button type="button" onClick={(e) => deleteLocation(location.displayName, location.id)} className="shadow rounded-l-none bg-white dark:bg-transparent dark:border dark:border-red-500 hover:bg-red-500 cursor-pointer focus:shadow-outline focus:outline-none text-red-500 hover:text-white font-bold py-2 px-4 rounded">
                                        Törlés
                                    </button>
                                </div>
                            </form>
                        </div>
                    </Container>
                </div>
            );
        })
    }

    if (isLoading) return <Loading />

  return (
      <Container >
          <LocationsMenu setIsLoading={setIsLoading} />
          <div className="shadow-sm w-fit mt-1 mx-auto break-words">
              <table className="w-full text-sm text-left rtl:text-right">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                          <th scope="col" className="px-6 py-3">
                              Elnevezés
                          </th>
                          <th scope="col" className="px-6 py-3">
                              Megjegyzés
                          </th>
                          <th scope="col" className="px-6 py-3"></th>
                      </tr>
                  </thead>
                  <tbody>
                      {
                          renderLocaions()
                      }
                  </tbody>
              </table>
          </div>
          {renderEdit()}
      </Container>
  );
}

export default Locations;