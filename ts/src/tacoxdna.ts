import {loadCadnano} from './cadnanoLoader'
import {loadRpoly} from './rpolyLoader'
import {Logger, System} from './libs/base'

function convertFromTo(inputs: string[], from: string, to: string, opts) {
    let sys: System;
    switch (from) {
        case 'cadnano':
            sys = loadCadnano(inputs[0], opts.grid, opts.sequences, opts.side);
            break;
        case 'rpoly':
            sys = loadRpoly(inputs[0]);
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
    const worker = new Worker("./src/libs/conversionWorker", {type: "module"});

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