import CssClasses from "../CssClasses"

function Column(props) {
    return (
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <span className={`${CssClasses.label}`}>
                {props.column.displayName}
          </span>
          {
                props.column.authItems.map(authItem => {
                  if (authItem.status.name == "active")
                      return (
                          <div key={`${authItem.id}AuthItem`} className="w-full content-center">
                              <input id={`${authItem.id}Checkbox`} name={authItem.id} type="checkbox" />
                              <label className="uppercase tracking-wide text-gray-700 dark:text-white text-xs font-bold mb-2 cursor-pointer" htmlFor={`${authItem.id}Checkbox`}>
                                  {" "}{authItem.displayName}
                              </label>
                          </div>
                      )
              })
          }
      </div>
  );
}

export default Column;