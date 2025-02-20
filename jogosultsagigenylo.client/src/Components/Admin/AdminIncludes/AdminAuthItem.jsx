import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function AdminAuthItem(props) {
    const authItem = props.authItem

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: `${authItem.id}-tr-${props.columnId}` });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <tr id={`${authItem.id}-tr-${props.columnId}`} ref={setNodeRef} className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 ${props.grabbing ? "cursor-grabbing" : "cursor-grab" }`} key={`${authItem.id}TrKey`} style={style} {...attributes} {...listeners}>
            <td id={`${authItem.id}Position`} className="px-6 py-4">
                {authItem.position}
            </td>
            <td id={`${authItem.id}DisplayName`} className="px-6 py-4">
                <span id={`${authItem.id}DisplayNameSpan`}>{authItem.displayName}</span>
                <input id={`${authItem.id}DisplayNameInput`} className="appearance-none block w-full bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-white focus:bg-white dark:focus:bg-gray-700 border border-teal-700 focus:border-orange-500 rounded p-2 leading-tight focus:outline-none hidden" type="text" defaultValue={authItem.displayName}></input>
            </td>

            <td className="px-6 py-4">{authItem.status.displayName}</td>
            <td className="px-1 py-4">
                <div className="flex place-content-end">
                    <button id={`${authItem.id}EditButton`} onClick={() => props.showDiv(`edit-auth-item-div-${authItem.id}`)} className="bg-transparent py-1 px-1 text-orange-500 text-sm transition-all hover:cursor-pointer hover:underline">
                        Szerkesztés
                    </button>
                </div>
            </td>
        </tr>
    );
}

export default AdminAuthItem;