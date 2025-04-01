import React from "react"
import { Link, Navigate } from "react-router-dom"
import { useEffect, useState, useRef } from "react"
import { Router } from "react-router-dom"

import Container from "../Container";

import CssClasses from "../../CssClasses"

import { AppContext, DispatchContext } from "../../main"
function AuthorizationMenu(props) {
    const appState = React.useContext(AppContext)
    const dispatch = React.useContext(DispatchContext)

    const authItemFormRef = useRef();
    const columnFormRef = useRef();
    function showDiv(divId) {
        const div = document.getElementById(divId)

        div.classList.remove("hidden")
    }
    function hideDiv(divId) {
        const div = document.getElementById(divId)

        div.classList.add("hidden")
    }

    async function createAuthItem(e) {
        e.preventDefault()

        const body = {
            displayName: e.target.displayName.value,
            columnId: e.target.columnId.value,
            statusId: e.target.statusId.value
        }

        fetch("/api/authitems/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
            .then(async response => {
                if (response.ok) {
                    props.setIsLoading(true)
                    dispatch({ type: "flashMessageSuccess", value: { message: "Létrehozás sikeres." } })
                } else {
                    const msg = await response.json()
                    dispatch({ type: "flashMessageWarning", value: msg ?? { message: response.statusText } })
                }
            }).catch(error => {
                dispatch({ type: "flashMessageError", value: { message: response.statusText } })
            })
    }

    async function createColumn(e) {
        e.preventDefault()

        const body = {
            displayName: e.target.displayName.value,
            statusId: e.target.statusId.value
        }

        fetch("/api/columns/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
            .then(async response => {
                if (response.ok) {
                    props.setIsLoading(true)
                    dispatch({ type: "flashMessageSuccess", value: { message: "Létrehozás sikeres." } })
                } else {
                    const msg = await response.json()
                    dispatch({ type: "flashMessageWarning", value: { message: response.statusText } })
                }
            }).catch(error => {
                dispatch({ type: "flashMessageError", value: { message: response.statusText } })
            })
    }



    return (
        <>
            <div id="add-auth-item-div" key="add-auth-item-div-key" className="fixed top-0 left-0 w-screen h-screen flex items-center bg-gray-500/50 hidden">
                <Container>
                    <div className="bg-white w-fit m-auto rounded-lg dark:bg-gray-800 dark:text-gray-300">
                        <div className="flex font-semibold text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-300 rounded-t-lg">
                            <div className="flex md:w-1/2 place-content-start p-2"><span>Jogosultság hozzáadása</span></div>
                            <div className="flex md:w-1/2 place-content-end p-2">

                                <svg onClick={() => hideDiv("add-auth-item-div")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 hover:cursor-pointer">
                                    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                        <form ref={authItemFormRef} onSubmit={createAuthItem} className="w-full max-w-5xl mx-auto p-5 shadow-md dark:bg-gray-800 rounded-b-lg">
                            <div className="flex flex-wrap -mx-3 mb-6">
                                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                    <label className={`${CssClasses.label}`} htmlFor="displayName">
                                        Elnevezés
                                    </label>
                                    <input name="displayName" className={`${CssClasses.input}`} id="displayName" autoComplete="off" type="text" placeholder="Elnevezés" required />
                                </div>
                                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                    <label className={`${CssClasses.label}`} htmlFor="columns">
                                        Oszlop
                                    </label>
                                    <select name="columnId" key="add-auth-item-classes" className="w-full rounded border bg-gray-100 dark:bg-gray-900 border-teal-700 focus:border-orange-500 cursor-pointer py-3 px-4 mb-3" id="columns" required>
                                        <option value="">Válassz egyet</option>
                                        {
                                            props.columns.map(column => {
                                                return <option key={`add-auth-item-columns${column.id}`} value={column.id}>{column.displayName}</option>
                                            })
                                        }
                                    </select>
                                </div>
                                <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                                    <label className={`${CssClasses.label}`} htmlFor="statuses">
                                        Státusz
                                    </label>
                                    <select name="statusId" key="add-auth-item-statuses" className="w-full rounded border bg-gray-100 dark:bg-gray-900 border-teal-700 focus:border-orange-500 cursor-pointer py-3 px-4 mb-3" id="statuses" required>
                                        {
                                            props.statuses.map(status => {
                                                return <option key={`add-auth-item-statuses${status.id}`} value={status.id}>{status.displayName}</option>
                                            })
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="md:w-2/3">
                                <button className="shadow bg-teal-700 hover:bg-orange-500 cursor-pointer focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="submit">
                                    Küldés
                                </button>
                            </div>
                        </form>
                    </div>
                </Container>
            </div>
            <div id="add-column-div" key="add-column-div-key" className="fixed top-0 left-0 w-screen h-screen flex items-center bg-gray-500/50 hidden">
                <Container>
                    <div className="bg-white w-fit m-auto rounded-lg dark:bg-gray-800 dark:text-gray-300">
                        <div className="flex font-semibold text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-300 rounded-t-lg">
                            <div className="flex md:w-1/2 place-content-start p-2"><span>Oszlop hozzáadása</span></div>
                            <div className="flex md:w-1/2 place-content-end p-2">

                                <svg onClick={() => hideDiv("add-column-div")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 hover:cursor-pointer">
                                    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                        <form ref={columnFormRef} onSubmit={createColumn} className="w-full max-w-5xl mx-auto p-5 shadow-md rounded-b-lg">
                            <div className="flex flex-wrap -mx-3 mb-6">
                                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                    <label className={`${CssClasses.label}`} htmlFor="displayName">
                                        Elnevezés
                                    </label>
                                    <input className={`${CssClasses.input}`} id="displayName" name="displayName" autoComplete="off" type="text" placeholder="Elnevezés" required />
                                </div>
                                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                    <label className={`${CssClasses.label}`} htmlFor="statuses">
                                        Státusz
                                    </label>
                                    <select name="statusId" key="add-column-statuses" className="w-full rounded border bg-gray-100 dark:bg-gray-900 border-teal-700 focus:border-orange-500 cursor-pointer py-3 px-4 mb-3" id="statuses" required>
                                        {
                                            props.statuses.map(status => {
                                                return <option key={`add-column-statuses${status.id}`} value={status.id}>{status.displayName}</option>
                                            })
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="md:w-2/3">
                                <button className="shadow bg-teal-700 hover:bg-orange-500 cursor-pointer focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="submit">
                                    Küldés
                                </button>
                            </div>
                        </form>
                    </div>
                </Container>
            </div>
            <div className="w-full p-5 bg-gray-50 dark:bg-gray-800">
                <button onClick={() => showDiv("add-auth-item-div")} className="bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 rounded-md rounded-r-none border border-green-500 hover:border-transparent rounded hover:cursor-pointer">
                    Jogosultság hozzáadása
                </button>
                <button onClick={() => showDiv("add-column-div")} className="bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 rounded-md rounded-l-none border border-green-500 hover:border-transparent rounded hover:cursor-pointer">
                    Oszlop hozzáadása
                </button>
            </div>
        </>
    );
}

export default AuthorizationMenu;