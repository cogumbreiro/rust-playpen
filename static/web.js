"use strict";

function send(path, data, callback) {
    var result = document.getElementById("result");

    result.textContent = "Running...";

    var request = new XMLHttpRequest();
    request.open("POST", path, true);
    request.setRequestHeader("Content-Type", "application/json");
    request.onreadystatechange = function() {
        if (request.readyState == 4) {
            var json;

            try {
                json = JSON.parse(request.response);
            } catch (e) {
                console.log("JSON.parse(): " + e);
            }

            if (request.status == 200) {
                callback(json);
            } else {
                result.textContent = "connection failure";
            }
        }
    }
    request.timeout = 10000;
    request.ontimeout = function() {
        result.textContent = "connection timed out"
    }
    request.send(JSON.stringify(data));
}

function simpleExec(result, path, data) {
    send(path, data,
         function(object) {
          result.textContent = object["result"];

          var div = document.createElement("div");
          div.className = "message";
          div.textContent = "Program ended.";
          result.appendChild(div);
    });
}

function getQueryParameters() {
    var a = window.location.search.substr(1).split('&');
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; i++) {
        var p = a[i].split('=');
        if (p.length != 2) continue;
        b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
}


/*
 * Sets up the interface, by connecting the function handlers above to the
 * controls of the interface.
 */
addEventListener("DOMContentLoaded", function() {
    var proto = document.getElementById("proto");
    var role = document.getElementById("role");
    var result = document.getElementById("result");
    /* Obtain the editor component */
    var editor = ace.edit("editor");
    var session = editor.getSession();
    /* Configure the editor's look and feel and the syntax it will highlight */
    editor.setTheme("ace/theme/github");
    session.setMode("ace/mode/rust");
    /* Get any parameters sent by submiting the form (aka the editor's
     * contents) */
    var query = getQueryParameters();
    if ("code" in query) {
        session.setValue(query["code"]);
    } else {
        var code = localStorage.getItem("code");
        if (code !== null) {
            session.setValue(code);
        }
    }
    /*
     * Store the code in the editor in the cache of the browser.
     */
    session.on("change", function() {
        localStorage.setItem("code", session.getValue());
    });
    /*
     * Connect the button 'scribble' to the handler 'simpleExec'
     */
    document.getElementById("scribble").onclick = function() {
        simpleExec(result, "/scribble.json", {code:session.getValue()});
    };
    /*
     * Connect the button 'project' to the handler 'simpleExec'
     */
    document.getElementById("project").onclick = function() {
        simpleExec(result,
            "/project.json",
            {code:session.getValue(), proto:proto.value, role:role.value});
    };
    /*
     * Connect the button 'graph' to the handler 'simpleExec'
     */
    document.getElementById("graph").onclick = function() {
        simpleExec(result,
            "/graph.json",
            {code:session.getValue(), proto:proto.value, role:role.value});
    };
}, false);
