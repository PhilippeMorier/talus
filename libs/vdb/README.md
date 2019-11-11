# vdb

This library was generated with [Nx](https://nx.dev).

## Running unit tests

Run `ng test vdb` to execute the unit tests via [Jest](https://jestjs.io).

## openVDB

### Install Blosc

- `git clone git@github.com:Blosc/c-blosc.git`
- `git co tags/v1.5.4`
- `cd c-blosc/`
- `mkdir build`
- `cd build/`
- `ccmake ..`
- `sudo cmake --build . --target install`

### Install other [dependencies](https://www.openvdb.org/documentation/doxygen/dependencies.html) via `apt-get`

e.g. `sudo apt-get install libboost-python-dev`

### Build ([standalone](https://www.openvdb.org/documentation/doxygen/build.html#buildBuildStandalone)) openVDP

- `mkdir build` in repo folder
- `cd buld/`
- `cmake ../ -DCMAKE_NO_SYSTEM_FROM_IMPORTED:BOOL=TRUE -DOPENVDB_BUILD_UNITTESTS=ON`

  - It is possible to set the install folder (e.g. `/usr/include` or `$HOME/openvdb`) by setting
    `-DCMAKE_INSTALL_PREFIX=/usr/include`
    - `cmake -DCMAKE_INSTALL_PREFIX=/usr/include ../ -DCMAKE_NO_SYSTEM_FROM_IMPORTED:BOOL=TRUE
      -DOPENVDB_BUILD_UNITTESTS=ON```

- `-DCMAKE_NO_SYSTEM_FROM_IMPORTED:BOOL=TRUE` is need due to
  [error](https://github.com/AcademySoftwareFoundation/openvdb/issues/70#issuecomment-508984505):

  - /usr/include/c++/7/cstdlib:75:15: fatal error: stdlib.h: No such file or directory #include_next
    <stdlib.h>

- `make`
- `make install`

#### Run Tests

Dependencies:

- `sudo apt-get install liblog4cplus-dev`
- `sudo apt-get install libcppunit-dev`
- `sudo apt-get install libjemalloc-dev`
- `sudo apt-get install libtbb-dev`

Running tests:

- In `../openvdb/openvdb/` run `make test` to run Python and C++ tests
- Alternatively run tests via `./openvdb/unittest/vdb_test -v` for more details on the C++ tests
  - `Segmentation fault` happens and is mentioned in `tsc/meetings/2019-09-26.md` explaining it
    happens `during serialization of OpenVDB Point Data Grids into Houdini file formats`
- Test log files are under `openvdb/build/Testing/Temporary`
