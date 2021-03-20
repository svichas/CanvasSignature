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
      lastPosition = getDrawPositionByEvent(event);
    };
    /**
     * @param {*} event 
     * @returns 
     */


    const drawMove = event => {
      if (!drawing) {
        return;
      }

      event.preventDefault();
      let position = getDrawPositionByEvent(event);
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
        position.x = event.targetTouches[0].clientX;
        position.y = event.targetTouches[0].clientY;
      }

      if (event.clientX && event.clientY) {
        position.x = event.clientX;
        position.y = event.clientY;
      }

      return position;
    };

    initDom();
  };
  /**
   * @param {*} element 
   */


  const clearCanvas = element => {
    let canvas = element.querySelector("canvas");
    let canvasContext = canvas.getContext("2d");
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  };
  /**
   * @param {*} element 
   * @param {*} options 
   */


  let CanvasSignature = (element, options) => {
    // set default options
    options = object_defaults(options, {
      width: 600,
      height: 600
    });

    if (element) {
      Array.prototype.forEach.call(element.length ? element : [element], item => {
        assignToElement(item, options);
      });
    }

    return {
      clear: () => {
        Array.prototype.forEach.call(element.length ? element : [element], item => {
          clearCanvas(item);
        });
      }
    };
  };

  window.CanvasSignature = CanvasSignature;

  return CanvasSignature;

})));

//# sourceMappingURL=canvassignature.js.map
