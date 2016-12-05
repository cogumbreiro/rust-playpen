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
          //div.textContent = "Program ended.";
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

function setSample(sample, session, result, index) {
    var request = new XMLHttpRequest();
    sample.options[index].selected = true;
    if (sample.options[index].value == "") {
        // skip options without a value
        return;
    }
    var file = sample.options[index].value;
    request.open("GET", "/sample/" + file, true);
    request.onreadystatechange = function() {
        if (request.readyState == 4) {
            if (request.status == 200) {
                session.setValue(request.responseText.slice(0, -1));
            } else {
                result.textContent = "connection failure";
            }
        }
    };
    request.send();
}

function toggleProjectGraph(modesel, roleinp, projbutt, graphbutt) {
    var tmp = modesel.options[modesel.selectedIndex].value;
    if (tmp == "linmp") {
        roleinp.setAttribute("disabled", 'true');
        projbutt.setAttribute("disabled", 'true');
        graphbutt.setAttribute("disabled", 'true');
    } else {
        roleinp.removeAttribute("disabled");
        projbutt.removeAttribute("disabled");
        graphbutt.removeAttribute("disabled");
    }
}

function checkProto(modesel, session, proto) {
    //simpleExec(result, "/scribble.json", {code:session.getValue()});
    var tmp = modesel.options[modesel.selectedIndex].value;
    if (tmp == "linmp") {
        simpleExec(result, "/scrib-linmp.json", {code:session.getValue(), proto:proto.value});
    } else {
        simpleExec(result, "/scrib-default.json", {code:session.getValue()});
    }
    //selectText("result");
}

function selectText(element) {
    if (document.selection) {
        var range = document.body.createTextRange();
        range.moveToElementText(element);
        range.select();
    } else if (window.getSelection) {
        var range = document.createRange();
        range.selectNodeContents(element);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
    }
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

    var modesel = document.getElementById("modesel");
    var projbutt = document.getElementById("project");
    var graphbutt = document.getElementById("graph");
    var checkbutt = document.getElementById("scribble");
    var sampsel = document.getElementById("sample");
 
    toggleProjectGraph(modesel, role, projbutt, graphbutt);
    modesel.onchange = function() { 
        toggleProjectGraph(modesel, role, projbutt, graphbutt);
    };

    /*
     * Connect the button 'scribble' to the handler 'simpleExec'
     */
    checkbutt.onclick = function() {
        checkProto(modesel, session, proto);
    };
    /*
     * Connect the button 'project' to the handler 'simpleExec'
     */
    projbutt.onclick = function() {
        simpleExec(result,
            "/project.json",
            {code:session.getValue(), proto:proto.value, role:role.value});
    };
    /*
     * Connect the button 'graph' to the handler 'simpleExec'
     */
    graphbutt.onclick = function() {
        simpleExec(result,
            "/graph.json",
            {code:session.getValue(), proto:proto.value, role:role.value});
    };

    /* Load the available samples from the server */
    send("/samples.json", {},
    function(object) {
        result.textContent = "";
        if (object["result"].length == 0) {
            sample.remove(0); // remove the "loading" option
            var load_sample = document.createElement("option");
            load_sample.value = "";
            load_sample.text = "No samples to load";
            return;
        }
        // there are some samples to load
        sample.remove(0); // remove the "loading" option
        var load_sample = document.createElement("option");
        load_sample.value = "";
        load_sample.text = "Load a sample";
        sample.add(load_sample, null);
        load_sample = document.createElement("option");
        load_sample.value = "";
        load_sample.text = "";
        sample.add(load_sample, null);
        // populate with new ones
        for (var i = 0; i < object["result"].length; i++) {
            var file = object["result"][i];
            var opt = document.createElement("option");
            opt.value = file;
            // the displayed text omits the extension
            opt.text = file.substr(0, file.lastIndexOf('.')); 
            sample.add(opt, null);
        }
        // change the contents of the editor, when changing the 
        sample.onchange = function() {
            setSample(sample, session, result, sample.selectedIndex);
        };
    });

    var seloutbutt = document.getElementById("seloutput");
    seloutbutt.onclick = function() {
        selectText(result);
    };
    var seloutbutt2 = document.getElementById("seloutput2");
    seloutbutt2.onclick = function() {
        selectText(result);
    };

    proto.onkeypress = function(e) {
        if (e.keyCode == 13) {  // Enter
            checkProto(modesel, session, proto);
        }
    }
}, false);

