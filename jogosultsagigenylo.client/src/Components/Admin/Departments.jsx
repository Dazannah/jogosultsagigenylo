import React from "react";
import { useEffect, useState, useRef } from "react";

import DepartmentsMenu from "./DepartmentsMenu"
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
    const [locations, setLocations] = useState([])
    const [categories, setCategories] = useState([])

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
                    setLocations(data.locations)
                    setDepartments(data.departments);
                    setCategories(data.categories);

                    setIsLoading(false);
                })
                .catch(error => {
                    dispatch({ type: "flashMessageError", value: {error} });
                });
        }
    }, [isLoading])

    async function editClass(e) {
        e.preventDefault();
        const departmentId = e.target.id.value;

        const body = {
            departmentNumber: e.target.departmentNumber.value,
            displayName: e.target.displayName.value,
            locationId: e.target.locationId.value,
            categoryId: e.target.categoryId.value
        };

        fetch(`/api/departments/edit/${departmentId}`, {
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

    function renderDepartments() {
        if (departments.length === 0) return null

        return departments.map(department => {
            return (
                <tr id={`${department.id}`} className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600`} key={`${department.id}`}>
                    <td className="px-6 py-4">
                        {department.departmentNumber}
                    </td>
                    <td className="px-6 py-4">
                        <span>{department.displayName}</span>
                    </td>
                    <td className="px-6 py-4">
                        {department.location.displayName}
                    </td>
                    <td className="px-6 py-4">
                        {department.category.displayName}
                    </td>
                    <td className="px-1 py-4">
                        <div className="flex place-content-end">
                            <button id={`${department.id}EditButton`} onClick={() => showDiv(`edit-class-div-${department.id}`)} className="bg-transparent py-1 px-1 text-orange-500 text-sm transition-all dark:bg-gray-700 hover:cursor-pointer hover:underline">
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
                                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                            <label className={`${CssClasses.label}`} htmlFor="departmentNumber">
                                                Azonosító
                                            </label>
                                            <input name="departmentNumber" className={`${CssClasses.input}`} id="departmentNumber" autoComplete="off" type="text" placeholder="Azonosító" defaultValue={element.departmentNumber} required />
                                        </div>
                                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                            <label className={`${CssClasses.label}`} htmlFor="displayName">
                                                Elnevezés
                                            </label>
                                            <input name="displayName" className={`${CssClasses.input}`} id="displayName" autoComplete="off" type="text" placeholder="Elnevezés" defaultValue={element.displayName} required />
                                        </div>
                                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                            <label className={`${CssClasses.label}`} htmlFor="locationId">
                                                Helyszín
                                            </label>
                                            <select name="locationId" key="add-auth-item-statuses" className="w-full rounded border bg-gray-100 dark:bg-gray-900 border-teal-700 focus:border-orange-500 cursor-pointer py-3 px-4 mb-3" id="statuses" required>
                                                <option key={`add-department-choose`} value={element.location.id}>
                                                    {element.location.displayName}
                                                </option>
                                                {
                                                    locations.map(location => {
                                                        if (element.location.id != location.id)
                                                        return (
                                                            <option key={`add-department-choose-${location.id}`} value={location.id}>
                                                                {location.displayName}
                                                            </option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </div>
                                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                            <label className={`${CssClasses.label}`} htmlFor="category">
                                                Kategória
                                            </label>
                                            <select name="categoryId" key="add-category" className="w-full rounded border bg-gray-100 dark:bg-gray-900 border-teal-700 focus:border-orange-500 cursor-pointer py-3 px-4 mb-3" id="statuses" required>
                                                <option key={`add-category-choose`} value={element.category.id }>{element.category.displayName}</option>
                                                {
                                                    categories.map(category => {
                                                        if (element.category.id != category.id)
                                                        return (
                                                            <option key={`add-category-choose-${category.id}`} value={category.id}>
                                                                {category.displayName}
                                                            </option>
                                                        )
                                                    })
                                                }
                                            </select>
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
            <DepartmentsMenu setIsLoading={setIsLoading} locations={locations} categories={categories} />
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
                        { renderDepartments() }
                    </tbody>
                </table>
            </div>
            { renderEdit() }
        </Container>
  );
}

export default Departments;