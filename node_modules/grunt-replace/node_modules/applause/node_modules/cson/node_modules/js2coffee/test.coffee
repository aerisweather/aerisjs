narcissus = require './src/documents/lib/narcissus_packed'

code = """
foo = 'bar';
"""

main = (scope) ->

    ast = narcissus.parser.parse code
    console.log ">>>>>> children(#{ast.children.length}): ", ast.children
    console.log ">>>>>> child 0 expression: ", ast.children[0].expression

    # toplevel = null
    # toplevel = UglifyJS.parse code, {
    #     toplevel: toplevel
    # }

    # if scope
    #     toplevel.figure_out_scope()
        
    # console.log toplevel

if require.main is module
    param = process.argv[2]
    if param is 'scope'
        main true
    else
        main false
