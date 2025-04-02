import React from "react";
import { useEffect, useState } from "react";

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

import AdminSubAuthItem from "./AdminIncludes/AdminSubAuthItem"
import AdminAuthItemColumn from './AdminIncludes/AdminAuthItemColumn'
import Container from "../Container";

import { AppContext, DispatchContext } from "../../main";
import Loading from "../Loading";
function SubAuthorizations() {
    const dispatch = React.useContext(DispatchContext);

    const title = "Aljogosultságok"
    const [authItems, setAuthItems] = useState([]);
    const [isLoading, setIsloading] = useState(true);

    const [activeItem, setActiveItem] = useState(null)

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

    useEffect(() => {
        if (isLoading) {
            fetch("/api/subauthitems")
                .then(response => {
                    return response.json()
                })
                .then(data => {
                    setAuthItems(data.authItems)

                    setIsloading(false)
                })
                .catch(error => {
                    dispatch({ type: "flashMessageError", action: { message: error.errors } });
                })
        }
    }, [isLoading])

    function renderSubAuthItems(authItem) {
        return authItem.subAuthItems.map(subAuthItem => {
            return (
                <span key={`subAuthItem-span-${subAuthItem.subAuthItemId}`}>{subAuthItem.id} {subAuthItem.displayName} {subAuthItem.subAuthItemId}</span>
            )
        })
    }

    function renderAuthItems(){
        return authItems.map(authItem => {
            console.log(authItem)
            return (
                <div key={`authItem-div-${authItem.id}`}>
                    <span key={`authItem-span-${authItem.id}`}>{authItem.displayName} items: </span>
                    {
                        renderSubAuthItems(authItem)
                    }
                    <br />
                </div>
            )
        })
    }

    if (isLoading) return (
        <Container title={title}>
            <Loading></Loading>
        </Container>
    )

    return (
        <Container title={title}>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} >
                <div className="flex flex-wrap">


                    {authItems.map(authItem => {
                        return (
                            //<AdminColumn id={`${column.id}-div`} key={`admin-column-key-${column.id}`} column={column} statuses={statuses} columns={columns} setIsLoading={setIsLoading} setActiveItem={setActiveItem} />
                            < AdminAuthItemColumn id={`${authItem.id}-div`} key={`admin-authItem-key-${authItem.id}`} authItem={authItem} subAuthItems={authItem.subAuthItems} setActiveItem={setActiveItem} />
                        );
                    })}


                    <DragOverlay >
                        {activeItem ?
                            <table className="w-full">
                                <tbody>
                                    {/*<AdminAuthItem id={`${activeItem.id}-tr`} key={`admin-authItem-key-${activeItem.id}`} authItem={activeItem} columnId={activeItem.id} showDiv={() => { }} grabbing={true} />*/}
                                    <AdminSubAuthItem id={`${activeItem.id}-tr`} key={`admin-activeItem-key-${activeItem.id}`} subAuthItem={activeItem} subAuthItemId={activeItem.id} />
                                </tbody>
                            </table>
                            : null}
                    </DragOverlay>
                </div>
            </DndContext>
        </Container>
    )
  //return (
  //    <Container title={title}>
          
          
  //            <>
  //                {renderAuthItems()}
  //            </>
          
          
  //    </Container>
  //);
}

export default SubAuthorizations;