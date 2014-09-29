#!/usr/bin/env python3

import functools
import os
import sys

from os import path
from bottle import get, request, response, route, run, static_file
from pygments import highlight
from pygments.formatters import HtmlFormatter
from pygments.lexers import GasLexer, LlvmLexer

import playpen

@get("/")
def serve_index():
    response = static_file("web.html", root="static")

    # XSS protection is a misfeature unleashed upon the world by Internet
    # Explorer 8. It uses ill conceived heuristics to block or mangle HTTP
    # requests in an attempt to prevent cross-site scripting exploits. It's yet
    # another idea from the "enumerating badness" school of security theater.
    #
    # Rust and JavaScript are both languages using a C style syntax, and GET
    # queries containing Rust snippets end up being classified as cross-site
    # scripting attacks. Luckily, there's a header for turning off this bug.
    response.set_header("X-XSS-Protection", "0")

    return response

@get("/<path:path>")
def serve_static(path):
    return static_file(path, root="static")

@functools.lru_cache(maxsize=256)
def execute(version, command, arguments, code):
    print("running:", version, command, arguments, file=sys.stderr, flush=True)
    return playpen.execute(version, command, arguments, code)

def enable_post_cors(wrappee):
    def wrapper(*args, **kwargs):
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Origin, Accept, Content-Type"

        if request.method != "OPTIONS":
            return wrappee(*args, **kwargs)

    return wrapper

def extractor(key, default, valid):
    def decorator(wrappee):
        def wrapper(*args, **kwargs):
            value = request.json.get(key, default)
            if value not in valid:
                return {"error": "invalid value for {}".format(key)}
            return wrappee(value, *args, **kwargs)
        return wrapper
    return decorator

# Programs generate an output that is separated by a 0xFF. Anything
# before the separator is ignored. Anything after the separator is considered
# to be the output.

PREFIX = path.join(path.abspath(sys.path[0]), 'bin')

def simple_exec(version, command, args):
    out, _ = execute(version, command, args, request.json["code"])

    if request.json.get("separate_output") is True:
        split = out.split(b"\xff", 1)

        ret = {"rustc": split[0].decode()}
        if len(split) == 2: # compilation succeeded
            ret["program"] = split[1].decode(errors="replace")
        print(ret)
        return ret
    else:
        return {"result": out.replace(b"\xff", b"", 1).decode(errors="replace")}

SCRIBBLE = path.join(PREFIX, "scribble.sh")
@route("/scribble.json", method=["POST", "OPTIONS"])
@enable_post_cors
def scribble():
    return simple_exec('', SCRIBBLE, ())

PROJECT = path.join(PREFIX, "project.sh")
@route("/project.json", method=["POST", "OPTIONS"])
@enable_post_cors
def scribble():
    proto = request.json.get("proto", "")
    role = request.json.get("role", "")
    return simple_exec('', PROJECT, (proto, role))

GRAPH = path.join(PREFIX, "graph.sh")
@route("/graph.json", method=["POST", "OPTIONS"])
@enable_post_cors
def scribble():
    proto = request.json.get("proto", "")
    role = request.json.get("role", "")
    return simple_exec('', GRAPH, (proto, role))

os.chdir(sys.path[0])
run(host='0.0.0.0', port=8080, server='cherrypy')
