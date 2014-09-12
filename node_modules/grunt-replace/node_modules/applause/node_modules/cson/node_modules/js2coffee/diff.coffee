ansidiff = require 'ansidiff'
fs = require 'fs'

[node, file, input, output] = process.argv

inputContent = fs.readFileSync input
outputContent = fs.readFileSync output
console.log ansidiff.lines outputContent, inputContent
