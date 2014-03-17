# Instructions for building and deploying Aeris.js

## Build tools

Aeris.js uses the following build tools:

* r.js Optimizer (RequireJS)
* YUIDoc
* Grunt
* Travis-CI

The way that the build scripts are currently configured require that the r.js optimizer and yuidoc binary are available in the global path. To install these tools, run:

```
$ npm install -g yuidocjs
$ npm install -g requirejs
```

### AWS CLI (for deployment only)

If you're running deployment, you will also need to install and configure AWS CLI. See http://aws.amazon.com/cli/ for download and install instruction.

To configure AWS, run:

```
$ aws config
```

and follow the prompts. You will need to ask the powers that be for AWS keys.


### Node.js dependencies

All other build dependencies are defined in `package.json`, and may be installed using:

```
$ npm install
```


## Running tests

Test can be run using the Grunt `test` task:

```
$ grunt test --verbose
```

Test are run using the headless PhantomJS browser. For purposes of debugging, an html specrunner will be generated at `tests/specrunner.html`, which can be run from any browser.

All test specs in the `tests/spec/aeris` directory are automatically run. To reconfigure which tests are run, see the `jasmine-amd` configuration in `Gruntfile.js`.


## Packaging a build

Aeris.js library files and documentation can be generated using the `build` task:

```
$ grunt build --verbose
```

By default, built library files are created in the `/build` directory.


## Deploying Aeris.js

A deployment involves

- Deciding on a version number
- Creating a `Release/` git branch
- Bumping the library version
- Running the `deploy` task

### Deciding on a version number

Aeris.js follows [semver](http://semver.org/) semantic versioning. It's worth reading the spec, but here's a basic outline:

* A major version bump (v1.0.0 --> v2.0.0) must be made for any backward incompatible changes to the library interface. This should be a rare occassion, as it means introducing breaking changes to all developers' code.
* A minor version bump (v1.0.0 --> v1.1.0) should be made for any significant additions to the library. This would include new features and functionality.
* A patch version bump (v1.0.0 --> v1.0.1) whenever there are minor changes to code which do not change the library interface (eg. bug fixes).

While Aeris.js is in beta, we are using a major version of 0.x.x, and are not enforcing major version bumps for interface-breaking changes.

### Creating a `Release/` git branch

Create a branch off of `master` named `Release/vx.x.x` (using the appropriate version number). The `Release` branch is a place for hardening the library code before it is released to the public.

```
$ git checkout master
$ git branch Release/vx.x.x
$ git merge dev
```

The `Release` branch merges with dev, to include all changes which are to be staged for the upcoming release. Any new features or changes to the library should stay out of the `Release` branch once it is created.

### Tagging the library version

Changing the library version is as easy as editing the `"version"` property in `package.json`. When you run the `deploy` script, the version property set in `package.json` will be applied to all all other necessary locations (eg. documentation, bower.json, etc.)

Now is a good time to update the changelog (`CHANGELOG.md`).

If you're ready to deploy, you can tag a release, and merge back into master.

```
$ git co master
$ git merge Release/vx.x.x
$ git branch -d Release/vx.x.x
$ git tag vx.x.x
$ git push origin
```

Any changes that were made in the release branch must also be merged back into dev and feature branches

```
$ git co dev
$ git merge origin
$ git co Feature/my awesome feature
$ git rebase dev
```


### Running the deploy task

It's time to deploy!

```
$ grunt deploy
```

That's it. As long as all your tests are passing, and AWS ClI is configured, a new version of Aeris.js will now be deployed. Any failing specs or errors in YUIDoc/r.js will cause the build to fail.


## Travis-CI integration

The [hamweather/aerisjs](https://github.com/hamweather/aerisjs) repo is configured using [Travis CI](http://docs.travis-ci.com/) to automatically run build tasks. Whenever a commit is pushed to the central repository, the grunt test and build task will automatically be run on a [Travis CI server](https://travis-ci.org/hamweather/aerisjs).
