import { BrowserRouter, Routes, Route, Router } from "react-router-dom"
import { createRoot } from 'react-dom/client'
import './StyleSheet.css'

//components
import Home from "./Components/Home"
import Menu from "./Components/Menu"
import NewRequest from "./Components/NewRequest"

import AdminMenu from "./Components/AdminMenu"
import Admin from "./Components/Admin"

const adminPathnameRegex = new RegExp("^\/admin$|^\/admin\/.*$")

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        {adminPathnameRegex.test(window.location.pathname) ? <AdminMenu /> : <Menu />}
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/new-request" element={<NewRequest />} />
            <Route path="/admin" element={<Admin />} />

            <Route exact path="/admin" element={<Home />} />
        </Routes>
    </BrowserRouter>
)
