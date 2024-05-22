var timeoutInput;

function handleKeyupSearch() {
    clearTimeout(timeoutInput);
    timeoutInput = setTimeout(function () {

        alert('Timeout');
        // ...

    }, 250);
}

function handleKeyupInput(event) {
    if (event.keyCode === 13) {

        alert('Enter');
        // ...

    }
}




function getHtmlElements() {
    var arrObjElements = [
        {
            name: "Some name a",
            size: 5000,
            type: "Some type a",
            dateCreated: new Date(),
            dateLastModified: new Date(),
            name_new: "Some name_new a"
        },
        {
            name: "Some name b",
            size: 8000,
            type: "Some type b",
            dateCreated: new Date(),
            dateLastModified: new Date(),
            name_new: "Some name_new b"
        }
    ];
    if (!arrObjElements) { return '<p class="txt-error">Keine Daten eingelesen</p>'; }
    if (arrObjElements.length === 0) { return '<p>Es wurden keine Eintr&auml;ge gefunden</p>'; }
    var strHtml = ''
        + '<table>'
        + '  <thead>'
        + '    <tr>'
        + '      <th class="table-column-checkbox">'
        + '        <input type="checkbox" id="cb-allelements" onclick="" checked >'
        + '      </th>'
        + '      <th><span class="pointer" onclick="">Aktueller Name</span></th>'
        + '      <th><span class="pointer" onclick="">Gr&ouml;&szlig;e</span></th>'
        + '      <th><span class="pointer" onclick="">Typ</span></th>'
        + '      <th><span class="pointer" onclick="">Erstelldatum</span></th>'
        + '      <th><span class="pointer" onclick="">&Auml;nderungsdatum</span></th>'
        + '      <th><span class="pointer" onclick="">Neuer Name</span></th>'
        + '      <th></th>'
        + '    </tr>'
        + '  </thead>'
        + '  <tbody>';
    var countListing = 0;
    var countSelection = 0;
    var totalSizeInBytes = 0;
    for (var i = 0; i < arrObjElements.length; i++) {
        var curElement = arrObjElements[i];
        countListing++;
        var curHtmlId = 'cb-element-' + i;
        strHtml += ''
            + '<tr>'
            + '  <td class="td-checkbox">'
            + '    <input type="checkbox" id="' + curHtmlId + '" onclick=""' + (curElement ? ' checked' : '') + '>'
            + '  </td>'
            + '  <td><label for="' + curHtmlId + '">' + curElement.name + '</label></td>'
            + '  <td><label for="' + curHtmlId + '">' + ((curElement.size === -1) ? '(Kein Zugriff)' : ((curElement.size / 1024).toLocaleString() + ' KB')) + '</label></td>'
            + '  <td><label for="' + curHtmlId + '">' + curElement.type + '</label></td>'
            + '  <td><label for="' + curHtmlId + '">' + (getDateStringGerman(new Date(curElement.dateCreated))) + '</label></td>'
            + '  <td><label for="' + curHtmlId + '">' + (getDateStringGerman(new Date(curElement.dateLastModified))) + '</label></td>'
            + '  <td class="td-new-name"><label for="' + curHtmlId + '">' + curElement.name_new.replace(/ /g, '&nbsp;') + '</label></td>'
            + ((false) ? '' : (''
                + '  <td class="td-btns">'
                + '    <button type="button" class="btn-customsort" id="btn-customsort-up-' + i + '"' + ((i === 0) ? ' disabled' : '') + '>&#8639;</button>'
                + '    <button type="button" class="btn-customsort" id="btn-customsort-down-' + i + '"' + ((i === arrObjElements.length - 1) ? ' disabled' : '') + '>&#8642;</button>'
                + '  </td>'
            ))
            + '</tr>';
    }
    if (countListing === 0) { return '<p>Keine Treffer</p>'; }
    strHtml += ''
        + '  </tbody>'
        + '  <tfoot>'
        + '    <tr>'
        + '      <td colspan="5">' + 'Ausgew&auml;hlt: ' + countSelection + ', Gr&ouml;&szlig;e: ' + (totalSizeInBytes / 1024).toLocaleString() + ' KB' + '</td>'
        + '    </tr>'
        + '  </tfoot>'
        + '</table> ';
    return strHtml;
}

