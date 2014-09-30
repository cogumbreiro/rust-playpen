import subprocess

def playpen(command, arguments):
    return subprocess.Popen(("playpen",
                            "root",
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

def echo(command, arguments):
    return subprocess.Popen(("echo", command) + arguments,
                            stdin=subprocess.PIPE,
                            stdout=subprocess.PIPE,
                            stderr=subprocess.STDOUT)

def raw_exec(command, arguments):
    return subprocess.Popen((command,) + arguments,
                            stdin=subprocess.PIPE,
                            stdout=subprocess.PIPE,
                            stderr=subprocess.STDOUT)
                           

def execute(command, arguments, data):
    with raw_exec(command, arguments) as p:
        if data is None:
            out = p.communicate()[0]
        else:
            out = p.communicate(data.encode())[0]
        return (out, p.returncode)
