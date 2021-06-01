import { convertFromTo } from "./tacoxdna.js";
onmessage = function (e) {
    const [inputs, from, to, opts] = e.data;
    let result = convertFromTo(inputs, from, to, opts);
    postMessage(result, undefined);
};
