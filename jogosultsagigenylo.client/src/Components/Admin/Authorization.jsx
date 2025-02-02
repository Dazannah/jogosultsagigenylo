import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import CssClasses from "../../CssClasses"

import Container from "../Container";
import Loading from "../Loading";
import AuthorizationMenu from "./AuthorizationMenu";

import { AppContext, DispatchContext } from "../../main"
function Authorization() {
    const appState = React.useContext(AppContext)
    const dispatch = React.useContext(DispatchContext)

    const title = "Jogosultságok"
    const [isLoading, setIsLoading] = useState(true)
    const [columns, setColumns] = useState([])
    const [statuses, setSatuses] = useState([])

    useEffect(() => {
        fetch("/api/authitems")
            .then(response => {
                return response.json()
            })
            .then(data => {
                setColumns(data.columnsDTO)
                setSatuses(data.statuses)
                setIsLoading(false)
            }).catch(error => {
                dispatch({ type: "flashMessageError", action: error.errors })
            })
    }, [isLoading])

    function showDiv(divId) {
        const div = document.getElementById(divId)

        div.classList.remove("hidden")
    }
    function hideDiv(divId) {
        const div = document.getElementById(divId)

        div.classList.add("hidden")
    }

    async function setInactive(authItemId) {
        fetch(`/api/authitems/inactivate/${authItemId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({})
        })
            .then(async response => {
                if (response.ok) {
                    setIsLoading(true)
                    dispatch({ type: "flashMessageSuccess", value: { message: "Inaktiválás sikeres."} })
                } else {
                    const msg = await response.json()
                    dispatch({ type: "flashMessageWarning", value: msg.errors })
                }
            }).catch(error => {
                dispatch({ type: "flashMessageError", value: error.errors })
            })
    }

    async function setActive(authItemId) {
        fetch(`/api/authitems/activate/${authItemId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({})
        })
            .then(async response => {
                if (response.ok) {
                    setIsLoading(true)
                    dispatch({ type: "flashMessageSuccess", value: { message: "Aktiválás sikeres." } })
                } else {
                    const msg = await response.json()
                    dispatch({ type: "flashMessageWarning", value: msg.errors })
                }
            }).catch(error => {
                dispatch({ type: "flashMessageError", value: error.errors })
            })
    }

    async function deleteAuthItem(authItemId, authItemName) {
        if (confirm(`Ezzel törlöd mindenhonnan a/az ${authItemName}hoz tartozó jogosultságot, minden felhasználótól.`))
            fetch(`/api/authitems/delete/${authItemId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({})
            })
                .then(async response => {
                    if (response.ok) {
                        setIsLoading(true)
                        dispatch({ type: "flashMessageSuccess", value: { message: "Törlés sikeres." } })
                    } else {
                        const msg = await response.json()
                        dispatch({ type: "flashMessageWarning", value: msg.errors })
                    }
                }).catch(error => {
                    dispatch({ type: "flashMessageError", value: error.errors })
                })
    }
    async function deleteColumn(columnId, columnDisplayName) {
        if (confirm(`Ezzel törlöd mindenhonnan a/az ${columnDisplayName}hoz tartozó jogosultságot, minden felhasználótól.`))
            fetch(`/api/columns/delete/${columnId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({})
            })
                .then(async response => {
                    if (response.ok) {
                        setIsLoading(true)
                        dispatch({ type: "flashMessageSuccess", value: { message: "Törlés sikeres." } })
                    } else {
                        const msg = await response.json()
                        dispatch({ type: "flashMessageWarning", value: msg.errors })
                    }
                }).catch(error => {
                    dispatch({ type: "flashMessageError", value: error.errors })
                })
    }

    async function editColumn(e) {
        e.preventDefault()
        const columnId = e.target.columnId.value

        const body = {
            displayName: e.target.displayName.value,
            statusId: e.target.statusId.value
        }

        fetch(`/api/columns/edit/${columnId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
            .then(async response => {
                if (response.ok) {
                    setIsLoading(true)
                    dispatch({ type: "flashMessageSuccess", value: { message: "Szerkesztés sikeres." } })
                } else {
                    const msg = await response.json()
                    dispatch({ type: "flashMessageWarning", value: msg.errors })
                }
            }).catch(error => {
                dispatch({ type: "flashMessageError", value: error.errors })
            })
    }

    if (isLoading) return <Loading title={title} />

    return (
        <Container title={title}>
            <AuthorizationMenu columns={columns} statuses={statuses} setIsLoading={setIsLoading}/>
            <div className="flex flex-wrap">
                {
                    columns.map((column, idx) => {
                        return (
                            <div key={`${idx}WrapperDiv`} className="shadow-md sm:rounded-lg w-full md:w-1/3 mt-1 overflow-x-auto">
                                <table className="w-full text-sm text-left rtl:text-right">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th colSpan="3" className="w-max px-6 py-3">{column.displayName}</th>
                                        </tr>
                                        <tr>
                                            <th scope="col" className="px-6 py-3">Elnevezés</th>
                                            <th scope="col" className="px-6 py-3">Státusz</th>
                                            <th scope="col" className="px-6 py-3">
                                                <div className="flex place-content-end">
                                                    <button onClick={() => showDiv(`edit-column-${column.id}-div`)} className="rounded-md bg-transparent py-1 px-1 border border-transparent text-orange-500 text-sm transition-all shadow-md dark:bg-gray-700 hover:text-white hover:bg-orange-500 hover:cursor-pointer hover:shadow-lg focus:shadow-none active:shadow-none">Szerkesztés</button>
                                                 </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            column.authItems.map(authItem => {
                                                return (
                                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600" key={`${authItem.id}TrKey`}>
                                                        <td className="px-6 py-4">{authItem.displayName}</td>
                                                        <td className="px-6 py-4">{`${authItem.status.displayName}`}</td>
                                                        <td className="px-1 py-4">
                                                            <div className="row flex w-full">
                                                                {authItem.status.name == "active" ?
                                                                    <button onClick={() => setInactive(authItem.id)} className="rounded-md rounded-r-none bg-transparent py-1 px-1 border border-transparent text-center text-sm text-red-500 transition-all shadow-md dark:bg-gray-700 hover:cursor-pointer hover:text-white hover:bg-red-500 hover:shadow-lg focus:shadow-none active:shadow-none">Inaktiválás</button>
                                                                    :
                                                                    <button onClick={() => setActive(authItem.id)} className="rounded-md rounded-r-none bg-transparent py-1 px-1 border border-transparent text-center text-sm text-green-500 transition-all shadow-md dark:bg-gray-700 hover:text-white hover:bg-green-500 hover:cursor-pointer hover:shadow-lg focus:shadow-none active:shadow-none">Aktiválás</button>}{" "}
                                                                <button onClick={() => deleteAuthItem(authItem.id, authItem.displayName)} className="rounded-md rounded-l-none bg-transparent py-1 px-1 border border-transparent text-red-500 text-sm transition-all shadow-md dark:bg-gray-700 hover:text-white hover:bg-red-500 hover:cursor-pointer hover:shadow-lg focus:shadow-none active:shadow-none">Törlés</button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                                <div id={`edit-column-${column.id}-div`} key="add-auth-item-div-key" className="fixed top-0 left-0 w-screen h-screen flex items-center bg-gray-500/50 hidden">
                                    <Container>
                                        <div className="bg-white w-fit m-auto rounded-lg dark:bg-gray-800 dark:text-gray-300">
                                            <div className="flex font-semibold text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-300 rounded-t-lg">
                                                <div className="flex md:w-1/2 place-content-start p-2"><span>{column.displayName}</span></div>
                                                <div className="flex md:w-1/2 place-content-end p-2">

                                                    <svg onClick={() => hideDiv(`edit-column-${column.id}-div`)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 hover:cursor-pointer">
                                                        <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <form onSubmit={editColumn} className="w-full max-w-5xl mx-auto p-5 shadow-md rounded-b-lg">
                                                <div className="flex flex-wrap -mx-3 mb-6">
                                                    <input type="hidden" value={column.id} name="columnId" />
                                                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                                        <label className={`${CssClasses.label}`} htmlFor="displayName">
                                                            Elnevezés
                                                        </label>
                                                        <input defaultValue={column.displayName} name="displayName" className={`${CssClasses.input}`} id="displayName" autoComplete="off" type="text" placeholder="Elnevezés" required />
                                                    </div>
                                                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                                        <label className={`${CssClasses.label}`} htmlFor="statuses">
                                                            Státusz
                                                        </label>
                                                        <select name="statusId" key="add-auth-item-statuses" className="w-full rounded border bg-gray-100 dark:bg-gray-900 border-teal-700 focus:border-orange-500 cursor-pointer py-3 px-4 mb-3" id="statuses" required>
                                                            <option key={`add-auth-item-statuses${column.status.id}`} value={column.status.id}>{column.status.displayName}</option>
                                                            {
                                                                statuses.map(status => {
                                                                    if (column.status.id != status.id) return <option key={`add-auth-item-statuses${status.id}`} value={status.id}>{status.displayName}</option>
                                                                })
                                                            }
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="md:w-2/3">
                                                    <button className="shadow bg-teal-700 hover:bg-orange-500 cursor-pointer focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="submit">
                                                        Mentés
                                                    </button>{" "}
                                                    <button type="button" onClick={() => deleteColumn(column.id, column.displayName)} className="shadow bg-white dark:bg-transparent dark:border dark:border-red-500 hover:bg-red-500 cursor-pointer focus:shadow-outline focus:outline-none text-red-500 hover:text-white font-bold py-2 px-4 rounded">
                                                        Törlés
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </Container>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </Container>
    );
}

export default Authorization;