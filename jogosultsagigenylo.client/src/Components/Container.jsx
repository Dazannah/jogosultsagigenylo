import { useEffect } from "react"
function Container(props) {

    useEffect(() => {
        if (props.title) document.title = `${props?.title}`
    }, [])

    return (
        <div className={`max-w-9/10 min-w-8/10 mx-auto my-3 ${props.className ?? ""}`}>{props.children}</div>
  );
}

export default Container;