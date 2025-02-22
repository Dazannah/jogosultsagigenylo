import React, { useContext, useEffect, useState } from "react"
import Container from "../Container"

function FlashMessagesWarning(props) {
    const keys = Object.keys(props.flashMessages)

    useEffect(() => {
        if (keys.length > 0) {
            const div = document.getElementById("flashmessage-warning")
            div.classList.remove("hidden")

            const timeoutId = setTimeout(() => {
                div.classList.add("hidden")
            }, 10000)

            return () => clearTimeout(timeoutId)
        }
    }, [props.flashMessages])

    function hide() {
        const div = document.getElementById("flashmessage-warning")
        div.classList.add("hidden")
    }

    if (keys.length > 0)
        return (
            <Container>
                <div id="flashmessage-warning" key="flashmessage-warning" className="w-1/5 fixed top-1/40 m-auto flex items-center bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded z-100" role="alert">
                    {
                        keys.map(key => {
                            return (
                                <span key={key} className="block sm:inline">{`${flashMessages[key]}`} </span>
                            )
                        })
                    }
                    <span onClick={() => hide()} className="absolute top-0 bottom-0 right-0 px-4 py-3 hover:cursor-pointer">
                        <svg className="fill-current h-6 w-6 text-orange-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
                    </span>
                </div>
            </Container>
        )
}

export default FlashMessagesWarning
