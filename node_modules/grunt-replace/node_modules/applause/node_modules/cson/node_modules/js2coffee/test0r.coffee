code = """
foo = 'bar'
"""

main = (parse) ->
    ast = parse code
    console.log stringify ast

stringify = (obj) ->
    JSON.stringify obj, null, 2

if require.main is module
    param = process.argv[2]
    parseFunction = null
    switch param
        when 'narcissus' # new narcisuss
            console.log 'narcissus'
            narcissus = require 'narcissus_new'
            parseFunction = narcissus.parser.parse
        when 'packed'
            console.log 'narcissus_packed'
            narcissus = require './src/documents/lib/narcissus_packed'
            parseFunction = narcissus.parser.parse
        when 'acorn'
            console.log 'acorn'
            acorn = require 'acorn'
            parseFunction = acorn.parse
        when 'esprima'
            console.log 'esprima'
            esprima = require 'esprima'
            parseFunction = esprima.parse
        else
            console.log 'no parser specified'
            process.exit 1

    main(parseFunction)