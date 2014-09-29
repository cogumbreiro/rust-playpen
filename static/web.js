"use strict";

var samples = 2;

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

function simple_exec(result, path, data) {
    send(path, data,
         function(object) {
          result.textContent = object["result"];

          var div = document.createElement("div");
          div.className = "message";
          div.textContent = "Program ended.";
          result.appendChild(div);
    });
}

function share(result, version, code) {
    var playurl = "http://play.rust-lang.org?code=" + encodeURIComponent(code);
    if (version != "master") {
        playurl += "&version=" + encodeURIComponent(version);
    }
    if (playurl.length > 5000) {
        result.textContent = "resulting URL above character limit for sharing. " +
            "Length: " + playurl.length + "; Maximum: 5000";
        return;
    }

    var url = "http://is.gd/create.php?format=json&url=" + encodeURIComponent(playurl);

    var request = new XMLHttpRequest();
    request.open("GET", url, true);

    request.onreadystatechange = function() {
        if (request.readyState == 4) {
            if (request.status == 200) {
                setResponse(JSON.parse(request.responseText)['shorturl']);
            } else {
                result.textContent = "connection failure";
            }
        }
    }

    request.send();

    function setResponse(shorturl) {
        while(result.firstChild) {
            result.removeChild(result.firstChild);
        }

        var link = document.createElement("a");
        link.href = link.textContent = shorturl;

        result.textContent = "short url: ";
        result.appendChild(link);
    }
}

function setSample(sample, session, result, index) {
    var request = new XMLHttpRequest();
    sample.options[index].selected = true;
    request.open("GET", "/sample/" + index + ".rs", true);
    request.onreadystatechange = function() {
        if (request.readyState == 4) {
            if (request.status == 200) {
                session.setValue(request.responseText.slice(0, -1));
            } else {
                result.textContent = "connection failure";
            }
        }
    }
    request.send();
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
    var shareButton = document.getElementById("share");
    var result = document.getElementById("result");
    var sample = document.getElementById("sample");
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
        } else {
            var index = Math.floor(Math.random() * samples);
            setSample(sample, session, result, index);
        }
    }
    /* the tools can have versions, probe the version supplied by the user
     * and set it in the UI */
    if ("version" in query) {
        version.value = query["version"];
    }
    /* 
     * XXX: No idea what this is.
     */ 
    if (query["run"] === "1") {
        evaluate(result, session.getValue(), version.options[version.selectedIndex].text,
                 optimize.options[optimize.selectedIndex].value);
    }
    /*
     * Store the code in the editor in the cache of the browser.
     */
    session.on("change", function() {
        localStorage.setItem("code", session.getValue());
    });
    /*
     * Connect the dropdown with the examples to the handler 'setSample'
     */
    sample.onchange = function() {
        setSample(sample, session, result, sample.selectedIndex);
    };
    /*
     * Connect the button 'scribble' to the handler 'simple_exec'
     */
    document.getElementById("scribble").onclick = function() {
        simple_exec(result, "/scribble.json", {code:session.getValue()});
    };
    /*
     * Connect the button 'project' to the handler 'simple_exec'
     */
    document.getElementById("project").onclick = function() {
        simple_exec(result,
            "/project.json",
            {code:session.getValue(), proto:proto.value, role:role.value});
    };
    /*
     * Connect the button 'graph' to the handler 'simple_exec'
     */
    document.getElementById("graph").onclick = function() {
        simple_exec(result,
            "/graph.json",
            {code:session.getValue(), proto:proto.value, role:role.value});
    };
}, false);
