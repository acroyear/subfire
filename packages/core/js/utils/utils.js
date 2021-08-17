// jshint -W116
export const toHHMMSS = function(v) {
  const includeHour = arguments[1];
  if (v === null || v === undefined || Number.isNaN(v)) return includeHour ? '--:--:--' : '--:--';
  v = v * 1;
  let seconds = Math.floor(v),
    hours = Math.floor(seconds / 3600);
  seconds -= hours * 3600;
  let minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;

  if (hours < 10) {
    hours = '0' + hours;
  }
  if (minutes < 10 && includeHour) {
    minutes = '0' + minutes;
  }
  if (seconds < 10) {
    seconds = '0' + seconds;
  }
  let rv = '';
  if (includeHour && hours > 0) rv += hours + ':';
  else if (!includeHour) minutes = minutes + hours * 60;
  return rv + minutes + ':' + seconds;
};

export const arrayRemove = function(arr, item) {
  let index = arr.indexOf(item);
  if (index >= 0) arr.splice(index, 1);
  return this;
};

export const arrayUnique = function(arr) {
  return arr.filter((x, i, a) => a.indexOf(x) === i)
}

export const arrayShuffle = function(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

// string stuff from the old - TODO:[JS] get rid of prototype overrides...

// from http://snipplr.com/view.php?codeview&id=30964
export function hexDecode(s) {
  let r = '';
  for (let i = 0; i < s.length; i += 2) {
    r += unescape('%' + s.substr(i, 2));
  }
  return r;
};

export function hexEncode(s) {
  let r = '';
  let i = 0;
  let h;
  while (i < s.length) {
    h = s.charCodeAt(i++).toString(16);
    while (h.length < 2) {
      /* h = h ? */
    }
    r += h;
  }
  return r;
};

export function stripLinks(txt) {
  txt = txt.replace(/<a\b[^>]*>/gi, '');
  txt = txt.replace(/<\/a>/gi, '');
  return txt;
};

export function format(s, ...rest) {
  let i = rest.length;

  while (i--) {
    s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), rest[i]);
  }
  return s;
};

export function splitSentences(str) {
  // from http://stackoverflow.com/questions/18914629/split-string-into-sentences-in-javascript
  let rv1 = str.replace(/([.?!])\s*(?=[A-Z])/g, '$1|').split('|');
  let rv2 = [];
  // abreviations can f this up, so clean it a bit.
  for (let i = 0; i < rv1.length; ++i) {
    let s = '';
    while (s.length < 20 && i < rv1.length) {
      s += rv1[i];
      if (s.length < 20) ++i;
    }
    s.replace('. .', '.');
    s = s.trim();
    if (s.length) rv2.push(s);
  }
  return rv2;
};

// Returns a random integer between min (included) and max (included)
// Using Math.round() will give you a non-uniform distribution!
export function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function versionCompare(v1, v2, options) {
  let lexicographical = options && options.lexicographical,
    zeroExtend = options && options.zeroExtend,
    v1parts = v1.split('.'),
    v2parts = v2.split('.');

  function isValidPart(x) {
    return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
  }

  if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
    return NaN;
  }

  if (zeroExtend) {
    while (v1parts.length < v2parts.length) v1parts.push('0');
    while (v2parts.length < v1parts.length) v2parts.push('0');
  }

  if (!lexicographical) {
    v1parts = v1parts.map(Number);
    v2parts = v2parts.map(Number);
  }

  for (let i = 0; i < v1parts.length; ++i) {
    if (v2parts.length === i) {
      return 1;
    }

    if (v1parts[i] === v2parts[i]) {
      continue;
    } else if (v1parts[i] > v2parts[i]) {
      return 1;
    } else {
      return -1;
    }
  }

  if (v1parts.length !== v2parts.length) {
    return -1;
  }

  return 0;
}

export function deepEquals () {
  let i, l, leftChain, rightChain;

  function compare2Objects (x, y) {
    let p;

    // remember that NaN === NaN returns false
    // and isNaN(undefined) returns true
    if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
         return true;
    }

    // Compare primitives and functions.
    // Check if both arguments link to the same object.
    // Especially useful on the step where we compare prototypes
    if (x === y) {
        return true;
    }

    // Works in case when functions are created in constructor.
    // Comparing dates is a common scenario. Another built-ins?
    // We can even handle functions passed across iframes
    if ((typeof x === 'function' && typeof y === 'function') ||
       (x instanceof Date && y instanceof Date) ||
       (x instanceof RegExp && y instanceof RegExp) ||
       (x instanceof String && y instanceof String) ||
       (x instanceof Number && y instanceof Number)) {
        return x.toString() === y.toString();
    }

    // At last checking prototypes as good as we can
    if (!(x instanceof Object && y instanceof Object)) {
        return false;
    }

    if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
        return false;
    }

    if (x.constructor !== y.constructor) {
        return false;
    }

    if (x.prototype !== y.prototype) {
        return false;
    }

    // Check for infinitive linking loops
    if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
         return false;
    }

    // Quick checking of one object being a subset of another.
    // todo: cache the structure of arguments[0] for performance
    for (p in y) {
        if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
            return false;
        }
        else if (typeof y[p] !== typeof x[p]) {
            return false;
        }
    }

    for (p in x) {
        if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
            return false;
        }
        else if (typeof y[p] !== typeof x[p]) {
            return false;
        }

        switch (typeof (x[p])) {
            case 'object':
            case 'function':

                leftChain.push(x);
                rightChain.push(y);

                if (!compare2Objects (x[p], y[p])) {
                    return false;
                }

                leftChain.pop();
                rightChain.pop();
                break;

            default:
                if (x[p] !== y[p]) {
                    return false;
                }
                break;
        }
    }

    return true;
  }

  if (arguments.length < 1) {
    return true; //Die silently? Don't know how to handle such case, please help...
    // throw "Need two or more arguments to compare";
  }

  for (i = 1, l = arguments.length; i < l; i++) {

      leftChain = []; //Todo: this can be cached
      rightChain = [];

      if (!compare2Objects(arguments[0], arguments[i])) {
          return false;
      }
  }

  return true;
}

export function compare(a,b) {
  if (a === null || a === undefined) return b === null  || b === undefined ? 0 : 1;
  if (b === null || b === undefined) return -1;
  if (typeof a === 'number' && typeof b === 'number') {
    return a - b;
  }
  a = (""+a).toLowerCase().localeCompare((""+b).toLowerCase());
}

export const loadJS = function(url, implementationCode, location){
    //url is URL of external file, implementationCode is the code
    //to be called from the file, location is the location to
    //insert the <script> element

    const scriptTag = document.createElement('script');
    scriptTag.src = url;

    scriptTag.onload = implementationCode;
    scriptTag.onreadystatechange = implementationCode;

    location.appendChild(scriptTag);
};

export const empty = (v) => {
  return (
    v === undefined ||
    v === null ||
    v === "" ||
    (Array.isArray(v) && v.length === 0) ||
    (typeof v === "object" && Object.entries(v).length === 0)
  );
};

export default { // eslint-disable-line
  empty,
  versionCompare,
  getRandomIntInclusive,
  arrayShuffle,
  toHHMMSS,
  arrayRemove,
  arrayUnique,
  hexEncode,
  hexDecode,
  stripLinks,
  splitSentences,
  format,
  deepEquals,
  compare,
  loadJS
};
