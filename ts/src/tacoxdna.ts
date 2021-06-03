import {loadCadnano} from './cadnanoLoader'
import {Logger} from './libs/base'

function convertFromTo(inputs: Map<string, string>, from: string, to: string, opts) {
    let sys;
    switch (from) {
        case 'cadnano':
            sys = loadCadnano([...inputs.values()], opts.grid, opts.sequences, opts.side)
            break;
        default:
            console.log("Unknown input format: "+from);
            return;
    }
    switch (to) {
        case 'oxview':
            return sys.print_oxview_output();
        case 'oxdna':
            return sys.print_lorenzo_output();
        default:
            console.log("Unknown output format: "+from);
            break;
    }
}

async function convertFromTo_async(inputs: Map<string, string>, from: string, to: string, opts) {
    const worker = new Worker("./js/conversionWorker", {type: "module"});

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
        } catch (error) {
          reject(error);
        }
      });
}

export {convertFromTo, convertFromTo_async, Logger}