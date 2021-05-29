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
        case 'oxDNA':
            return sys.print_lorenzo_output();
        default:
            console.log("Unknown output format: " + from);
            break;
    }
}
function saveString(text, filename) {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
let suffixes = new Map([
    ['oxdna', ['conf', 'top']],
    ['oxview', ['oxview']]
]);
let convertform = document.getElementById('convertForm');
convertform.addEventListener("submit", function (e) {
    e.preventDefault();
    let files = document.getElementById("input").files;
    let from = document.getElementById("fromSelect").value;
    let to = document.getElementById("toSelect").value;
    let opts = {};
    if (from == "cadnano") {
        opts = {
            grid: document.getElementById("cadnano_latticeType").value,
            sequences: false
        };
    }
    let readFiles = new Map();
    for (const file of files) {
        const reader = new FileReader();
        reader.onload = function (evt) {
            readFiles.set(file, evt.target.result);
            console.log(`Finished reading ${readFiles.size} of ${files.length} files`);
            if (readFiles.size == files.length) {
                let converted = convertFromTo(readFiles, from, to, opts);
                if (!Array.isArray(converted)) {
                    converted = [converted];
                }
                let basename = file.name.split('.')[0];
                converted.forEach((out, i) => {
                    let suffix = suffixes.get(to)[i];
                    saveString(out, `${basename}.${suffix}`);
                });
            }
        };
        reader.readAsText(file);
    }
});
