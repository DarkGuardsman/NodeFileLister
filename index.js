#!/usr/bin/env node

const fs = require('fs');
const {head, groupBy, uniq} = require('lodash');

// Get provided args
const [, , ...args] = process.argv;

const folder = args[0];

//Log arguments used
console.log('Target Folder:', folder);

const extRegex =/\.[0-9a-z]+$/i;

const filesFound = fs.readdirSync(folder)
    .map(name => {
        const path = folder + "/" + name;
        const isDirectory = fs.statSync(path).isDirectory()
        return {
            name,
            isDirectory,
            ext: isDirectory ? 'DIRECTORY' : head(name.match(extRegex))
        }                       
    });


//Collect all extensions
const extensions = uniq(filesFound.map(data => data.ext)).sort();

//Group files by type
const groupedFile = groupBy(filesFound, data => data.ext);

//Output to console
extensions.forEach(ext => {
    console.log(ext);
    groupedFile[ext].sort().forEach(data => {
        console.log('\t' + data.name);
    });
    console.log();
});

//Build output string
var output = '# Directory contents\n\n';
extensions.forEach(ext => {
    output += '## ' + ext + '\n\n'
    groupedFile[ext].sort().forEach(data => {
        output += '* ' + data.name + '\n'
    });
    output += '\n'
});

//Output to file
const outputPath = folder + '/directory_contains.md'
fs.writeFile(outputPath, output, function (err) {
    if (err) throw err;
    console.log(outputPath);
});