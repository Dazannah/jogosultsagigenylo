﻿import React from "react";
import { useState } from "react";
import { useSortable } from '@dnd-kit/sortable';
import { useDndMonitor } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    horizontalListSortingStrategy,
} from '@dnd-kit/sortable';

import CssClasses from "../../../CssClasses";
import Container from "../../Container"
import AdminSubAuthItem from "./AdminSubAuthItem"

import { DispatchContext } from "../../../main";
function AdminAuthItemColumn(props) {
    const column = props.column
    const statuses = props.statuses
    const authItem = props.authItem
    const subAuthItem = props.subAuthItem
    const subAuthItems = props.subAuthItems
    const setIsLoading = props.setIsLoading

    const dispatch = React.useContext(DispatchContext);

    //async function editColumn(e) {
    //    e.preventDefault();
    //    const columnId = e.target.columnId.value;

    //    const body = {
    //        displayName: e.target.displayName.value,
    //        statusId: e.target.statusId.value
    //    };
    //    fetch(`/api/columns/edit/${columnId}`, {
    //        method: "PATCH",
    //        headers: {
    //            "Content-Type": "application/json"
    //        },
    //        body: JSON.stringify(body)
    //    })
    //        .then(async response => {
    //            if (response.ok) {
    //                setIsLoading(true);
    //                dispatch({ type: "flashMessageSuccess", value: { message: "Szerkesztés sikeres." } });
    //            } else {
    //                dispatch({ type: "flashMessageWarning", value: { message: response.statusText } });
    //            }
    //        })
    //        .catch(error => {
    //            dispatch({ type: "flashMessageError", value: error.errors ?? { error } });
    //        });
    //}

    async function editSubAuthItem(e) {
        e.preventDefault();
        const authItemId = e.target.authItemId.value;

        const body = {
            displayName: e.target.displayName.value,
            statusId: e.target.statusId.value,
            columnId: e.target.columnId.value,
            position: e.target.position.value
        };

        fetch(`/api/authitems/edit/${authItemId}`, {
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
    //async function deleteColumn(columnId, columnDisplayName) {
    //    if (confirm(`Ezzel törlöd mindenhonnan a/az ${columnDisplayName}hoz tartozó jogosultságot, minden felhasználótól.`))
    //        fetch(`/api/columns/delete/${columnId}`, {
    //            method: "DELETE",
    //            headers: {
    //                "Content-Type": "application/json"
    //            },
    //            body: JSON.stringify({})
    //        })
    //            .then(async response => {
    //                if (response.ok) {
    //                    setIsLoading(true);
    //                    dispatch({ type: "flashMessageSuccess", value: { message: "Törlés sikeres." } });
    //                } else {
    //                    dispatch({ type: "flashMessageWarning", value: { message: response.statusText } });
    //                }
    //            })
    //            .catch(error => {
    //                dispatch({ type: "flashMessageError", value: error.errors ?? { error } });
    //            });
    //}

    //async function deleteAuthItem(authItemId, authItemName) {
    //    if (confirm(`Ezzel törlöd mindenhonnan a/az ${authItemName}hoz tartozó jogosultságot, minden felhasználótól.`))
    //        fetch(`/api/authitems/delete/${authItemId}`, {
    //            method: "DELETE",
    //            headers: {
    //                "Content-Type": "application/json"
    //            },
    //            body: JSON.stringify({})
    //        })
    //            .then(async response => {
    //                if (response.ok) {
    //                    setIsLoading(true);
    //                    dispatch({ type: "flashMessageSuccess", value: { message: "Törlés sikeres." } });
    //                } else {
    //                    dispatch({ type: "flashMessageWarning", value: { message: response.statusText } });
    //                }
    //            })
    //            .catch(error => {
    //                dispatch({ type: "flashMessageError", value: error.errors ?? { error } });
    //            });
    //}
    function showDiv(divId) {
        const div = document.getElementById(divId);

        div.classList.remove("hidden");
    }
    function hideDiv(divId) {
        const div = document.getElementById(divId);

        div.classList.add("hidden");
    }

    useDndMonitor({
        onDragStart(event) {
            const eventActiveId = +event.active.id.split("-")[0]
            subAuthItems.forEach(subAuthItem => {
                if (subAuthItem.id === eventActiveId) {
                    props.setActiveItem(subAuthItem)
                    return
                }
            })
        },
        onDragEnd(event) {
            props.setActiveItem(null)
            return
        }
    })

    return (
        <>
            <div id={`${authItem.id}-div`} key={`${authItem.id}WrapperDiv`} className="shadow-sm w-1/3 mt-1 mx-auto break-words">
                <table className="w-full text-sm text-left rtl:text-right">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th colSpan="4" className="w-max px-6 py-3">
                                {authItem.displayName}
                            </th>
                        </tr>
                        <tr>
                            <th scope="col" className="px-6 py-3"></th>
                            <th scope="col" className="px-6 py-3">
                                Elnevezés
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Státusz
                            </th>
                            <th scope="col" className="px-6 py-3">
                                <div className="flex place-content-end">
                                    <button onClick={() => showDiv(`edit-subAuthItem-${subAuthItem.id}-div`)} className="rounded-md bg-transparent py-1 px-1 border border-orange-500 text-orange-500 text-sm transition-all shadow-md hover:text-white hover:bg-orange-500 hover:cursor-pointer hover:shadow-lg focus:shadow-none active:shadow-none">
                                        Szerkesztés
                                    </button>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <SortableContext items={subAuthItems} strategy={horizontalListSortingStrategy}>
                            {subAuthItems.map(subAuthItem => {
                                return (
                                    <AdminSubAuthItem id={`${subAuthItem.id}-tr`} key={`admin-subAuthItem-key-${subAuthItem.id}`} subAuthItem={subAuthItem} subAuthItemId={subAuthItem.id} showDiv={showDiv} />
                                );
                            })}
                        </SortableContext>
                    </tbody>
                </table>
                {/*<div id={`edit-authItem-${subAuthItem.id}-div`} key="add-auth-item-div-key" className="fixed top-0 left-0 w-screen h-screen flex items-center bg-gray-500/50 hidden">*/}
                {/*    <Container>*/}
                {/*        <div className="bg-white w-fit m-auto rounded-lg dark:bg-gray-800 dark:text-gray-300">*/}
                {/*            <div className="flex font-semibold text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-300 rounded-t-lg">*/}
                {/*                <div className="flex md:w-1/2 place-content-start p-2">*/}
                {/*                    <span>{subAuthItem.displayName}</span>*/}
                {/*                </div>*/}
                {/*                <div className="flex md:w-1/2 place-content-end p-2">*/}
                {/*                    <svg onClick={() => hideDiv(`edit-subAuthItem-${subAuthItem.id}-div`)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 hover:cursor-pointer">*/}
                {/*                        <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />*/}
                {/*                    </svg>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*            <form onSubmit={} className="w-full max-w-5xl mx-auto p-5 shadow-md rounded-b-lg">*/}
                {/*                <div className="flex flex-wrap -mx-3 mb-6">*/}
                {/*                    <input type="hidden" value={subAuthItem.id} name="subAuthItemId" />*/}
                {/*                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">*/}
                {/*                        <label className={`${CssClasses.label}`} htmlFor="displayName">*/}
                {/*                            Elnevezés*/}
                {/*                        </label>*/}
                {/*                        <input defaultValue={subAuthItem.displayName} name="displayName" className={CssClasses.input} id="displayName" autoComplete="off" type="text" placeholder="Elnevezés" required />*/}
                {/*                    </div>*/}
                {/*                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">*/}
                {/*                        <label className={`${CssClasses.label}`} htmlFor="statuses">*/}
                {/*                            Státusz*/}
                {/*                        </label>*/}
                {/*                        <select defaultValue={subAuthItem.status.id} name="statusId" key="add-auth-item-statuses" className="w-full rounded border bg-gray-100 dark:bg-gray-900 border-teal-700 focus:border-orange-500 cursor-pointer py-3 px-4 mb-3" id="statuses" required>*/}
                {/*                            {statuses.map(status => {*/}
                {/*                                return (*/}
                {/*                                    <option key={`add-auth-item-statuses${status.id}`} value={status.id}>*/}
                {/*                                        {status.displayName}*/}
                {/*                                    </option>*/}
                {/*                                );*/}
                {/*                            })}*/}
                {/*                        </select>*/}
                {/*                    </div>*/}
                {/*                </div>*/}
                {/*                <div className="md:w-2/3">*/}
                {/*                    <button className="shadow rounded-r-none bg-teal-700 hover:bg-orange-500 cursor-pointer focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="submit">*/}
                {/*                        Mentés*/}
                {/*                    </button>*/}
                {/*                    <button type="button" onClick={() => deleteColumn(subAuthItem.id, subAuthItem.displayName)} className="shadow rounded-l-none bg-white dark:bg-transparent dark:border dark:border-red-500 hover:bg-red-500 cursor-pointer focus:shadow-outline focus:outline-none text-red-500 hover:text-white font-bold py-2 px-4 rounded">*/}
                {/*                        Törlés*/}
                {/*                    </button>*/}
                {/*                </div>*/}
                {/*            </form>*/}
                {/*        </div>*/}
                {/*    </Container>*/}
                {/*</div>*/}
                {
                    subAuthItems.map(subAuthItem => {
                        return (
                            <div id={`edit-auth-item-div-${subAuthItem.id}`} key={`edit-auth-item-key-${subAuthItem.id}`} className="fixed top-0 left-0 w-screen h-screen flex items-center bg-gray-500/50 hidden">
                                <Container>
                                    <div className="bg-white w-fit m-auto rounded-lg dark:bg-gray-800 dark:text-gray-300">
                                        <div className="flex font-semibold text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-300 rounded-t-lg">
                                            <div className="flex md:w-1/2 place-content-start p-2">
                                                <span>{subAuthItem.displayName}</span>
                                            </div>
                                            <div className="flex md:w-1/2 place-content-end p-2">
                                                <svg onClick={() => hideDiv(`edit-auth-item-div-${subAuthItem.id}`)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 hover:cursor-pointer">
                                                    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>
                                        <form onSubmit={editSubAuthItem} className="w-full max-w-5xl mx-auto p-5 shadow-md dark:bg-gray-800 rounded-b-lg">
                                            <input name="subAuthItemId" value={subAuthItem.id} type="hidden" />
                                            <div className="flex flex-wrap -mx-3 mb-6">
                                                <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                                                    <label className={`${CssClasses.label}`} htmlFor="displayName">
                                                        Elnevezés
                                                    </label>
                                                    <input name="displayName" className={`${CssClasses.input}`} id="displayName" autoComplete="off" type="text" placeholder="Elnevezés" defaultValue={authItem.displayName} required />
                                                </div>
                                                <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                                                    <label className={`${CssClasses.label}`} htmlFor="columns">
                                                        Oszlop
                                                    </label>
                                                    <select defaultValue={authItem.id} name="columnId" key="add-auth-item-classes" className="w-full rounded border bg-gray-100 dark:bg-gray-900 border-teal-700 focus:border-orange-500 cursor-pointer py-3 px-4 mb-3" id="columns" required>

                                                    </select>
                                                </div>
                                                <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                                                    <label className={`${CssClasses.label}`} htmlFor="statuses">
                                                        Státusz
                                                    </label>
                                                    <select defaultValue={subAuthItem.status.id} name="statusId" key="add-auth-item-statuses" className="w-full rounded border bg-gray-100 dark:bg-gray-900 border-teal-700 focus:border-orange-500 cursor-pointer py-3 px-4 mb-3" id="statuses" required>
                                                        <option value={subAuthItem.status.id}>{subAuthItem.status.displayName}</option>
                                                    </select>
                                                </div>
                                                <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                                                    <label className={`${CssClasses.label}`} htmlFor="position">
                                                        Pozíció
                                                    </label>
                                                    <input name="position" className={`${CssClasses.input}`} id="position" autoComplete="off" type="number" placeholder="Elnevezés" defaultValue={authItem.position} required />
                                                </div>
                                            </div>
                                            <div className="md:w-2/3">
                                                <button className="shadow border-teal-700 rounded-r-none bg-teal-700 hover:bg-orange-500 cursor-pointer focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded rounded-r-none" type="submit">
                                                    Küldés
                                                </button>
                                                <button type="button" onClick={() => deleteAuthItem(subAuthItem.id, subAuthItem.displayName)} className="shadow bg-white border-red-500 rounded-l-none hover:bg-red-500 cursor-pointer focus:shadow-outline focus:outline-none text-red-500 hover:text-white font-bold py-2 px-4 rounded rounded-l-none">
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
            </div>

        </>
    );
}


export default AdminAuthItemColumn;