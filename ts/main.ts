import {convertFromTo} from "./tacoxdna.js";

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
    ['oxdna', ['top', 'conf']],
    ['oxview', ['oxview']]
]);

let convertform = document.getElementById('convertForm') as HTMLFormElement;
convertform.addEventListener("submit", function(e) {
    e.preventDefault();
    let files = (document.getElementById("input") as HTMLInputElement).files;
    let from = (document.getElementById("fromSelect") as HTMLSelectElement).value;
    let to = (document.getElementById("toSelect") as HTMLSelectElement).value;

    let opts = {}
    if (from == "cadnano") {
        opts = {
            grid: (document.getElementById("cadnano_latticeType") as HTMLSelectElement).value,
            sequences: false
        }
    }
    
    let readFiles = new Map();

    for (const file of files) {
        const reader = new FileReader();
        reader.onload = function(evt) {
            readFiles.set(file, evt.target.result);
            console.log(`Finished reading ${readFiles.size} of ${files.length} files`);
            if (readFiles.size == files.length) {
                let converted = convertFromTo(readFiles, from, to, opts);
                if (!Array.isArray(converted)) {
                    converted = [converted]
                }
                let basename = file.name.split('.')[0];
                converted.forEach((out,i) => {
                    let suffix = suffixes.get(to)[i];
                    saveString(out, `${basename}.${suffix}`)
                });
            }
        };
        reader.readAsText(file);
    }
});
