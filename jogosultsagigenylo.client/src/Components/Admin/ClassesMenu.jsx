import React from "react";
import { useEffect, useState, useRef } from "react"

import Container from "../Container";
import CssClasses from "../../CssClasses";

import { DispatchContext } from "../../main";
function ClassesMenu(props) {
    const dispatch = React.useContext(DispatchContext);

    const classFormRef = useRef();
    function showDiv(divId) {
        const div = document.getElementById(divId)

        div.classList.remove("hidden")
    }
    function hideDiv(divId) {
        const div = document.getElementById(divId)

        div.classList.add("hidden")
    }

    async function createClass(e) {
        e.preventDefault()

        const body = {
            classNumber: e.target.classNumber.value,
            displayName: e.target.displayName.value,
            location: e.target.location.value,
            category: e.target.category.value
        }

        fetch("/api/classes/create", {
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
                    dispatch({ type: "flashMessageWarning", value: { message: response.statusText } })
                }
            }).catch(error => {
                dispatch({ type: "flashMessageError", value: { message: error } })
            })
    }

    return (
      <>
      <div id="add-class-div" key="add-class-div-key" className="fixed top-0 left-0 w-screen h-screen flex items-center bg-gray-500/50 hidden">
          <Container>
              <div className="bg-white w-fit m-auto rounded-lg dark:bg-gray-800 dark:text-gray-300">
                  <div className="flex font-semibold text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-300 rounded-t-lg">
                            <div className="flex md:w-1/2 place-content-start p-2"><span>Osztály hozzáadása</span></div>
                      <div className="flex md:w-1/2 place-content-end p-2">

                          <svg onClick={() => hideDiv("add-class-div")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 hover:cursor-pointer">
                              <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                          </svg>
                      </div>
                  </div>
                  <form ref={classFormRef} onSubmit={createClass} className="w-full max-w-5xl mx-auto p-5 shadow-md dark:bg-gray-800 rounded-b-lg">
                            <div className="flex flex-wrap -mx-3 mb-6">
                                <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                                    <label className={`${CssClasses.label}`} htmlFor="classNumber">
                                        Azonosító
                                    </label>
                                    <input name="classNumber" className={`${CssClasses.input}`} id="classNumber" autoComplete="off" type="text" placeholder="Azonosító" required />
                                </div>
                          <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                              <label className={`${CssClasses.label}`} htmlFor="displayName">
                                  Elnevezés
                              </label>
                              <input name="displayName" className={`${CssClasses.input}`} id="displayName" autoComplete="off" type="text" placeholder="Elnevezés" required />
                          </div>
                          <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                              <label className={`${CssClasses.label}`} htmlFor="location">
                                  Helyszín
                              </label>
                                    <input name="location" className={`${CssClasses.input}`} id="location" autoComplete="off" type="text" placeholder="Helyszín" required />
                          </div>
                          <div className="w-full md:w-1/4 px-3 mb-6 md:mb-0">
                                    <label className={`${CssClasses.label}`} htmlFor="category">
                                  Kategória
                              </label>
                                    <input name="category" className={`${CssClasses.input}`} id="category" autoComplete="off" type="text" placeholder="Kategória" required />
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
                  <button onClick={() => showDiv("add-class-div")} className="bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 rounded-md border border-green-500 hover:border-transparent rounded hover:cursor-pointer">
                    Osztály hozzáadása
                </button>
        </>
  );
}

export default ClassesMenu;