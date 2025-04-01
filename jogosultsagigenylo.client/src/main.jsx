import React from "react";
import { BrowserRouter, Routes, Route, Router } from "react-router-dom"
import { createRoot } from 'react-dom/client'
import { useImmerReducer } from "use-immer"
import './StyleSheet.css'

//components
import Home from "./Components/Home"
import Menu from "./Components/Menu"
import NewUser from "./Components/NewUser"

import AdminMenu from "./Components/Admin/AdminMenu"
import AdminHome from "./Components/Admin/AdminHome"
import Authorizations from "./Components/Admin/Authorizations"
import SubAuthorizations from "./Components/Admin/SubAuthorizations"
import Departments from "./Components/Admin/Departments"
import Locations from "./Components/Admin/Locations"
import Requests from "./Components/Admin/Requests"
import Users from "./Components/Admin/Users";

import FlashMessagesSuccess from "./Components/FlashMessages/FlashMessagesSuccess.jsx";
import FlashMessagesWarning from "./components/flashMessages/FlashMessagesWarrning.jsx";
import FlashMessagesError from "./components/flashMessages/FlashMessagesError.jsx";


const AppContext = React.createContext()
const DispatchContext = React.createContext()
function Main() {
    const adminPathnameRegex = new RegExp("^\/admin$|^\/admin\/.*$")

    const initialState = {
        flashMessageSuccess: {},
        flashMessageError: {},
        flashMessageWarrning: {},
    }

    function appReducer(draft, action) {
        switch (action.type) {
            case "flashMessageSuccess":
                draft.flashMessageSuccess = action.value
                return
            case "flashMessageError":
                draft.flashMessageError = action.value
                return
            case "flashMessageWarning":
                draft.flashMessageWarrning = action.value
                return
        }
    }

    const [state, dispatch] = useImmerReducer(appReducer, initialState)

    return (
        <AppContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                <BrowserRouter>
                    <FlashMessagesSuccess flashMessages={state.flashMessageSuccess} />
                    <FlashMessagesError flashMessages={state.flashMessageError} />
                    <FlashMessagesWarning flashMessages={state.flashMessageWarrning} />
                    {adminPathnameRegex.test(window.location.pathname) ? <AdminMenu /> : <Menu />}
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/new-user" element={<NewUser />} />

                        <Route path="/admin" element={<AdminHome />} />
                        <Route path="/admin/authorizations" element={<Authorizations />} />
                        <Route path="/admin/sub-authorizations" element={<SubAuthorizations />} />
                        <Route path="/admin/departments" element={<Departments />} />
                        <Route path="/admin/locations" element={<Locations />} />
                        <Route path="/admin/requests" element={<Requests />} />
                        <Route path="/admin/users" element={<Users />} />
                    </Routes>
                </BrowserRouter>
            </DispatchContext.Provider>
        </AppContext.Provider>
    )
}
createRoot(document.getElementById('root')).render(
    <Main />
)

export {
    AppContext, DispatchContext
}