#!/usr/bin/env python3

import subprocess

def playpen(version, command, arguments, data=None):
    return subprocess.Popen(("playpen",
                            "root-" + version,
                            "--mount-proc",
                            "--user=rust",
                            "--timeout=5",
                            "--syscalls-file=whitelist",
                            "--devices=/dev/urandom:r",
                            "--memory-limit=128",
                            "--",
                            command) + arguments,
                            stdin=subprocess.PIPE,
                            stdout=subprocess.PIPE,
                            stderr=subprocess.STDOUT)

def echo(version, command, arguments, data=None):
    return subprocess.Popen(("echo", "version:", version,
                            "command:",
                            command) + arguments,
                            stdin=subprocess.PIPE,
                            stdout=subprocess.PIPE,
                            stderr=subprocess.STDOUT)

def bash(version, command, arguments, data=None):
    return subprocess.Popen(("bash", "-c",
                            command) + arguments,
                            stdin=subprocess.PIPE,
                            stdout=subprocess.PIPE,
                            stderr=subprocess.STDOUT)
                           

def execute(version, command, arguments, data=None):
    with bash(version, command, arguments, data) as p:
        if data is None:
            out = p.communicate()[0]
        else:
            out = p.communicate(data.encode())[0]
        return (out, p.returncode)
