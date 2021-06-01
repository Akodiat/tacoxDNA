import { loadCadnano } from "./cadnanoLoader.js";
async function convertFromTo_async(inputs, from, to, opts) {
    const worker = new Worker("./js/conversionWorker.js", { type: "module" });
    return new Promise((resolve, reject) => {
        try {
            worker.onmessage = result => {
                resolve(result.data);
                worker.terminate();
            };
            worker.onerror = error => {
                reject(error);
                worker.terminate();
            };
            worker.postMessage([inputs, from, to, opts]);
        }
        catch (error) {
            reject(error);
        }
    });
}
function convertFromTo(inputs, from, to, opts) {
    let sys;
    switch (from) {
        case 'cadnano':
            sys = loadCadnano([...inputs.values()], opts.grid, opts.sequences, opts.side);
            break;
        default:
            console.log("Unknown input format: " + from);
            return;
    }
    switch (to) {
        case 'oxview':
            return sys.print_oxview_output();
        case 'oxdna':
            return sys.print_lorenzo_output();
        default:
            console.log("Unknown output format: " + from);
            break;
    }
}
export { convertFromTo, convertFromTo_async };
