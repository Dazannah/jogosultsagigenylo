import { useEffect } from "react"
function Container(props) {

    useEffect(() => {
        document.title = `${props?.title}`
    }, [])

    return (
        <div className="max-w-9/10 min-w-8/10 mx-auto my-3">{props.children}</div>
  );
}

export default Container;