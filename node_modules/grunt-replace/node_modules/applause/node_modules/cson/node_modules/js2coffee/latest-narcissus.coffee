nParser = require 'narcissus/lib/parser'
esprima = require 'esprima'
acorn = require 'acorn'

{inspect} = require 'util'
fs = require 'fs'

arg = process.argv[2]

content = fs.readFileSync(arg, {encoding: 'utf8'})

console.log '--narcissus'
try
    result = nParser.parse content
    console.log inspect result

catch err
    console.error err.message


console.log '--esprima'
try
    result = esprima.parse content
    console.log inspect result.body[0].expression
catch err
    console.error err.message


console.log '--acorn'
result = acorn.parse content
console.log inspect result.body[0].expression
