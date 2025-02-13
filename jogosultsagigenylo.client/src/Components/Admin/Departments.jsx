import React from "react";
import { useEffect, useState, useRef } from "react";

import ClassesMenu from "./ClassesMenu"
import Container from "../Container";
import Loading from "../Loading";
import CssClasses from "../../CssClasses";

import { DispatchContext } from "../../main";
function Departments() {
    const dispatch = React.useContext(DispatchContext);
    const classFormRef = useRef();

    const title = "Osztályok"
    const [isLoading, setIsLoading] = useState(true)
    const [departments, setDepartments] = useState([])

    function showDiv(divId) {
        const div = document.getElementById(divId)

        div.classList.remove("hidden")
    }

    function hideDiv(divId) {
        const div = document.getElementById(divId)

        div.classList.add("hidden")
    }

    useEffect(() => {
        if (isLoading) {
            fetch("/api/departments")
                .then(response => {
                    if (response.ok) {
                        return response.json()
                    } else {
                        throw new Error(response.statusText)
                    }
                })
                .then(data => {
                    setDepartments(data.departments);
                    setIsLoading(false);
                })
                .catch(error => {
                    dispatch({ type: "flashMessageError", value: {error} });
                });
        }
    }, [isLoading])

    async function editClass(e) {
        e.preventDefault();
        const classId = e.target.id.value;

        const body = {
            classNumber: e.target.classNumber.value,
            displayName: e.target.displayName.value,
            location: e.target.location.value,
            category: e.target.category.value
        };

        fetch(`/api/departments/edit/${classId}`, {
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

    async function deleteClass(classDisplayName, id) {
        if (confirm(`Ezzel törlöd mindenhonnan a/az ${classDisplayName} osztályt`)) {
            fetch(`/api/departments/delete/${id}`, {
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

    function renderClasses() {
        if (departments.length === 0) return null

        return departments.map(element => {
            return (
                <tr id={`${element.id}`} className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600`} key={`${element.id}`}>
                    <td className="px-6 py-4">
                        {element.classNumber}
                    </td>
                    <td className="px-6 py-4">
                        <span>{element.displayName}</span>
                    </td>
                    <td className="px-6 py-4">
                        {element.location}
                    </td>
                    <td className="px-6 py-4">
                        {element.category}
                    </td>
                    <td className="px-1 py-4">
                        <div className="flex place-content-end">
                            <button id={`${element.id}EditButton`} onClick={() => showDiv(`edit-class-div-${element.id}`)} className="bg-transparent py-1 px-1 text-orange-500 text-sm transition-all dark:bg-gray-700 hover:cursor-pointer hover:underline">
                                Szerkesztés
                            </button>
                        </div>
                    </td>
                </tr>
            )
        })
    }

    function renderEdit() {
            return departments.map(element => {
                return (
                    <div id={`edit-class-div-${element.id}`} key={`edit-auth-item-key-${element.id}`} className="fixed top-0 left-0 w-screen h-screen flex items-center bg-gray-500/50 hidden">
                        <Container>
                            <div className="bg-white w-fit m-auto rounded-lg dark:bg-gray-800 dark:text-gray-300">
                                <div className="flex font-semibold text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-300 rounded-t-lg">
                                    <div className="flex md:w-1/2 place-content-start p-2"><span>Osztály hozzáadása</span></div>
                                    <div className="flex md:w-1/2 place-content-end p-2">
                                        <svg onClick={() => hideDiv(`edit-class-div-${element.id}`)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 hover:cursor-pointer">
                                            <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                <form ref={classFormRef} onSubmit={editClass} className="w-full max-w-5xl mx-auto p-5 shadow-md dark:bg-gray-800 rounded-b-lg">
                                    <div className="flex flex-wrap -mx-3 mb-6">
                                        <input type="hidden" name="id" value={element.id}></input>
                                        <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                                            <label className={`${CssClasses.label}`} htmlFor="classNumber">
                                                Azonosító
                                            </label>
                                            <input name="classNumber" className={`${CssClasses.input}`} id="classNumber" autoComplete="off" type="text" placeholder="Azonosító" defaultValue={element.classNumber} required />
                                        </div>
                                        <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                                            <label className={`${CssClasses.label}`} htmlFor="displayName">
                                                Elnevezés
                                            </label>
                                            <input name="displayName" className={`${CssClasses.input}`} id="displayName" autoComplete="off" type="text" placeholder="Elnevezés" defaultValue={element.displayName} required />
                                        </div>
                                        <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                                            <label className={`${CssClasses.label}`} htmlFor="location">
                                                Helyszín
                                            </label>
                                            <input name="location" className={`${CssClasses.input}`} id="location" autoComplete="off" type="text" placeholder="Helyszín" defaultValue={element.location} required />
                                        </div>
                                        <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                                            <label className={`${CssClasses.label}`} htmlFor="category">
                                                Kategória
                                            </label>
                                            <input name="category" className={`${CssClasses.input}`} id="category" autoComplete="off" type="text" placeholder="Kategória" defaultValue={element.category} required />
                                        </div>
                                    </div>
                                    <div className="md:w-2/3">
                                        <button className="shadow rounded-r-none bg-teal-700 hover:bg-orange-500 cursor-pointer focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="submit">
                                            Küldés
                                        </button>
                                        <button type="button" onClick={(e) => deleteClass(element.displayName, element.id)} className="shadow rounded-l-none bg-white dark:bg-transparent dark:border dark:border-red-500 hover:bg-red-500 cursor-pointer focus:shadow-outline focus:outline-none text-red-500 hover:text-white font-bold py-2 px-4 rounded">
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

    if (isLoading) return <Loading title={title} />

    return (
        <Container title={title}>
            <ClassesMenu setIsLoading={setIsLoading} />
            <div className="shadow-sm w-fit mt-1 mx-auto break-words">
                <table className="w-full text-sm text-left rtl:text-right">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Azonosító
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Elnevezés
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Helyszín
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Kategória
                            </th>
                            <th scope="col" className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        { renderClasses() }
                    </tbody>
                </table>
            </div>
            { renderEdit() }
        </Container>
  );
}

export default Departments;