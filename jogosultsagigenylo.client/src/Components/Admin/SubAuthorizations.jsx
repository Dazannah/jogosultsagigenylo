import React from "react";
import { useEffect, useState } from "react";

import Container from "../Container";

import { AppContext, DispatchContext } from "../../main";
import Loading from "../Loading";
function SubAuthorizations() {
    const dispatch = React.useContext(DispatchContext);

    const title = "Aljogosultságok"
    const [authItems, setAuthItems] = useState([]);
    const [isLoading, setIsloading] = useState(true);

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
        return authItem.subAuthItems.map((subAuthItem, idx) => {
            return (
                <span key={`subAuthItem-span-${idx}`}>{subAuthItem}</span>
            )
        })
    }

    function renderAuthItems(){
        return authItems.map((authItem, idx) => {
            console.log(authItem, idx)
            return (
                <div key={`authItem-div-${idx}`}>
                    <span key={`authItem-span-${idx}`}>{authItem.displayName} items: </span>

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
          
          {
              renderAuthItems()
          }
          
      </Container>
  );
}

export default SubAuthorizations;