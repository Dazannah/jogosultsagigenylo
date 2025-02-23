import { Link, Navigate } from "react-router-dom"
import { useEffect, useState } from "react"

import Container from "./Container";


function Menu() {
    const [activeMenu, setActiveMenu] = useState(window.location.pathname);
    const [initialLoad, setInitialLoad] = useState(true)
    const [isClosed, setIsClosed] = useState(true)

    useEffect(() => {
        if (initialLoad) {
            setActive(activeMenu)
            setInitialLoad(false)
        }
    }, [])

    function setActive(nextActiveId) {
        const activeClasses = ["text-orange-500", "dark:text-orange-500"]
        const inactiveClasses = ["text-gray-900", "dark:text-white"]
        const currActive = document.getElementById(activeMenu)
        const nextActive = document.getElementById(nextActiveId)

        if (!nextActive) return

        activeClasses.forEach((element, idx) => {
            currActive.classList.add(inactiveClasses[idx])
            currActive.classList.remove(element)
        })

        activeClasses.forEach((element, idx) => {
            nextActive.classList.remove(inactiveClasses[idx])
            nextActive.classList.add(element)
        })

        setActiveMenu(nextActiveId)
    }

    function showDropdown() {
        const dropDown = document.getElementById("drop-down")

        if (isClosed) {
            dropDown.classList.remove("hidden")
            setIsClosed(false)
        }

        if (!isClosed) {
            dropDown.classList.add("hidden")
            setIsClosed(true)
        }
        
    }

    return (
        <Container>
            <nav className="border-gray-200 dark:bg-gray-900">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <Link to="/" onClick={e => setActive(e.target.id)} className="flex items-center space-x-3 rtl:space-x-reverse">
                        <span id="/" className="self-center hover:text-teal-700 text-2xl font-semibold whitespace-nowrap dark:text-white">Kezdőlap</span>
                    </Link>

                    <div className="items-center bg-transparent justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-user">
                        <div className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                            {/*<Link id="/new-user" to="/new-user" onClick={e => setActive(e.target.id)} className="bg-transparent block py-2 px-3 hover:text-teal-700 md:p-0 dark:text-white dark:border-gray-700">*/}
                            {/*    Új felhasználó*/}
                            {/*</Link>*/}
                            {/*<Link id="/list-request" to="/list-request" onClick={e => setActive(e.target.id)} className="block py-2 px-3 hover:text-teal-700 md:p-0 dark:text-white dark:border-gray-700">*/}
                            {/*    Kérelmek engedélyezése*/}
                            {/*</Link>*/}
                            {/*<Link id="/allowed-request" to="/allowed-request" onClick={e => setActive(e.target.id)} className="block py-2 px-3 hover:text-teal-700 md:p-0 dark:text-white dark:border-gray-700">*/}
                            {/*    Engedélyezett kérelmek*/}
                            {/*</Link>*/}
                            {/*<Link id="/completed-request" to="/completed-request" onClick={e => setActive(e.target.id)} className="block py-2 px-3 hover:text-teal-700 md:p-0 dark:text-white dark:border-gray-700">*/}
                            {/*    Lezárt kérelmek*/}
                            {/*</Link>*/}
                            <Link id="/users" to="/users" onClick={e => setActive(e.target.id)} className="block py-2 px-3 hover:text-teal-700 md:p-0 dark:text-white dark:border-gray-700">
                                Felhasználók
                            </Link>
                            <Link id="/requests" to="/requests" onClick={e => setActive(e.target.id)} className="block py-2 px-3 hover:text-teal-700 md:p-0 dark:text-white dark:border-gray-700">
                                Kérelmek
                            </Link>
                            <Link id="/distribution-lists" to="/distribution-lists" onClick={e => setActive(e.target.id)} className="block py-2 px-3 hover:text-teal-700 md:p-0 dark:text-white dark:border-gray-700">
                                Terjesztési listák
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                        <Link to="/logout" className="block py-2 px-3 hover:text-teal-700 md:p-0 dark:text-white dark:border-gray-700">
                            Kijelentkezés
                        </Link>
                    </div>
                </div>
            </nav>

        </Container>
  );
}

export default Menu;