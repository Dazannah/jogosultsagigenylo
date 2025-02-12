import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    useSensor,
    useSensors,
    DragOverlay,
    useDndMonitor
} from '@dnd-kit/core';

import { MyPointerSensor } from "../../Classes/MyPointerSensor"

import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    horizontalListSortingStrategy,
} from '@dnd-kit/sortable';

import Container from "../Container";
import Loading from "../Loading";
import AuthorizationMenu from "./AuthorizationMenu";
import AdminColumn from "./AdminIncludes/AdminColumn"
import AdminAuthItem from "./AdminIncludes/AdminAuthItem"

import { AppContext, DispatchContext } from "../../main";
function Authorization() {
    const appState = React.useContext(AppContext);
    const dispatch = React.useContext(DispatchContext);

    const [activeItem, setActiveItem] = useState(null)

    const title = "Jogosultságok";
    const [isLoading, setIsLoading] = useState(true);
    const [columns, setColumns] = useState([]);
    const [statuses, setSatuses] = useState([]);

    useEffect(() => {
        if (isLoading) {
            fetch("/api/authitems")
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    setColumns(data.columnsDTO);
                    setSatuses(data.statuses);
                    setIsLoading(false);
                })
                .catch(error => {
                    dispatch({ type: "flashMessageError", action: error.errors });
                });
        }
    }, [isLoading]);

    const sensors = useSensors(
        useSensor(MyPointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    async function handleDragEnd(event) {
        const { active, over } = event;
        const activeId = +active.id.split("-")[0]
        const overId = +over.id.split("-")[0]
        if (active.id !== over.id && +active.id.split("-")[2] === +over.id.split("-")[2]) {
                const columnId = +active.id.split("-")[2]
                let columnIdx

                let oldIndex = -1
                let newIndex = -1

                let tempColumns = columns

                const newColumns = tempColumns.map((column, cIdx) => {
                    if (column.id === columnId) {
                        columnIdx = cIdx

                        column.authItems.map((authItem, idx) => {
                            if (authItem.id === activeId) oldIndex = idx
                            if (authItem.id === overId) newIndex = idx
                        })

                        column.authItems = arrayMove(column.authItems, oldIndex, newIndex)

                        column.authItems.forEach((authItem, aIdx) => {
                            authItem.position = aIdx + 1
                        })
                    }

                    return column
                })

                const authItems = columns[columnIdx].authItems

                await updateAuthItemOrder(authItems, columnId)
                setColumns(newColumns);
            }


    }

    async function updateAuthItemOrder(authItems, columnId) {
        fetch(`/api/authitems/update-order/${columnId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(authItems)
        })
            .then(async response => {
                if (response.ok) {
                    dispatch({ type: "flashMessageSuccess", value: { message: "AuthSorrend mentve." } });
                } else {
                    dispatch({ type: "flashMessageWarning", value: { message: response.statusText } });
                }
            })
            .catch(error => {
                dispatch({ type: "flashMessageError", value: error.errors });
            });
    }

    async function updateColumnsOrder(columns) {
        const ids = columns.map(column => {
            return column.id
        })

        fetch("/api/columns/update-order", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(ids)
        })
            .then(async response => {
                if (response.ok) {
                    dispatch({ type: "flashMessageSuccess", value: { message: "Sorrend mentve." } });
                } else {
                    dispatch({ type: "flashMessageWarning", value: { message: response.statusText } });
                }
            })
                .catch(error => {
                    dispatch({ type: "flashMessageError", value: error.errors });
                });
    }

    if (isLoading) return <Loading title={title} />;

    return (
        <Container title={title}>
            <AuthorizationMenu columns={columns} statuses={statuses} setIsLoading={setIsLoading} />
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} >
                <div className="flex flex-wrap">


                        {columns.map(column => {
                            return (

                                <AdminColumn id={`${column.id}-div`} key={`admin-column-key-${column.id}`} column={column} statuses={statuses} columns={columns} setIsLoading={setIsLoading} setActiveItem={setActiveItem} />

                                );
                            })}


                    <DragOverlay >
                        {activeItem ?
                            <table className="w-full">
                                <tbody>
                                    <AdminAuthItem id={`${activeItem.id}-tr`} key={`admin-authItem-key-${activeItem.id}`} authItem={activeItem} columnId={activeItem.id} showDiv={() => { }} grabbing={true} />
                                </tbody>
                            </table>
                            : null}
                    </DragOverlay>
                </div>
            </DndContext>
        </Container>
    );
}

export default Authorization;
