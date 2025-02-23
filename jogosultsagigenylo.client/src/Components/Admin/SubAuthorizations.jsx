import React from "react";
import { useEffect, useState } from "react";

import Container from "../Container";

import { AppContext, DispatchContext } from "../../main";
import Loading from "../Loading";
function SubAuthorizations() {
    const dispatch = React.useContext(DispatchContext);

    const title = "Aljogosultságok"
    const [authItems, setAuthItems] = useState([]);
    const [subAuthItems, setSubAuthItems] = useState([]);
    const [isLoading, setIsloading] = useState(true);

    useEffect(() => {
        if (isLoading) {
            fetch("/api/subauthitems")
                .then(response => {
                    return response.json()
                })
                .then(data => {
                    setAuthItems(data.authItems)
                    setSubAuthItems(data.subAuthItems)

                    setIsloading(false)
                })
                .catch(error => {
                    dispatch({ type: "flashMessageError", action: { message: error.errors } });
                })
        }
    }, [isLoading])

    if (isLoading) return (
        <Container title={title}>
            <Loading></Loading>
        </Container>
    )

  return (
      <Container title={title}>
          <Loading></Loading>
      </Container>
  );
}

export default SubAuthorizations;