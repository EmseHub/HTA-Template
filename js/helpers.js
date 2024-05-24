// This file requires JSON.stringify() and JSON.parse() from json2.js (https://github.com/douglascrockford/JSON-js/)




//#region -------------------------- STRINGS --------------------------
function cleanTextForHtml(str) {
    if (typeof str !== "string") { return null; }
    return str
        .replace(/Ä/g, '&Auml;')
        .replace(/ä/g, '&auml;')
        .replace(/Ö/g, '&Ouml;')
        .replace(/ö/g, '&ouml;')
        .replace(/Ü/g, '&Uuml;')
        .replace(/ü/g, '&uuml;')
        .replace(/ß/g, '&szlig;')
        ;
}

function cleanTextForPopup(str) {
    if (typeof str !== "string") { return null; }
    return unescape(str
        .replace(/Ä/g, '%C4')
        .replace(/ä/g, '%E4')
        .replace(/Ö/g, '%D6')
        .replace(/ö/g, '%F6')
        .replace(/Ü/g, '%DC')
        .replace(/ü/g, '%FC')
        .replace(/ß/g, '%DF')
    );
}

function escapeRegExp(strText) {
    return strText.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&'); // $& means the whole matched string
    return strText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractValuesInSyntax(strText, strStart, strEnd, isCaseSensitive) {
    var flag = isCaseSensitive ? 'g' : 'gi';
    var regex = new RegExp((escapeRegExp(strStart) + '(.*?)' + escapeRegExp(strEnd)), flag);
    var arrValues = [];
    var match = regex.exec(strText);
    while (match !== null) {
        arrValues.push(match[1])
        match = regex.exec(strText);
    }
    return arrValues;
}

function extractValuesInMultipleSyntaxes(strText, arrStartEndPairs, isCaseSensitive) {
    var arrValues = [];
    while (arrStartEndPairs.length > 0) {
        var startEndPair = arrStartEndPairs.shift();
        arrValues = arrValues.concat(extractValuesInSyntax(strText, startEndPair[0], startEndPair[1], isCaseSensitive));
    }
    return arrValues;
}
//#endregion -------------------------- STRINGS --------------------------




//#region -------------------------- DATES --------------------------
function getDateStringGerman(date) {
    if (!date || !(date instanceof Date) || isNaN(date)) { return null; }

    var fullYear = '' + date.getFullYear(); // JJJJ
    var month = ('0' + (date.getMonth() + 1)).slice(-2); // 0-11
    var day = ('0' + date.getDate()).slice(-2); // 1-31
    var hours = ('0' + date.getHours()).slice(-2); // 0-23
    var minutes = ('0' + date.getMinutes()).slice(-2); // 0-59
    var seconds = ('0' + date.getSeconds()).slice(-2); // 0-59

    return day + '.' + month + '.' + fullYear.slice(-2) + ', ' + hours + ':' + minutes + ':' + seconds;
}
//#endregion -------------------------- DATES --------------------------




//#region -------------------------- ALERTS & POPUPS --------------------------
function showAlert(strText) { alert((cleanTextForPopup(strText))); }

function showConfirmation(strText) { return confirm(cleanTextForPopup(strText)); }

function showPopup(strText, strTitle, btnType, iconType) {
    https://admhelp.microfocus.com/uft/en/all/VBScript/Content/html/f482c739-3cf9-4139-a6af-3bde299b8009.htm?Highlight=popup
    // object.Popup(strText,[nSecondsToWait],[strTitle],[nType]) 

    // Button-Type 0 --> OK
    // Button-Type 1 --> OK and Cancel
    // Button-Type 2 --> Abort, Retry, and Ignore
    // Button-Type 3 --> Yes, No, and Cancel
    // Button-Type 4 --> Yes and No
    // Button-Type 5 --> Retry and Cancel

    // Icon-Type 16 --> Stop Mark
    // Icon-Type 32 --> Question Mark
    // Icon-Type 48 --> Exclamation Mark
    // Icon-Type 64 --> Information Mark

    var shell = new ActiveXObject('WScript.Shell');
    shell.Popup(cleanTextForPopup(strText), 0, cleanTextForPopup(strTitle), btnType + iconType);
}

function showPopupInfo(strText, strTitle) {
    strTitle = strTitle || 'Hinweis';
    showPopup(strText, strTitle, 0, 64);
}

function showPopupWarning(strText, strTitle) {
    strTitle = strTitle || 'Warnung';
    showPopup(strText, strTitle, 0, 48);
}

function showPopupError(strText, strTitle) {
    strTitle = strTitle || 'Fehler';
    showPopup(strText, strTitle, 0, 16);
}
//#endregion -------------------------- ALERTS & POPUPS --------------------------




//#region -------------------------- CLIPBOARD --------------------------
function getClipboardText() {
    return window.clipboardData.getData('Text');
    // if (window.clipboardData && window.clipboardData.getData) {
    //     return window.clipboardData.getData('Text');
    // }
}
//#endregion -------------------------- CLIPBOARD --------------------------




//#region -------------------------- FILESYSTEM --------------------------
function appendToTextFile(strFilepath, strContent) {
    // object.OpenTextFile(filename[, iomode[, create[, format]]])
    // ForReading = 1, ForWriting = 2, ForAppending = 8
    try {
        var fileSystemObject = new ActiveXObject('Scripting.FileSystemObject');
        var textFile = fileSystemObject.OpenTextFile(strFilepath, 8, true);
        textFile.Write(strContent);
        textFile.Close();
    }
    catch (error) {
        showAlert('Fehler beim Anhängen von Text an die Datei "' + strFilepath + '":\n\n' + error.message);
    }
}

function readFromTextFile(strFilepath) {
    try {
        var fileSystemObject = new ActiveXObject('Scripting.FileSystemObject');
        var textFile = fileSystemObject.OpenTextFile(strFilepath, 1);
        var strContent = textFile.ReadAll();
        textFile.Close();
        return strContent;
    } catch (error) {
        showAlert('Fehler beim Lesen des Textes der Datei "' + strFilepath + '":\n\n' + error.message);
        return null;
    }
}

function writeToTextFile(strFilepath, strContent, isPrepended) {
    try {
        if (isPrepended) {
            strContent = strContent + readFromTextFile(strFilepath);
        }
        var fileSystemObject = new ActiveXObject('Scripting.FileSystemObject');
        var textFile = fileSystemObject.OpenTextFile(strFilepath, 2, true);
        textFile.Write(strContent);
        textFile.Close();
    }
    catch (error) {
        showAlert('Fehler beim Schreiben der Textdatei "' + strFilepath + '":\n\n' + error.message);
    }
}

function openFileBrowserDialog(callback) {
    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.style.display = 'none';
    fileInput.onchange = function () {
        var selectedFilePath = fileInput.value;
        document.body.removeChild(fileInput);
        callback(selectedFilePath);
    };
    document.body.appendChild(fileInput);
    fileInput.click();
}
//#endregion -------------------------- FILESYSTEM --------------------------








//#region -------------------------- APPLICATION SETTINGS --------------------------
function getArrObjDesktopMonitors() {
    var arrObjDesktopMonitors = [];
    var wmi = GetObject('winmgmts://./root/CIMv2');
    var monitors = wmi.ExecQuery('SELECT * FROM Win32_DesktopMonitor');
    for (var e = new Enumerator(monitors); !e.atEnd(); e.moveNext()) {
        arrObjDesktopMonitors.push({
            screenWidth: e.item().ScreenWidth,
            screenHeight: e.item().ScreenHeight
        });
    }
    return arrObjDesktopMonitors;
}

function writeSettings() {
    var arrObjDesktopMonitors = getArrObjDesktopMonitors();
    var objSettings = {
        lastScreenWidthAvailable: window.screen.availWidth,
        lastScreenHeightAvailable: window.screen.availHeight,
        lastDesktopMonitors: arrObjDesktopMonitors,
        lastWidth: document.body.offsetWidth,
        lastHeight: document.body.offsetHeight + 23,
        lastLeft: window.screenLeft,
        lastTop: window.screenTop
    };
    var jsonStrSettings = JSON.stringify(objSettings, null, 4);
    writeToTextFile('settings.json', jsonStrSettings, false);
}


function loadSettings(defaultWidth, defaultHeight, minWidth, minHeight) {
    defaultWidth = defaultWidth || 1300;
    defaultHeight = defaultHeight || 1020;
    minWidth = minWidth || 1280;
    minHeight = minHeight || 750;

    var arrObjDesktopMonitors = getArrObjDesktopMonitors();
    var widthAvailable = window.screen.availWidth;
    var heightAvailable = window.screen.availHeight;

    var jsonStrSettings = readFromTextFile('settings.json');
    var objSettings = (jsonStrSettings) ? JSON.parse(jsonStrSettings) : null;
    if (objSettings) {
        if (
            widthAvailable !== objSettings.lastScreenWidthAvailable
            || heightAvailable !== objSettings.lastScreenHeightAvailable
            || objSettings.lastDesktopMonitors.length !== arrObjDesktopMonitors.length
        ) { objSettings = null; }
        else {
            for (var i = 0; i < objSettings.lastDesktopMonitors.length; i++) {
                var curMonitorSettings = objSettings.lastDesktopMonitors[i];
                var curMonitorLive = arrObjDesktopMonitors[i];
                if (curMonitorSettings.screenWidth !== curMonitorLive.screenWidth || curMonitorSettings.ScreenHeight !== curMonitorLive.ScreenHeight) {
                    objSettings = null;
                    break;
                }
            }
        }
    }

    if (!objSettings) {
        objSettings = {
            lastWidth: defaultWidth,
            lastHeight: defaultHeight,
            lastLeft: 31,
            lastTop: 40
        };
    }

    var widthStartup = objSettings.lastWidth + 16;
    var heightStartup = objSettings.lastHeight + 16;
    if (!widthStartup || widthStartup < minWidth || widthStartup - 16 > widthAvailable) { widthStartup = defaultWidth; }
    if (!heightStartup || heightStartup < minHeight || heightStartup - 16 > heightAvailable) { heightStartup = defaultHeight; }
    window.resizeTo(widthStartup, heightStartup);

    var posXStartup = (arrObjDesktopMonitors.length === 1 && (objSettings.lastLeft < -300 || objSettings.lastLeft > widthAvailable - 200)) ? 0 : objSettings.lastLeft;
    var posYStartup = (arrObjDesktopMonitors.length === 1 && (objSettings.lastTop < 31 || objSettings.lastTop > heightAvailable - 100)) ? 0 : objSettings.lastTop - 31;
    window.moveTo(posXStartup - 8, posYStartup);

}
//#endregion -------------------------- APPLICATION SETTINGS --------------------------




//#region -------------------------- HTTP-REQUESTS --------------------------
function httpGetRequest(url, parseJson, callback) {
    if (!url) { return null; }

    var xhr = new ActiveXObject("Microsoft.XMLHTTP");
    // var xhr = new XMLHttpRequest();

    // xhr.onload = function () { alert('onload'); };
    // xhr.onprogress = function (event) { alert('onprogress'); };
    // xhr.onerror = function () { alert('onerror'); };

    xhr.onreadystatechange = function () {
        // Return if request isn't complete yet
        if (xhr.readyState !== 4) { return; }

        // Process our return data
        if (xhr.status >= 200 && xhr.status < 300) {
            // var data = xhr.response;
            var responseText = xhr.responseText;
            callback((parseJson) ? JSON.parse(responseText) : responseText);
        }
        else {
            alert('Error: xhr.status = ' + xhr.status);
            callback(null);
        }
    };

    // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/open
    xhr.open('GET', url);
    // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType
    // xhr.responseType = 'text';
    xhr.send();
}

function getWebsiteDocument(url, funcToDoWithDocument) {
    httpGetRequest(url, false, function (cbResponseText) {
        var iframe = document.createElement('iframe');
        document.body.appendChild(iframe);
        iframe.contentWindow.document.open();
        iframe.contentWindow.document.write(cbResponseText);
        iframe.contentWindow.document.close();
        var websiteDocument = iframe.contentDocument || iframe.contentWindow.document;

        funcToDoWithDocument(websiteDocument); // e.g. websiteDocument.getElementById('xyz').textContent;

        document.body.removeChild(iframe);
    });
}
//#endregion -------------------------- HTTP-REQUESTS --------------------------





//#region -------------------------- TEMPLATE --------------------------

// ...some code...

//#endregion -------------------------- TEMPLATE --------------------------

