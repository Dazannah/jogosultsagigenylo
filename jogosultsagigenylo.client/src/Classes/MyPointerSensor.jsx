import { PointerSensor } from '@dnd-kit/core';
class MyPointerSensor extends PointerSensor {
    static activators = [
        {
            eventName: 'onPointerDown',
            handler: ({ nativeEvent: event }) => {
                if (
                    !event.isPrimary ||
                    event.button !== 0 ||
                    isInteractiveElement(event.target)
                ) {
                    return false;
                }

                return true;
            },
        },
    ];
}

function isInteractiveElement(element) {
    const interactiveElements = [
        'button',
        'input',
        'textarea',
        'select',
        'option',
        'svg'
    ];

    if (interactiveElements.includes(element.tagName.toLowerCase())) {
        return true;
    }

    return false;
}

export {
    MyPointerSensor
}