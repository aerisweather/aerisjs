/** @license MIT License (c) copyright B Cavalier & J Hann */

/**
 * wire/builder/rjs plugin
 * Builder plugin for requirejs (r.js)
 * see: http://github.com/jrburke/requirejs for details
 *
 * Supports requirejs version 2.1.0+
 *
 * wire is part of the cujo.js family of libraries (http://cujojs.com/)
 *
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */
(function(define) {
define( function() {

	var defaultModuleRegex, defaultSpecRegex, defaultWireId, replaceIdsRegex, removeCommentsRx, specCache, fs;
	// default dependency regex
	defaultModuleRegex = /\.(module|create)$/;
	defaultSpecRegex = /\.(wire|spec)$/;
	defaultWireId = 'wire';
	// adapted from cram's scan function:
	//replaceIdsRegex = /(define)\s*\(\s*(?:\s*["']([^"']*)["']\s*,)?(?:\s*\[([^\]]+)\]\s*,)?\s*(function)?\s*(?:\(([^)]*)\))?/g;
	replaceIdsRegex = /(define)\s*\(\s*(?:\s*["']([^"']*)["']\s*,)?(?:\s*\[([^\]]*)\]\s*,)?/;
	removeCommentsRx = /\/\*[\s\S]*?\*\/|\/\/.*?[\n\r]/g;
	specCache = {};

	// Using special require.nodeRequire, something added by r.js.
	if ( require.nodeRequire ) {
		fs = require.nodeRequire('fs');
	}

	return {
		load: analyze,
		write: writeSpec
	};

	function analyze(resourceId, require, load, config) {
		var wireId, specIds, childSpecRegex, moduleRegex, file_path;

		moduleRegex = defaultModuleRegex;
		childSpecRegex = defaultSpecRegex;
		wireId = defaultWireId;

		// Get config values
		if(config) {
			if(config.moduleRegex) { moduleRegex = new RegExp(config.moduleRegex); }
			if(config.childSpecRegex) { childSpecRegex = new RegExp(config.childSpecRegex); }
			if(config.wireId) { wireId = config.wireId; }
		}

		// Grab the spec module id, *or comma separated list of spec module ids*
		// Split in case it's a comma separated list of spec ids
		specIds = resourceId.split(',');
		if (specIds.length > 1) {
			require(specIds.map(function(id) { return wireId + '!' + id; } ), function() {
				load();
			});
			return;
		}

		// get all the specs
		file_path = ensureExtension(require.toUrl(resourceId), '.js');

		getFile(file_path, function (contents) {
			var spec, dependencies;

			if(!require.defined(resourceId)) {
				load.fromText(resourceId, contents);
				spec = require(resourceId);
			} else {
				spec = require(resourceId);
			}

			if (!spec) {
				load.error(new Error('rjs returned no data for "' + resourceId + '", cannot process spec'));
			}

			dependencies = processSpec(spec, resourceId);

			specCache[ resourceId ] = {
				dependencies: dependencies.runtime,
				path: file_path
			};

			require(dependencies.build);
		});


		// For each spec id, add the spec itself as a dependency, and then
		// scan the spec contents to find all modules that it needs (e.g.
		// "module", "create", "spec" and "wire")
		function processSpec(spec, resourceId) {
			var runtime_deps, build_deps;

			runtime_deps = [];
			build_deps = [];

			scanObj(spec);

			function scanObj(obj, path) {
				// Scan all keys.  This might be the spec itself, or any sub-object-literal
				// in the spec.
				for (var name in obj) {
					scanItem(obj[name], createPath(path, name));
				}
			}

			function scanItem(it, path) {
				// Determine the kind of thing we're looking at
				// 1. If it's a string, and the key is module or create, then assume it
				//    is a moduleId, and add it as a dependency.
				// 2. If it's an object or an array, scan it recursively
				if (typeof it === 'string') {
					if (isDep(path)) {
						// Get module def
						addDependency(it);
					} else if (isWireDep(path)) {
						addChildSpec(it);
					}

				} else if (isStrictlyObject(it)) {
					// Descend into subscope
					scanObj(it, path);

				} else if (Array.isArray(it)) {
					// Descend into array
					var arrayPath = path + '[]';
					it.forEach(function(arrayItem) {
						scanItem(arrayItem, arrayPath);
					});
				}
			}

			function addDependency(moduleId) {
				var mod = moduleId;
				if ( moduleId.indexOf( './' ) === 0 ) {
					// relative path, assume its relative to spec we're loading (resourceId)
					var split = resourceId.split( '/' );
					// last element is the spec name, take it out
					split.pop();
					// remove ./ and join two together
					var moduleIdWithoutDotSlash = moduleId.slice( 2 );
					split.push( moduleIdWithoutDotSlash );
					mod = split.join( '/' );
				}
				runtime_deps.push( mod );
				build_deps.push( mod );
			}

			function addChildSpec(moduleId) {
				runtime_deps.push(moduleId);
				build_deps.push(wireId + '!' + moduleId);
			}

			function isDep(path) {
				return moduleRegex.test(path);
			}

			function isWireDep(path) {
				return defaultSpecRegex.test(path);
			}

			function createPath(path, name) {
				return path ? (path + '.' + name) : name;
			}

			function isStrictlyObject(it) {
				return (it && Object.prototype.toString.call(it) == '[object Object]');
			}

			return {
				runtime: runtime_deps,
				build: build_deps
			};
		}
	}

	function writeSpec(wireId, resourceId, write) {
		var specIds, spec;

		specIds = resourceId.split(',');

		if (resourceId && specIds.length === 1) {
			// Only write single modules, combined modules should come through separately

			spec = specCache[resourceId];

			if (!spec) {
				throw new Error('Spec of "' + resourceId + '" was not previously processed');
			}

			getFile(spec.path, function(contents) {
				write.asModule(resourceId, injectIds(contents, resourceId, spec.dependencies));
			} );
		}
	}

	function ensureExtension(id, ext) {
		return id.lastIndexOf(ext) <= id.lastIndexOf('/')
			? id + ext
			: id;
	}

	function injectIds(moduleText, absId, moduleIds) {
		// note: replaceIdsRegex removes commas, parens, and brackets
		return moduleText.replace(removeCommentsRx, '').replace(replaceIdsRegex, function(m, def, mid, depIds) {

			// merge deps, but not args since they're not referenced in module
			if (depIds) {
				moduleIds = moduleIds.concat(depIds);
			}

			moduleIds = moduleIds.map(quoted).join(', ');
			if (moduleIds) {
				moduleIds = '[' + moduleIds + '], ';
			}

			return def + '(' + quoted(absId) + ', ' + moduleIds;
		});
	}

	function quoted(id) {
		return '\'' + id + '\'';
	}

	function getFile(url, cb) {
		var file;

		if (!fs) {
			throw new Error('Environment not supported, fs module not found');
		}

		file = fs.readFileSync(url, 'utf8');
		//Remove BOM (Byte Mark Order) from utf8 files if it is there.
		if (file.indexOf('\uFEFF') === 0) {
			file = file.substring(1);
		}
		cb(file);
	}

});
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(); }));
