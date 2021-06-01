import { loadCadnano } from "./cadnano_oxDNA.js";
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
export { convertFromTo };
