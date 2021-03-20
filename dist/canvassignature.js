(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define('cavnassignature', factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.cavnassignature = factory());
}(this, (function () { 'use strict';

  /*!
   * array-each <https://github.com/jonschlinkert/array-each>
   *
   * Copyright (c) 2015, 2017, Jon Schlinkert.
   * Released under the MIT License.
   */
  /**
   * Loop over each item in an array and call the given function on every element.
   *
   * ```js
   * each(['a', 'b', 'c'], function(ele) {
   *   return ele + ele;
   * });
   * //=> ['aa', 'bb', 'cc']
   *
   * each(['a', 'b', 'c'], function(ele, i) {
   *   return i + ele;
   * });
   * //=> ['0a', '1b', '2c']
   * ```
   *
   * @name each
   * @alias forEach
   * @param {Array} `array`
   * @param {Function} `fn`
   * @param {Object} `thisArg` (optional) pass a `thisArg` to be used as the context in which to call the function.
   * @return {undefined}
   * @api public
   */

  var arrayEach = function each(arr, cb, thisArg) {
    if (arr == null) return;
    var len = arr.length;
    var idx = -1;

    while (++idx < len) {
      var ele = arr[idx];

      if (cb.call(thisArg, ele, idx, arr) === false) {
        break;
      }
    }
  };

  /*!
   * array-slice <https://github.com/jonschlinkert/array-slice>
   *
   * Copyright (c) 2014-2017, Jon Schlinkert.
   * Released under the MIT License.
   */

  var arraySlice = function slice(arr, start, end) {
    var len = arr.length;
    var range = [];
    start = idx(len, start);
    end = idx(len, end, len);

    while (start < end) {
      range.push(arr[start++]);
    }

    return range;
  };

  function idx(len, pos, end) {
    if (pos == null) {
      pos = end || 0;
    } else if (pos < 0) {
      pos = Math.max(len + pos, 0);
    } else {
      pos = Math.min(pos, len);
    }

    return pos;
  }

  /*!
   * for-in <https://github.com/jonschlinkert/for-in>
   *
   * Copyright (c) 2014-2017, Jon Schlinkert.
   * Released under the MIT License.
   */

  var forIn = function forIn(obj, fn, thisArg) {
    for (var key in obj) {
      if (fn.call(thisArg, obj[key], key, obj) === false) {
        break;
      }
    }
  };

  var hasOwn = Object.prototype.hasOwnProperty;

  var forOwn = function forOwn(obj, fn, thisArg) {
    forIn(obj, function (val, key) {
      if (hasOwn.call(obj, key)) {
        return fn.call(thisArg, obj[key], key, obj);
      }
    });
  };

  /*!
   * isobject <https://github.com/jonschlinkert/isobject>
   *
   * Copyright (c) 2014-2017, Jon Schlinkert.
   * Released under the MIT License.
   */

  var isobject = function isObject(val) {
    return val != null && typeof val === 'object' && Array.isArray(val) === false;
  };

  /**
   * Extends the `target` object with properties of one or
   * more additional `objects`
   *
   * @name .defaults
   * @param  {Object} `target` The target object. Pass an empty object to shallow clone.
   * @param  {Object} `objects`
   * @return {Object}
   * @api public
   */


  var mutable = function defaults(target, objects) {
    if (target == null) {
      return {};
    }

    arrayEach(arraySlice(arguments, 1), function (obj) {
      if (isobject(obj)) {
        forOwn(obj, function (val, key) {
          if (target[key] == null) {
            target[key] = val;
          }
        });
      }
    });
    return target;
  };

  /**
   * Extends an empty object with properties of one or
   * more additional `objects`
   *
   * @name .defaults.immutable
   * @param  {Object} `objects`
   * @return {Object}
   * @api public
   */


  var immutable$1 = function immutableDefaults() {
    var args = arraySlice(arguments);
    return mutable.apply(null, [{}].concat(args));
  };

  var object_defaults = mutable;
  var immutable = immutable$1;
  object_defaults.immutable = immutable;

  /**
   * @param {*} element 
   * @param {*} options 
   * @returns 
   */

  const assignToElement = (element, options) => {
    if (null === element || "div" !== element.nodeName.toLowerCase()) {
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
      canvas.style = "overscroll-behavior-y: contain;"; // attach canvas events for both desktop and mobile devices

      canvas.addEventListener("touchstart", startDraw, {
        passive: false
      });
      canvas.addEventListener("touchmove", drawMove, {
        passive: false
      });
      canvas.addEventListener("touchend", endDraw);
      canvas.addEventListener("mousedown", startDraw);
      canvas.addEventListener("mousemove", drawMove);
      canvas.addEventListener("mouseup", endDraw);
    };
    /**
     * @param {*} event 
     */


    const startDraw = event => {
      event.preventDefault();
      drawing = true;
      lastPosition = getDrawPositionByEvent(event);
    };
    /**
     * @param {*} event 
     */


    const endDraw = event => {
      event.preventDefault();
      drawing = false;
    };
    /**
     * @param {*} event 
     * @returns 
     */


    const drawMove = event => {
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
    };
    /**
     * @param {*} event 
     */


    const getDrawPositionByEvent = event => {
      let position = {};

      if (event.targetTouches && event.targetTouches.length) {
        position.x = event.targetTouches[0].clientX - canvas.offsetLeft;
        position.y = event.targetTouches[0].clientY - canvas.offsetTop;
      }

      if (event.clientX && event.clientY) {
        position.x = event.pageX - canvas.offsetLeft;
        position.y = event.pageY - canvas.offsetTop;
      }

      return position;
    };

    initDom();
  };
  /**
   * @param {*} element 
   */


  const destroyCanvas = element => {
    let canvas = element.querySelector("canvas");

    if (null !== canvas) {
      canvas.remove();
    }
  };
  /**
   * @param {*} element 
   */


  const clearCanvas = element => {
    let canvas = element.querySelector("canvas");

    if (null !== canvas) {
      canvas.width = canvas.width;
    }
  };
  /**
   * @param {*} c 
   * @returns 
   */


  const trimCanvas = c => {
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
        x,
        y;

    for (i = 0; i < l; i += 4) {
      if (pixels.data[i + 3] !== 0) {
        x = i / 4 % c.width;
        y = ~~(i / 4 / c.width);

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

    if (bound.left === null || bound.right === null || bound.top === null || bound.bottom === null) {
      return c;
    }

    var trimHeight = bound.bottom - bound.top,
        trimWidth = bound.right - bound.left,
        trimmed = ctx.getImageData(bound.left, bound.top, trimWidth, trimHeight);
    copy.canvas.width = trimWidth;
    copy.canvas.height = trimHeight;
    copy.putImageData(trimmed, 0, 0);
    return copy.canvas;
  };
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
  };
  /**
   * @param {*} element 
   * @param {*} options 
   */


  let CanvasSignature = (element, options) => {
    // set default options
    options = object_defaults(options, {
      width: 200,
      height: 120,
      trim: true,
      strokeWidth: 2,
      strokeColor: "black"
    });

    if (element) {
      Array.prototype.forEach.call(element.length ? element : [element], item => {
        assignToElement(item, options);
      });
    }

    return {
      /**
       * Method to clear signatures
       */
      clear: () => {
        Array.prototype.forEach.call(element.length ? element : [element], item => {
          clearCanvas(item);
        });
      },

      /**
       * Method to return array of signatures
       * 
       * @returns {string[]}
       */
      getSignatures: () => {
        let signatures = [];
        Array.prototype.forEach.call(element.length ? element : [element], item => {
          signatures.push(getSignature(item, options));
        });
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
        Array.prototype.forEach.call(element.length ? element : [element], item => {
          destroyCanvas(item);
        });
      }
    };
  };

  window.CanvasSignature = CanvasSignature;

  return CanvasSignature;

})));

//# sourceMappingURL=canvassignature.js.map
