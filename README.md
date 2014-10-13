# Editing the content

The webserver is divided into three layers: a Python controller that serves
the browser data (HTML) and also a webservice of our programs.

The structure of the webserver are, devided into three files:
 1. `web.py`: the actual application that serves all URL's. Static content is located in directory `static`.
 2. `static/web.html`: The HTML file `static/web.html` defines the interface shown to the browser and uses a
    javascript file `static/web.js` to define the logic that contacts with each webservice. It provides some
    input data that resides     in  the UI to the webservice as parameters. 
 3. `static/web.js`: A javascript file that includes a set of function handlers that communicate with some
    webservices of `web.py` via JSON. For example, function a function handler of button with an id of
    scribble will invoke the webservice  `/scrible.json` (that is defined in `web.py`).
 4. The webservice in URL `/scribble.json` executes script `bin/scribble.sh`. The source code in the editor
    of the homepage is passed to the webservice that is then fed through the STDIN to the script, along
    with some arguments (in this case, the location of scribble’s jar file, which is defined in web.py).

# Installing the webserver

We use an altered version of Rust’s playpen.

To download:

```
git clone https://github.com/cogumbreiro/scribble-playpen
```

To install its dependencies in Ubuntu:

```
sudo apt-get install python3-pip
sudo pip3 install bottle
sudo pip3 install cherrypy
```

# Sandboxing

Existing sandboxing software.

## playpen

Does not work in Ubuntu, because it cannot link with -lsystemd!

```
sudo apt-get install clang-3.5 libseccomp-dev libsystemd-login-dev libglib2.0-dev pkg-config libsystemd-daemon-dev
```

## mbox

http://pdos.csail.mit.edu/mbox/

```
sudo apt-get install libssl-dev
```

## Firejail

http://l3net.wordpress.com/projects/firejail/

## Libvirtsandbox

http://sandbox.libvirt.org/quickstart/

## Others

http://askubuntu.com/questions/292925/how-to-sandbox-applications
