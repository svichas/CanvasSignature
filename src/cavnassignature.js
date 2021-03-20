
import defaults from "object.defaults";

/**
 * @param {*} element 
 * @param {*} options 
 * @returns 
 */
const assignToElement = (element, options) => {
    if (
        null === element ||
        "div" !== element.nodeName.toLowerCase()
    ) {
        return;
    }

    let canvas = document.createElement("canvas"),
        canvasContext = canvas.getContext("2d"),
        drawing = false,
        lastPosition = {};

    const initDom = () => {
        element.appendChild(canvas);
        canvas.className = "canvasSignature";
        canvas.width = options.width;
        canvas.height = options.height;

        canvas.style = "overscroll-behavior-y: contain;";

        // attach canvas events for both desktop and mobile devices
        canvas.addEventListener("touchstart", startDraw, { passive: false });
        canvas.addEventListener("touchmove", drawMove, { passive: false });
        canvas.addEventListener("touchend", endDraw);
        canvas.addEventListener("mousedown", startDraw);
        canvas.addEventListener("mousemove", drawMove);
        canvas.addEventListener("mouseup", endDraw);
    }

    /**
     * @param {*} event 
     */
    const startDraw = (event) => {
        event.preventDefault();
        drawing = true;
        lastPosition = getDrawPositionByEvent(event);
    }

    /**
     * @param {*} event 
     */
    const endDraw = (event) => {
        event.preventDefault();
        drawing = false;
        lastPosition = getDrawPositionByEvent(event);
    }

    /**
     * @param {*} event 
     * @returns 
     */
    const drawMove = (event) => {
        if (!drawing) {
            return;
        }

        event.preventDefault();

        let position = getDrawPositionByEvent(event);

        canvasContext.moveTo(lastPosition.x, lastPosition.y);
        canvasContext.lineTo(position.x, position.y);
        canvasContext.stroke();

        lastPosition = position;
    }

    /**
     * @param {*} event 
     */
    const getDrawPositionByEvent = (event) => {
        let position = {};

        if (
            event.targetTouches &&
            event.targetTouches.length
        ) {
            position.x = event.targetTouches[0].clientX;
            position.y = event.targetTouches[0].clientY;
        }

        if (
            event.clientX &&
            event.clientY
        ) {
            position.x = event.clientX;
            position.y = event.clientY; 
        }

        return position;
    }

    initDom();
}

/**
 * @param {*} element 
 */
const clearCanvas = (element) => {
    let canvas = element.querySelector("canvas");
    let canvasContext = canvas.getContext("2d");

    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
}


/**
 * @param {*} element 
 * @param {*} options 
 */
let CanvasSignature = (element, options) => {
    // set default options
    options = defaults(options, {
        width: 600,
        height: 600
    });

    if (element) {
        Array.prototype.forEach.call(
            element.length ? element : [element],
            (item) => {
                assignToElement(item, options);
            }
        )
    }

    return {
        clear: () => {
            Array.prototype.forEach.call(
                element.length ? element : [element],
                (item) => {
                    clearCanvas(item);
                }
            )
        }
    };
}

window.CanvasSignature = CanvasSignature;

export default CanvasSignature;