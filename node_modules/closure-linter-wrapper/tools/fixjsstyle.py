#!/usr/bin/env python

# snipped thanks to
# http://stackoverflow.com/questions/279237/python-import-a-module-from-a-folder

import os, sys, inspect

cmd_subfolder = os.path.realpath(os.path.abspath(os.path.join(os.path.split(inspect.getfile( inspect.currentframe() ))[0],"gflags")))
if cmd_subfolder not in sys.path:
  sys.path.insert(0, cmd_subfolder)


from closure_linter import fixjsstyle

fixjsstyle.main()
