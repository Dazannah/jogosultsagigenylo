import React from "react";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import DepartmentsMenu from "./DepartmentsMenu"
import Container from "../Container";
import Loading from "../Loading";
import CssClasses from "../../CssClasses";

import { DispatchContext } from "../../main";
function Departments() {
    const dispatch = React.useContext(DispatchContext);
    const classFormRef = useRef();
    const navigate = useNavigate();

    const title = "Osztályok"
    const [isLoading, setIsLoading] = useState(true)
    const [departments, setDepartments] = useState([])
    const [locations, setLocations] = useState([])
    const [categories, setCategories] = useState([])

    const [displayName, setDisplayName] = useState()
    const [departmentNumber, setDepartmentNumber] = useState()
    const [locationId, setLocationId] = useState()
    const [categoryId, setCategoryId] = useState()
    const [page, setPage] = useState(1)
    const [itemsOnPage, setItemsOnPage] = useState(10)
    const [maxPageNumber, setMaxPageNumber] = useState(1)

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
            fetch(`/api/departments${window.location.search}`)
                .then(response => {
                    if (response.ok) {
                        return response.json()
                    } else {
                        throw new Error(response.statusText)
                    }
                })
                .then(data => {
                    setLocations(data.locations)
                    setDepartments(data.departments)
                    setCategories(data.categories)
                    setMaxPageNumber(Math.ceil(data.maxPageNumber))

                    const queryString = new URLSearchParams(window.location.search)
                    setDisplayName(queryString.get("DisplayName"))
                    setDepartmentNumber(queryString.get("DepartmentNumber"))
                    setLocationId(queryString.get("LocationId"))
                    setCategoryId(queryString.get("CategoryId"))

                    const page = queryString.get("Page") > Math.ceil(data.maxPageNumber) ? Math.ceil(data.maxPageNumber) : queryString.get("Page")
                    setPage(page ?? 1)
                    setItemsOnPage(queryString.get("ItemsOnPage"))

                    setIsLoading(false);
                })
                .catch(error => {
                    dispatch({ type: "flashMessageError", value: {error} });
                });


        }
    }, [isLoading])

    useEffect(() => {
        filter()
    },[page])

    async function editClass(e) {
        e.preventDefault();
        const departmentId = e.target.id.value;

        const body = {
            DepartmentNumber: e.target.departmentNumber.value,
            DisplayName: e.target.displayName.value,
            LocationId: e.target.locationId.value,
            CategoryId: e.target.categoryId.value
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
                    const responseObj = await response.json()
                    dispatch({ type: "flashMessageWarning", value: responseObj })
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

    function filter() {
        const addParams = {
            DepartmentNumber: departmentNumber,
            DisplayName: displayName,
            LocationId: locationId,
            CategoryId: categoryId,
            Page: page,
            ItemsOnPage: itemsOnPage
        }

        const queryString = new URLSearchParams(window.location.search)

        for (const [key, value] of Object.entries(addParams)) {
            if (value)
                queryString.set(key, value)
            else
                queryString.delete(key)
        }

        navigate(`/admin/departments?${queryString}`, { replace: true });
        setIsLoading(true)
    }

    function resetFilter() {
        navigate(`/admin/departments`, { replace: true });
        setIsLoading(true)
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
                            <button id={`${department.id}EditButton`} onClick={() => showDiv(`edit-class-div-${department.id}`)} className="bg-transparent py-1 px-1 text-orange-500 text-sm transition-all hover:cursor-pointer hover:underline">
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
                                            <input name="departmentNumber" className={`${CssClasses.input}`} id="departmentNumber" autoComplete="off" type="text" placeholder="Azonosító" defaultValue={element.departmentNumber} />
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
                                            <select defaultValue={element.location.id} name="locationId" key="add-auth-item-statuses" className="w-full rounded border bg-gray-100 dark:bg-gray-900 border-teal-700 focus:border-orange-500 cursor-pointer py-3 px-4 mb-3" id="statuses" required>
                                                {
                                                    locations.map(location => {
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
                                            <select defaultValue={element.category.id} name="categoryId" key="add-category" className="w-full rounded border bg-gray-100 dark:bg-gray-900 border-teal-700 focus:border-orange-500 cursor-pointer py-3 px-4 mb-3" id="statuses" required>
                                                {
                                                    categories.map(category => {
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
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                <input onKeyUp={e => setDepartmentNumber(e.target.value)}
                                    name="departmentNumberFilter"
                                    className="appearance-none block w-full bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-white focus:bg-white dark:focus:bg-gray-700 border border-teal-700 focus:border-orange-500 rounded py-1 px-1 leading-tight focus:outline-none"
                                    id="departmentNumberFilter" autoComplete="off" type="text" placeholder="Azonosító" defaultValue={departmentNumber} />
                            </th>
                            <th scope="col" className="px-6 py-3">
                                <input onKeyUp={e => setDisplayName(e.target.value)}
                                    name="displayNameFilter"
                                    className="appearance-none block w-full bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-white focus:bg-white dark:focus:bg-gray-700 border border-teal-700 focus:border-orange-500 rounded py-1 px-1 leading-tight focus:outline-none"
                                    id="displayNameFilter" autoComplete="off" type="text" placeholder="Elnevezés" defaultValue={displayName} />
                            </th>
                            <th scope="col" className="px-6 py-3">
                                <select
                                    defaultValue={locationId}
                                    onChange={e => setLocationId(e.target.value)}
                                    name="locationIdFilter"
                                    className="block w-full bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-white focus:bg-white dark:focus:bg-gray-700 border border-teal-700 focus:border-orange-500 rounded py-1 px-1 leading-tight focus:outline-none">
                                    <option key={`add-department-choose`} value="">
                                        Válassz
                                    </option>
                                    {
                                        locations.map(location => {
                                            return (
                                                <option key={`add-department-choose-${location.id}`} value={location.id}>
                                                        {location.displayName}
                                                    </option>
                                                )
                                        })
                                    }
                                </select>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                <select
                                    defaultValue={categoryId}
                                    onChange={e => setCategoryId(e.target.value)}
                                    name="categoryId" key="add-category"
                                    className="block w-full bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-white focus:bg-white dark:focus:bg-gray-700 border border-teal-700 focus:border-orange-500 rounded py-1 px-1 leading-tight focus:outline-none">
                                    <option key={`add-category-choose`} value="">
                                        Válassz
                                    </option>
                                    {
                                        categories.map(category => {
                                            return (
                                                <option key={`add-category-choose-${category.id}`} value={category.id}>
                                                    {category.displayName}
                                                </option>
                                            )
                                        })
                                    }
                                </select>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                {/*<button className="shadow bg-teal-700 hover:bg-orange-500 cursor-pointer focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" >*/}
                                {/*    Szűrés*/}
                                {/*</button>*/}
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} className="size-6 stroke-current hover:stroke-green-500 hover:cursor-pointer" onClick={filter}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} className="size-6 stroke-current hover:stroke-red-500 hover:cursor-pointer" onClick={resetFilter}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        { renderDepartments() }
                    </tbody>
                </table>
            </div>
            <div className="flex flex-col items-center">

                <div className="inline-flex mt-2 xs:mt-0">
                    <button onClick={() => setPage(+page - 1 > 0 ? +page - 1 : 0)} className="flex items-center border justify-center px-3 h-8 text-sm font-medium text-gray-700 bg-gray-100 rounded-s hover:bg-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white hover:cursor-pointer">
                        Előző
                    </button>
                    <button onClick={() => setPage(+page + 1 <= maxPageNumber ? +page + 1 : maxPageNumber)} className="flex items-center border justify-center px-3 h-8 text-sm font-medium text-gray-700 bg-gray-100 rounded-e hover:bg-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white hover:cursor-pointer">
                        Következő
                    </button>
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-400">
                    <span className="font-semibold text-gray-900 dark:text-white">{page}/{maxPageNumber}.</span> oldal
                </span>
            </div>
            { renderEdit() }
        </Container>
  );
}

export default Departments;