
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
    }

    /**
     * @param {*} event 
     * @returns 
     */
    const drawMove = (event) => {
        if (!drawing) {
            return;
        }

        let position = getDrawPositionByEvent(event);

        canvasContext.lineWidth = options.strokeWidth;
        canvasContext.strokeStyle = options.strokeColor;
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
            position.x = event.targetTouches[0].clientX - canvas.offsetLeft;
            position.y = event.targetTouches[0].clientY - canvas.offsetTop;
        }

        if (
            event.clientX &&
            event.clientY
        ) {
            position.x = event.clientX - canvas.offsetLeft;
            position.y = event.clientY - canvas.offsetTop; 
        }

        return position;
    }

    initDom();
}

/**
 * @param {*} element 
 */
const destroyCanvas = (element) => {
    let canvas = element.querySelector("canvas");

    if (null !== canvas) {
        canvas.remove();
    }
}

/**
 * @param {*} element 
 */
const clearCanvas = (element) => {
    let canvas = element.querySelector("canvas");

    if (null !== canvas) {
        canvas.width = canvas.width;
    }
}

/**
 * @param {*} c 
 * @returns 
 */
const trimCanvas = (c) => {
    var ctx = c.getContext('2d'),
        copy = document.createElement('canvas').getContext('2d'),
        pixels = ctx.getImageData(0, 0, c.width, c.height),
        l = pixels.data.length,
        i,
        bound = {
            top: null,
            left: null,
            right: null,
            bottom: null
        },
        x, y;
    
    for (i = 0; i < l; i += 4) {
        if (pixels.data[i + 3] !== 0) {
            x = (i / 4) % c.width;
            y = ~~((i / 4) / c.width);

            if (bound.top === null) {
                bound.top = y;
            }

            if (bound.left === null) {
                bound.left = x;
            } else if (x < bound.left) {
                bound.left = x;
            }

            if (bound.right === null) {
                bound.right = x;
            } else if (bound.right < x) {
                bound.right = x;
            }

            if (bound.bottom === null) {
                bound.bottom = y;
            } else if (bound.bottom < y) {
                bound.bottom = y;
            }
        }
    }

    if (
        bound.left === null ||
        bound.right === null ||
        bound.top === null ||
        bound.bottom === null
    ) {
           return c; 
    }

    var trimHeight = bound.bottom - bound.top,
        trimWidth = bound.right - bound.left,
        trimmed = ctx.getImageData(bound.left, bound.top, trimWidth, trimHeight);

    copy.canvas.width = trimWidth;
    copy.canvas.height = trimHeight;
    copy.putImageData(trimmed, 0, 0);

    return copy.canvas;
}

/**
 * @param {*} element 
 * @param {*} options 
 * @returns 
 */
const getSignature = (element, options) => {
    let canvas = element.querySelector("canvas");
    
    if (null !== canvas) {
        if (options.trim) {
            return trimCanvas(canvas).toDataURL();
        }
        
        return canvas.toDataURL();
    }

    return null;
}

/**
 * @param {*} element 
 * @param {*} options 
 */
let CanvasSignature = (element, options) => {
    // set default options
    options = defaults(options, {
        width: 200,
        height: 120,
        trim: true,
        strokeWidth: 2,
        strokeColor: "black"
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
        /**
         * Method to clear signatures
         */
        clear: () => {
            Array.prototype.forEach.call(
                element.length ? element : [element],
                (item) => {
                    clearCanvas(item);
                }
            )
        },
        /**
         * Method to return array of signatures
         * 
         * @returns {string[]}
         */
        getSignatures: () => {
            let signatures = [];

            Array.prototype.forEach.call(
                element.length ? element : [element],
                (item) => {
                    signatures.push(getSignature(item, options));
                }
            )

            return signatures;
        },
        /**
         * Method to return a single signature
         * 
         * @returns {string}
         */
        getSignature: () => {
            let elements = element.length ? element : [elemen];

            return getSignature(elements[0], options);
        },
        /**
         * Method to destroy CanvasSignature element
         */
        destroy: () => {
            Array.prototype.forEach.call(
                element.length ? element : [element],
                (item) => {
                    destroyCanvas(item);
                }
            )
        }
    };
}

window.CanvasSignature = CanvasSignature;

export default CanvasSignature;