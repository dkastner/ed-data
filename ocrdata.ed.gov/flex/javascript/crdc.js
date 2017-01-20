/// <reference path="jquery-1.6.1.min.js" />
/// <reference path="jquery.scrollTo.js" />
/// <reference path="jquery.address-1.3.2.js" />
/// <reference path="jquery-ui-1.8.5.custom.js" />
/// <reference path="jquery.ui.core.js" />


function $GE(elemID) {
    return document.getElementById(elemID);
}

function $ClearSession() {
    var session;
    session = $("#ctl00_hfSession").val();
    $.post("utilities/ClearSession.ashx?SessionId=" + session, {},
    function (response) {
        var res = response;
    });

};

function settbExportsValue(v) {
    $('#tbExportType').val(v);
}
function settbChartTypeValue(v) {
    $('#tbChartType').val(v);
}

function closeReportViewer() {
    $('#ctl00_div_ucReportViewer_ASPxPivotGrid1_ddlMeasureType').val('0');
    $('#tbMeasureType').val('0');
    $('#divReportViewer').hide();
    $("#blur").fadeOut("fast");
    $('#CoverControls').hide();
}

function showHideSearchTip(a, e) {
    var currentText = $(a).html();
    e = '#' + e;
    if (currentText.indexOf('Show') != -1) {
        $(e).show();
        $(a).html('Hide Additional Search Tips');
    }
    else {
        $(e).hide();
        $(a).html('Show Additional Search Tips');
    }
}

function hideSearchTip() {
    $('.st').each(function (i,e) {
        $(e).hide();
    });
    $('.at').each(function (i,e) {
        $(e).html('Show Additional Search Tips');
    });
}

function ToggleSearchOptions(edLevel) {
    var div = '#div' + edLevel + 'SearchDetail';
    if ($(div) != null) {
        var varName = 'show' + edLevel + 'Search';
        if ($(div).is(':visible')) {
            $(div).hide();
            this[varName] = false;
            $('#imgToggle').attr('src', 'images/expand.gif');
        }
        else {
            $(div).show();
            this[varName] = true;
            $('#imgToggle').attr('src', 'images/collapse.gif');
        }
    }
}

function doWeHaveSearchCriteria() {
    var weHaveValues = false;
    //$('#ctl00_div_ucSearch_upSearchParams .' + schoolOrDistrictSearch).each(function () {
    $('#ctl00_div_ucSearch_upSearchParams').each(function () {
        if ($(this).val() != '') {
            weHaveValues = true;
        }
    });

    return weHaveValues;
}

function doWeHaveAdditionalSearchCriteria() {
    var wehaveAdditionalSearchCriteria = false;
    var div;
    if (schoolOrDistrictSearch == 'school') {
        div = 'divSchoolSearchDetail';
    } else {
        div = 'divDistrictSearchDetail';
    }
    
    if ($('#' + div + ' input:checked').length != 0) wehaveAdditionalSearchCriteria = true;
    if (wehaveAdditionalSearchCriteria == false) {
        $('#' + div + ' :input').each(function (i, e) {
            if ($(e).attr('type') != 'checkbox' && $(e).attr('id') != 'ctl00_div_ucSearch_schoolOptions_ddlStudentNumber' && $(e).attr('id') != 'ctl00_div_ucSearch_districtOptions_ddlSchoolNumber') {
                if ($(e).val() != '') {
                    wehaveAdditionalSearchCriteria = true;
                    return false;
                }
            }
        });
    }
    return wehaveAdditionalSearchCriteria;
}

function setButtonClicked(trueOrFalse) {
    buttonHasBeenClicked = trueOrFalse;
}

function hideExpandedSearchFields(edLevel) {
    if (ckeckIfUserAcceptedUsageAgreement($('#ctl00_div_ucSearch_btnSearchParams')) != true) return false;
    var isGood = DoSearch();
    if (isGood == false) return false;
    var div = '#div' + edLevel + 'SearchDetail';

    // check to see if any of the optional values are used. If so we show the additional search options section.
    var wehaveAdditionalSearchCriteria = doWeHaveAdditionalSearchCriteria();

    if (wehaveAdditionalSearchCriteria == true) {
        $(div).show();
        $('#imgToggle').attr('src', 'images/collapse.gif');
    }
    else {
        //var varName = 'show' + edLevel + 'Search';
        $(div).hide();
        //this[varName] = false;
        $('#imgToggle').attr('src', 'images/expand.gif');
    }
    hideSearchTip();
    return true;
}

/**** Search results functions ****/

function ChangeCheckBoxState(id, checkState) {
    if ($('#' + id) != null)
       $('#' + id + '[checked=' + checkState + ']');
}

function HeaderSelectChanged(e) {
    // This 'firstChild' business is due to ASP.Net's tendency to wrap everything in span elements and give *that* your CSS class.
    var isChecked = $(e).is(':checked');
    $('.cbRow').each(function (i, row) {
        $(row).children(':first-child').attr('checked', isChecked);
    });
}

function RowSelectChanged(e) {
    var isChecked = $(e).attr('checked');
    if (isChecked == true) {
        $('.cbRow').each(function (row) {
            if ($(this).children(':first-child').is(':checked') == false) {
                isChecked = false;
                return false;
            }
        });
    }
    $('.cbHeader').first().children(':first-child').attr('checked', isChecked);
}

/**** Report viewer functions ****/

function UpdateReportInfo(ReportID, EntityFilter, EducationLevelID, IsSwitching) {
    $('#tbReportID').val(ReportID);
    $('#tbEntityFilter').val(EntityFilter);
    $('#tbEducationLevelID').val(EducationLevelID);
    $('#tbIsSwitching').val(IsSwitching);
    if (IsSwitching == 1)
        $('#tbIsFiltered').val(0);
    $('#tbIsPaging').val(0);
    $('#tbFilterInfo').val('');
    $('#tbIsExporting').val(0);
}

function UpdateFiltered(IsFiltered) {
    $('#tbIsSwitching').val(0);
    $('#tbIsFiltered').val(IsFiltered);
    $('#tbIsPaging').val(0);
}

function SwitchView(Grid, ReportID) {
    var EntityFilter = $('#tbEntityFilter').val();
    var EducationLevelID = $('#tbEducationLevelID').val();
    UpdateReportInfo(ReportID, EntityFilter, EducationLevelID, 1);
    $('#tbPageIndex').val(0);
    $('#tbAjaxCallBack').val(1);
    
    Grid.PerformCallback('SV|' + ReportID + '|' + EntityFilter + '|' + EducationLevelID);
    return false;
}

function SwitchMeasureType(Grid, mType) {
    var EntityFilter = $('#tbEntityFilter').val();
    var EducationLevelID = $('#tbEducationLevelID').val();
    var ReportID = $('#tbReportID').val();
    $('#tbIsSwitching').val(0);
    $('#tbIsPaging').val(0);
    $('#tbMeasureType').val(mType);
    $('#tbIsExporting').val(0);
    Grid.PerformCallback('CM|' + mType + '|' + EntityFilter + '|' + EducationLevelID);
    return false;
}

function RestoreReport(Grid, ReportID) {
    UpdateFiltered(0);
    $('#tbFilterInfo').val('');
    $('#tbAjaxCallBack').val(0);
    var EducationLevelID = $('#tbEducationLevelID').val();
    Grid.PerformCallback('RP|' + ReportID + '|' + EducationLevelID);
    return false;
}

function FilterValue(Grid, FieldName, FieldValue) {
    UpdateFiltered(1);
    var EducationLevelID = $('#tbEducationLevelID').val();
    var filterInfo = $('#tbFilterInfo').val();
    if (filterInfo == '')
        filterInfo = 'FV|';
    else
        filterInfo += '|';
    $('#tbAjaxCallBack').val(1);
    $('#tbFilterInfo').val(filterInfo + FieldName + '~' + FieldValue);
    Grid.OnCallbackError = FilterError;
    Grid.PerformCallback('FV|' + FieldName + '~' + FieldValue);
    return false;
}

function FilterError(result) {
    //Remove last filter value since filter was not performed
    var filterInfo = $('#tbFilterInfo').val().replace('FV|', '');
    var index = filterInfo.lastIndexOf("|")
    if (index == -1)
        filterInfo = '';
    else
        filterInfo = 'FV|' + filterInfo.substring(0, index);
    $('#tbFilterInfo').val(filterInfo);
    alert(result);
    this.OnAfterCallback();
}

function SetPageIndex(id) {
    var pgIndex = parseInt($('#tbPageIndex').val());
    if (id.replace('PB', '') == 'N')
        pgIndex = pgIndex + 1;
    else if (id.replace('PB', '') == 'P')
        pgIndex = pgIndex - 1;
    else
        pgIndex = parseInt(id.replace('PN', ''));
    $('#tbPageIndex').val(pgIndex);
}

function setNullCellColor() {
    $('.nullValue').each(function (i, e) {
        $(this).parent().css('background-color', 'silver');
    });
}

function SortColumn(grid, fieldIndex, isColumn, visibleIndex, dataIndex, sortType, sortStr) {
    var EducationLevelID = $('#tbEducationLevelID').val();
    $('#tbIsSwitching').val(0);
    $('#tbIsPaging').val(0);
    $('#tbSortInfo').val('SC|' + fieldIndex + '|' + isColumn.toString() + '|' + visibleIndex + '|' + dataIndex + '|' + sortType + '|' + sortStr + '|' + EducationLevelID);
    grid.PerformCallback('SC|' + fieldIndex + '|' + isColumn + '|' + visibleIndex + '|' + dataIndex + '|' + sortType + '|' + sortStr + '|' + EducationLevelID);
    return false;
}
function printChartViewer() {
    var reportTitle = $('#sReportTitle').text();
    $('#printChartArea').printArea({ mode: "popup", popClose: true, popHt: 600, popWd: 900, popTitle: reportTitle + " Chart" });
}
function closeChartViewer(){
    $('#divChartContainer').hide();
}
function ViewChart() {
    var reportTitle = $('#sReportTitle').text() + ' Chart';
    $('#spanChartTitle').html(reportTitle);
    $('#divChartContainer').show();
    $('#divChart').css('height', $('#divChartContainer').height() - 50 + 'px');
    panel.PerformCallback('test');
}

function ViewTable() { // not used now that we use popup div
    $('#divGoBack').hide();
    $('#divChart').hide();
    $('#divReportViewerContainer').show();
    $('#divTipContainer').show();
}

function SetWidths() {
    //Hide padding
    var viewer = $('#ctl00_div_ucReportViewer_ASPxPivotGrid1_MT');
    var viewerWidthOrig = $(viewer).outerWidth();
    var trs = $('#ctl00_div_ucReportViewer_ASPxPivotGrid1_MT tr');
    var t1 = $(trs).first();
    var t2 = $(trs).eq(1);
    var divs1 = $(t1 + '[class="field_container_icon_sort"]');
    var divs2 = $(t2 + '[class="field_container_icon_sort"]');
    TogglePadding(divs1, false);
    TogglePadding(divs2, false);

//    //Get width of pdf and report viewer
    var pdfWidth = 1000;
    var bodyWidth = $('#body').outerWidth();
    var viewerWidth = $(viewer).outerWidth();

//    //If viewer width exceeds pdf width, temporarily set it to pdf width
    if (viewerWidth > pdfWidth) {
        $('#ctl00_div_ucReportViewer_ASPxPivotGrid1_MT').css('width',pdfWidth + 'px');
        viewerWidth = pdfWidth;
    }

//    //Get first row with actual measure data
    var firstTr = $(trs).eq(2), extraSpace = 10;
    if ($('#tbMeasureType').val() == 2)
        extraSpace = 35; //Add extra space when showing counts & percentages

//    //Get width of all cells in first row
    var cells = $(firstTr).children(), i = 0, cellWidths = [];
    var cellOffWidth;
    var minCellWidthEnt = 230; //Min width for entity info cells
    var minCellWidthCat = 120; //Min width for category cells
    $(cells).each(function(i, cell) {
        //Skip percent cells when showing counts and percentages
        if ($(cell).hasClass('dxpgCellPercent')) return;

        //Get width of cell
        cellOffWidth = $(cell).outerWidth();
        //Check if we need to use min width for entity info cell
        if (i == 0) {
            if (minCellWidthEnt >= cellOffWidth) {
                viewerWidth += (minCellWidthEnt - cellOffWidth);
                cellOffWidth = minCellWidthEnt;
            }
        }
        //Check if we need to use min width for category cell
        else if (i == 1) {
            if (minCellWidthCat >= cellOffWidth) {
                viewerWidth += (minCellWidthCat - cellOffWidth);
                cellOffWidth = minCellWidthCat;
            }
            else
                cellOffWidth -= 4;
        }
        else if ((i == 2 && cell.id != '') || (i == 3 && cell.id != '')) {
            //Remove extra width due to padding for filter icons
            cellOffWidth -= 4;
            viewerWidth -= 4;
        }
        else if (i > 1) {
            //Add extra space to accomodate pdf font
            cellOffWidth += extraSpace;
            viewerWidth += extraSpace;
        }
        cellWidths.push(cellOffWidth);
        i++;
    });
    
    //Set width of table
    var totalWidth = (viewerWidth / pdfWidth * 100);
    if (totalWidth > 100)
        totalWidth = 100;

    //Set width of columns
    var colWidths = '';
    $(cellWidths).each(function(i,width) {
        colWidths += ';' + (width / viewerWidth * 100);
        //colWidths += ';' + (width);
    });
    //Set value to string of widths found
    $('#tbWidths').val(totalWidth + colWidths);
    //Show padding
    TogglePadding(divs1, true);
    TogglePadding(divs2, true);

    //Set viewer width to original width in case it was changed
    $(viewer).css('width',viewerWidthOrig + 'px');
}

function TogglePadding(divs, show) {
    var paddingRight;
    if (show)
        paddingRight = '35px';
    else
        paddingRight = '3px';
    $(divs).each(function (i, div) {
        $(div).css('padding-right', paddingRight);
    });
}

function ToggleButtons(enabled, grid) {
    if (enabled) {
        $('#ctl00_div_ucReportViewer_btnExport').removeAttr('disabled');
        $('#btnViewChart').removeAttr('disabled');
        setNullCellColor();
        setButtonToolTip();
    }
    else {
        $('#ctl00_div_ucReportViewer_btnExport').attr('disabled', 'disabled');
        $('#btnViewChart').attr('disabled', 'disabled');
    }
}
        
/**** Profile functions *****/
function ShowProfile(rid, type, e, schoolYear) {
    if (ckeckIfUserAcceptedUsageAgreement(e) != true) return false;
    //Get path for link to return from profile
    var path = $('#divSearchControl').is(':visible') ? 0 : 1;

    //Hide any other possibly open divs
    if (path == 1) {
        $('#divSearchControl').hide()
        $('#divResultsContainer').hide();
        $('#divReportViewer').show();
    }
    else {
        $('#divSearchControl').show()
        $('#divResultsContainer').show();
        //$('#divReportViewer').hide();
    }

    //Set loading HTML
    $.ajax({
        url: "ViewProfile.aspx/#top",
        data: { id: rid, profileType: type, returnPath: path, sy: schoolYear },
        beforeSend: function () {
        },
        success: function (req) {
            var ht = $(window).height();
            var wt = $(window).width();
            var iht = $(document).height();
            var iwt = $(document).width();
            ht = (ht - 50);
            wt = wt < 900 ? wt - 10 : 900;
            $('#CoverControls').show().removeAttr('style').attr('style', 'height:' + ht + 'px; width:' + wt + 'px; border-style:none;z-index:3')
            CenterDiv(wt, ht, 'CoverControls');
            $('#divProfile').html(req).hide();
            $('.profile-content').first().dialog({
                title: type.replace('district', 'District').replace('school', 'School') + ' Profile',
                modal: true,
                position: 'center',
                width: wt, height: ht,
                closeOnEscape: true,
                draggable: false,
                resizable: false,
                close: function (event, ui) {
                    $('#CoverControls').hide();
                    $('.ui-icon-closethick').each(function (i, e) {
                        $(this).bind('mousedown', function () {
                            $('#CoverControls').hide();
                        })
                    });
                    $('.profile-content').html('')
                },
                buttons:
        [
            {
                text: "Close",
                click: function () {
                    $(this).dialog("close");
                }
            },
            {
                text: "Print",
                click: function () {
                    $('#print_' + type + '_Content').printArea({ mode: "popup", popClose: true, popHt: ht, popWd: wt, popTitle: type.replace("district", "District").replace("school", "School") + " Profile", popX: 5, popY: 5 });
                }
            },
            {
                text: "Export as PDF",
                click: function () {
                    return OnExportProfileClicked(type, 'pdf');
                }
            },
            {
                text: "Export as HTML",
                click: function () {
                    var ht = $(window).height();
                    var wt = $(window).width();
                    ht = (ht - 50);
                    wt = wt < 900 ? wt - 10 : 900;
                    var ct = '';
                    var content = '';
                    var fullContact = ''

                    fullContact = $('<fullDoc>');
                    var doc = $('<html>');
                    var head = $('<head>');
                    var title = $('<title>');
                    var css = $('<link rel="stylesheet" type="text/css" href="css/crdc.css" />');
                    var body = $('<body>');
                    $(body).css('margin', '5px 15px 5px 15px').css('font-size', '10px');
                    content = $('#print_' + type + '_Content').html();
                    $(title).append(type.replace("district", "District").replace("school", "School") + " Profile");
                    $(content).appendTo($(body));
                    $(title).appendTo($(head));
                    $(css).appendTo($(head));
                    $(head).appendTo($(doc));
                    $(body).appendTo($(doc));
                    $(doc).appendTo($(fullContact));
                    ct = $(fullContact).html();
                    win3 = window.open('', 'Window3', 'toolbar=0,scrollbars=1,location=0,statusbar=0,menubar=1,resizable=1,width=' + wt + ',height=' + ht + ',left=50,top=50');
                    win3.document.writeln(ct);
                    try { win3.document.execCommand("saveAs", false, "profile.html"); } catch (e) { }

                }
            }
        ]
            });
        },
        error: function () {
            // $('#divProfile').html('<span style="color: red; ">An error occured while loading this profile.</span>');
            ProfileError(path);
        },
        complete: function () {
        },
        async: true,
        type: 'get'

    });

}

function showReportInfo() {
    var tbEntityFilter = $('#tbEntityFilter').val();
    var tbReportID = $('#tbReportID').val();
    var tbEducationLevelID = $('#tbEducationLevelID').val();
    var tbMeasureType = $('#tbMeasureType').val();
    $('#rptInfo').text(tbEntityFilter + ' - ' + tbReportID + ' - ' + tbEducationLevelID + ' - ' + tbMeasureType);
    $('#rptInfo').show();
}

function hideReportInfo() {
    $('#rptInfo').hide();
}

function printReportViewer() {
    var reportTitle = $('#sReportTitle').text();
    $('#reportPrintContainer').printArea({ mode: "popup", popClose: true, popHt: 600, popWd: 1100, popTitle: reportTitle + ' Report' });
}

function ProfileError(returnPath) {
    alert('An error occured while loading this profile.');
}

/**** Export function ****/

function OnExportProfileClicked(profileType, exportType) {
    var id = $('#profileId').val();
    var sy = $('#SurveyYear').val();
    var url = "ReportExport.aspx?id=" + id + "&exportType=" + exportType + "&ProfileType=" + profileType + "&sy=" + sy;

    if (exportType == 'html')
        window.open(url,'','toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, titlebar=no, resizable=yes');
    else
        document.location = url;
    return false;
}

var AgreementMsg = '';
function ckeckIfUserAcceptedUsageAgreement(e) {
    var didUserAcceptAgreement = $.cookie('acceptAgreement');
    if (didUserAcceptAgreement != 'true') {
        $('#CoverControls').show().removeAttr('style').attr('style', 'height:450px; width:700px; border-style:none;z-index:3')
    CenterDiv(700, 450, 'CoverControls');

        AgreementMsg = '<div>' +
    ' <p>' +
    ' The purpose of the U.S. Department of Education Civil Rights Data Collection ' +
    ' (CRDC) is to obtain data about the nation’s Local Education Agencies and ' +
    ' elementary and secondary schools. The CRDC collects information about students ' +
    ' in public schools, including enrollment and educational programs and services, ' +
    ' disaggregated by race/ethnicity, sex, limited English proficiency, and ' +
    ' disability. Information is collected in an aggregated form at the school-level ' +
    ' to protect individually identifiable data from disclosure. Personally ' +
    ' identifiable information (e.g., student’s name, social security number, date of ' +
    ' birth) is not collected as part of the CRDC.' +
    ' <br />' +
    ' The U.S. Department of Education Office for Civil Rights (OCR) implements ' +
    ' statistical methods to minimize the risk of disclosure of individually ' +
    ' identifiable data. To help prevent the CRDC from being used to identify any ' +
    ' individuals, OCR also requires that users agree that they will:' +
    ' <ul><li>' +
    ' Make no use of the identity of any person discovered inadvertently, and advise ' +
    ' OCR via email at ocrdata@ed.gov of any such discovery.' +
    ' </li><li>' +
    ' Not link this dataset with individually identifiable data from other datasets.' +
    ' </li></ul>' +
    ' To proceed you must signify your agreement to comply with these requirements. ' +
    ' This window will close and the CRDC tool will proceed when you signify your ' +
    ' agreement.</p>' +
    ' </div>';
        $(AgreementMsg).dialog({
            title: 'CRDC USAGE AGREEMENT',
            modal: true,
            position: 'center',
            width: 700, height: 450,
            closeOnEscape: false,
            draggable: false,
            resizable: false,
            close: function (event, ui) {
                $('#CoverControls').hide(); 
            },
            buttons:
            [
                {
                    text: "I Accept",
                    click: function () {
                        $.cookie('acceptAgreement', 'true', { path: '/' });
                        $(this).dialog("close");
                        if (e != null) { $(e).click(); }
                    }
                },
                {
                    text: "I Do Not Accept",
                    click: function () {
                        $.cookie('acceptAgreement', 'false', { path: '/' });
                        $(this).dialog("close");
                    }
                }
            ]
        });
            return false;
    }
    else {
        return true;
    }
}



var SuppressionMsg = '';
function showSuppression() {
        $('#CoverControls').show().removeAttr('style').attr('style', 'height:700px; width:800px; border-style:none;z-index:10')
        /*CenterDiv(700, 450, 'CoverControls');*/

        SuppressionMsg = '<div><strong>2011-12</strong><br/><ul><li>In 2011-12, OCR implemented new rounding rules to protect individual student privacy.  Except as noted below, all reported zeros are true zeros; all student counts are rounded to the midpoint in groups of three (e.g., student counts between 1 and 3 were rounded to 2).</li><li>For three variables (IDEA student counts, Algebra I Passing, Advanced Placement Test Passing), however, an alternative rounding method was applied to protect student privacy.  Student counts between zero and 2 are rounded to zero; all subsequent numbers are rounded to the midpoint in groups of three (e.g., student counts between 3 and 5 were rounded to 4).</li><li>All percentages and totals are based on the rounded data.</li></ul><br/><strong>Prior Years</strong><ul><li>The previous rounding rules continue to apply for CRDC survey years 2000, 2004, 2006, and 2009-10.  All data for these surveys was rounded to the nearest five (e.g., student counts between 3 and 7 were rounded to 5).  Individual cell values may not add to the Total shown (both numbers and percents).</li></ul><br/><strong>Table Notes</strong><ul><li>A cell filled with the color grey refers to data not available.  For example, gifted and talented data is not collected by Section 504 status.  Therefore, the Section 504 column appears grey in the gifted and talented enrollment tables. </li><li>A zero cell may refer to non-applicable data.  For example, if a school does not offer a gifted and talented education program, the enrollment table will display zeros for all student counts. </li><li>An asterisk “*” indicates that data was expected but not submitted.  For data on student counts by disability category and high school completers, an asterisk indicates that the school was included in the CRDC but missing data from the EDFacts directory. </li></ul><br/>For additional information on privacy protection methodology and notes about the data, please see the CRDC data notes. <br/></div>';
        $(SuppressionMsg).dialog({
            title: 'CRDC ROUNDING',
            modal: true,
            position: 'center',
            width: 800, height: 700,
            closeOnEscape: false,
            draggable: false,
            resizable: false,
            close: function (event, ui) {
                $('#CoverControls').hide();
            },
            buttons:
            [
                {
                    text: "Close",
                    click: function () {
                        $(this).dialog("close");
                    }
                },
            ]
        });
}


/**
* Cookie plugin
*
* Copyright (c) 2006 Klaus Hartl (stilbuero.de)
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
*
*/

/**
* Create a cookie with the given name and value and other optional parameters.

* @example $.cookie('the_cookie', 'the_value', { expires: 7, path: '/', domain: 'jquery.com', secure: true }); //Create a cookie with all available options.

* @example $.cookie('the_cookie', 'the_value', { path: '/' }); // Create a session cookie.

* @example $.cookie('the_cookie', null, { path: '/' }); //Delete a cookie by passing null as value. Keep in mind that you have to use the same path and domain used when the cookie was set.

* @param String name The name of the cookie.
* @param String value The value of the cookie.
* @param Object options An object literal containing key/value pairs to provide optional cookie attributes.
* @option Number|Date expires Either an integer specifying the expiration date from now on in days or a Date object.
*                             If a negative value is specified (e.g. a date in the past), the cookie will be deleted.
*                             If set to null or omitted, the cookie will be a session cookie and will not be retained
*                             when the the browser exits.
* @option String "path" The value of the path atribute of the cookie (default: path of page that created the cookie).
* @option String" domain" The value of the domain attribute of the cookie (default: domain of page that created the cookie).
* @option Boolean "secure" If true, the secure attribute of the cookie will be set and the cookie transmission will
*                        require a secure protocol (like HTTPS).

* Get the value of a cookie with the given name.
* @example var myVal = $.cookie('the_cookie'); //  Get the value of a cookie.

*/
jQuery.cookie = function (name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        // CAUTION: Needed to parenthesize options.path and options.domain
        // in the following expressions, otherwise they evaluate to undefined
        // in the packed version for some reason...
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};


/**
* jQuery.query - Query String Modification and Creation for jQuery
* Written by Blair Mitchelmore (blair DOT mitchelmore AT gmail DOT com)
* Licensed under the WTFPL (http://sam.zoy.org/wtfpl/).
* Date: 2009/8/13
*
* @author Blair Mitchelmore
* @version 2.1.7
*
**/
new function (settings) {
    // Various Settings
    var $separator = settings.separator || '&';
    var $spaces = settings.spaces === false ? false : true;
    var $suffix = settings.suffix === false ? '' : '[]';
    var $prefix = settings.prefix === false ? false : true;
    var $hash = $prefix ? settings.hash === true ? "#" : "?" : "";
    var $numbers = settings.numbers === false ? false : true;

    jQuery.query = new function () {
        var is = function (o, t) {
            return o != undefined && o !== null && (!!t ? o.constructor == t : true);
        };
        var parse = function (path) {
            var m, rx = /\[([^[]*)\]/g, match = /^([^[]+)(\[.*\])?$/.exec(path), base = match[1], tokens = [];
            while (m = rx.exec(match[2])) tokens.push(m[1]);
            return [base, tokens];
        };
        var set = function (target, tokens, value) {
            var o, token = tokens.shift();
            if (typeof target != 'object') target = null;
            if (token === "") {
                if (!target) target = [];
                if (is(target, Array)) {
                    target.push(tokens.length == 0 ? value : set(null, tokens.slice(0), value));
                } else if (is(target, Object)) {
                    var i = 0;
                    while (target[i++] != null);
                    target[--i] = tokens.length == 0 ? value : set(target[i], tokens.slice(0), value);
                } else {
                    target = [];
                    target.push(tokens.length == 0 ? value : set(null, tokens.slice(0), value));
                }
            } else if (token && token.match(/^\s*[0-9]+\s*$/)) {
                var index = parseInt(token, 10);
                if (!target) target = [];
                target[index] = tokens.length == 0 ? value : set(target[index], tokens.slice(0), value);
            } else if (token) {
                var index = token.replace(/^\s*|\s*$/g, "");
                if (!target) target = {};
                if (is(target, Array)) {
                    var temp = {};
                    for (var i = 0; i < target.length; ++i) {
                        temp[i] = target[i];
                    }
                    target = temp;
                }
                target[index] = tokens.length == 0 ? value : set(target[index], tokens.slice(0), value);
            } else {
                return value;
            }
            return target;
        };

        var queryObject = function (a) {
            var self = this;
            self.keys = {};

            if (a.queryObject) {
                jQuery.each(a.get(), function (key, val) {
                    self.SET(key, val);
                });
            } else {
                jQuery.each(arguments, function () {
                    var q = "" + this;
                    q = q.replace(/^[?#]/, ''); // remove any leading ? || #
                    q = q.replace(/[;&]$/, ''); // remove any trailing & || ;
                    if ($spaces) q = q.replace(/[+]/g, ' '); // replace +'s with spaces

                    jQuery.each(q.split(/[&;]/), function () {
                        var key = decodeURIComponent(this.split('=')[0] || "");
                        var val = decodeURIComponent(this.split('=')[1] || "");

                        if (!key) return;

                        if ($numbers) {
                            if (/^[+-]?[0-9]+\.[0-9]*$/.test(val)) // simple float regex
                                val = parseFloat(val);
                            else if (/^[+-]?[0-9]+$/.test(val)) // simple int regex
                                val = parseInt(val, 10);
                        }

                        val = (!val && val !== 0) ? true : val;

                        if (val !== false && val !== true && typeof val != 'number')
                            val = val;

                        self.SET(key, val);
                    });
                });
            }
            return self;
        };

        queryObject.prototype = {
            queryObject: true,
            has: function (key, type) {
                var value = this.get(key);
                return is(value, type);
            },
            GET: function (key) {
                if (!is(key)) return this.keys;
                var parsed = parse(key), base = parsed[0], tokens = parsed[1];
                var target = this.keys[base];
                while (target != null && tokens.length != 0) {
                    target = target[tokens.shift()];
                }
                return typeof target == 'number' ? target : target || "";
            },
            get: function (key) {
                var target = this.GET(key);
                if (is(target, Object))
                    return jQuery.extend(true, {}, target);
                else if (is(target, Array))
                    return target.slice(0);
                return target;
            },
            SET: function (key, val) {
                var value = !is(val) ? null : val;
                var parsed = parse(key), base = parsed[0], tokens = parsed[1];
                var target = this.keys[base];
                this.keys[base] = set(target, tokens.slice(0), value);
                return this;
            },
            set: function (key, val) {
                return this.copy().SET(key, val);
            },
            REMOVE: function (key) {
                return this.SET(key, null).COMPACT();
            },
            remove: function (key) {
                return this.copy().REMOVE(key);
            },
            EMPTY: function () {
                var self = this;
                jQuery.each(self.keys, function (key, value) {
                    delete self.keys[key];
                });
                return self;
            },
            load: function (url) {
                var hash = url.replace(/^.*?[#](.+?)(?:\?.+)?$/, "$1");
                var search = url.replace(/^.*?[?](.+?)(?:#.+)?$/, "$1");
                return new queryObject(url.length == search.length ? '' : search, url.length == hash.length ? '' : hash);
            },
            empty: function () {
                return this.copy().EMPTY();
            },
            copy: function () {
                return new queryObject(this);
            },
            COMPACT: function () {
                function build(orig) {
                    var obj = typeof orig == "object" ? is(orig, Array) ? [] : {} : orig;
                    if (typeof orig == 'object') {
                        var add = function (o, key, value) {
                            if (is(o, Array))
                                o.push(value);
                            else
                                o[key] = value;
                        }
                        jQuery.each(orig, function (key, value) {
                            if (!is(value)) return true;
                            add(obj, key, build(value));
                        });
                    }
                    return obj;
                }
                this.keys = build(this.keys);
                return this;
            },
            compact: function () {
                return this.copy().COMPACT();
            },
            toString: function () {
                var i = 0, queryString = [], chunks = [], self = this;
                var encode = function (str) {
                    str = str + "";
                    if ($spaces) str = str.replace(/ /g, "+");
                    return encodeURIComponent(str);
                };
                var addFields = function (arr, key, value) {
                    if (!is(value) || value === false) return;
                    var o = [encode(key)];
                    if (value !== true) {
                        o.push("=");
                        o.push(encode(value));
                    }
                    arr.push(o.join(""));
                };
                var build = function (obj, base) {
                    var newKey = function (key) {
                        return !base || base == "" ? [key].join("") : [base, "[", key, "]"].join("");
                    };
                    jQuery.each(obj, function (key, value) {
                        if (typeof value == 'object')
                            build(value, newKey(key));
                        else
                            addFields(chunks, newKey(key), value);
                    });
                };

                build(this.keys);

                if (chunks.length > 0) queryString.push($hash);
                queryString.push(chunks.join($separator));

                return queryString.join("");
            }
        };

        return new queryObject(location.search, location.hash);
    };
} (jQuery.query || {}); // Pass in jQuery.query as settings object

function clear_form_elements(ele) {
    $('#' + ele).find(':input').each(function () {
        switch (this.type) {
            case 'password':
            case 'select-multiple':
            case 'select-one':
            case 'text':
            case 'textarea':
                $(this).val('');
                break;
            case 'checkbox':
            case 'radio':
                this.checked = false;
        }
    });

}

function ClearForm() {
    clear_form_elements('divSearchControl');
    $("#ctl00_div_ucSearch_cblYears INPUT[type='checkbox']").last().attr('checked', true);
}


function setButtonToolTip() {
    $('img[alt="Remove"]').each(function (i, e) {
        $(e).attr('title', 'Click here to remove this dimension (row or column) from the report');
    });
    $('img[src*="sort_up_down"]').each(function (i, e) {
        $(e).attr('title', 'Sort in ascending order');
    });
    $('img[src*="sort_down"]').each(function (i, e) {
        $(e).attr('title', 'Sort in ascending order');
    });
    $('img[src*="sort_up."]').each(function (i, e) {
        $(e).attr('title', 'Sort in descending order');
    });

}

/**
*  Version 2.4.1 Copyright (C) 2013
*  Tested in IE 11, FF 28.0 and Chrome 33.0.1750.154
*  No official support for other browsers, but will TRY to accommodate challenges in other browsers.
*  Example:
*      Print Button: <div id="print_button">Print</div>
*      Print Area  : <div class="PrintArea" id="MyId" class="MyClass"> ... html ... </div>
*      Javascript  : <script>
*                       $("div#print_button").click(function(){
*                           $("div.PrintArea").printArea( [OPTIONS] );
*                       });
*                     </script>
*  options are passed as json (example: {mode: "popup", popClose: false})
*
*  {OPTIONS}   | [type]     | (default), values      | Explanation
*  ---------   | ---------  | ---------------------- | -----------
*  @mode       | [string]   | (iframe),popup         | printable window is either iframe or browser popup
*  @popHt      | [number]   | (500)                  | popup window height
*  @popWd      | [number]   | (400)                  | popup window width
*  @popX       | [number]   | (500)                  | popup window screen X position
*  @popY       | [number]   | (500)                  | popup window screen Y position
*  @popTitle   | [string]   | ('')                   | popup window title element
*  @popClose   | [boolean]  | (false),true           | popup window close after printing
*  @extraCss   | [string]   | ('')                   | comma separated list of extra css to include
*  @retainAttr | [string[]] | ["id","class","style"] | string array of attributes to retain for the containment area. (ie: id, style, class)
*  @standard   | [string]   | strict, loose, (html5) | Only for popup. For html 4.01, strict or loose document standard, or html 5 standard
*  @extraHead  | [string]   | ('')                   | comma separated list of extra elements to be appended to the head tag
*/
(function ($) {
    var counter = 0;
    var modes = { iframe: "iframe", popup: "popup" };
    var standards = { strict: "strict", loose: "loose", html5: "html5" };
    var defaults = { mode: modes.iframe,
        standard: standards.html5,
        popHt: 500,
        popWd: 400,
        popX: 200,
        popY: 200,
        popTitle: '',
        popClose: false,
        extraCss: '',
        extraHead: '',
        retainAttr: ["id", "class", "style"]
    };

    var settings = {}; //global settings

    $.fn.printArea = function (options) {
        $.extend(settings, defaults, options);

        counter++;
        var idPrefix = "printArea_";
        $("[id^=" + idPrefix + "]").remove();

        settings.id = idPrefix + counter;

        var $printSource = $(this);

        var PrintAreaWindow = PrintArea.getPrintWindow();

        PrintArea.write(PrintAreaWindow.doc, $printSource);

        setTimeout(function () { PrintArea.print(PrintAreaWindow); }, 1000);
    };

    var PrintArea = {
        print: function (PAWindow) {
            var paWindow = PAWindow.win;

            $(PAWindow.doc).ready(function () {
                paWindow.focus();
                paWindow.print();

                if (settings.mode == modes.popup && settings.popClose)
                    setTimeout(function () { paWindow.close(); }, 2000);
            });
        },
        write: function (PADocument, $ele) {
            PADocument.open();
            PADocument.write(PrintArea.docType() + "<html>" + PrintArea.getHead() + PrintArea.getBody($ele) + "</html>");
            PADocument.close();
        },
        docType: function () {
            if (settings.mode == modes.iframe) return "";

            if (settings.standard == standards.html5) return "<!DOCTYPE html>";

            var transitional = settings.standard == standards.loose ? " Transitional" : "";
            var dtd = settings.standard == standards.loose ? "loose" : "strict";

            return '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01' + transitional + '//EN" "http://www.w3.org/TR/html4/' + dtd + '.dtd">';
        },
        getHead: function () {
            var extraHead = "";
            var links = "";

            if (settings.extraHead) settings.extraHead.replace(/([^,]+)/g, function (m) { extraHead += m });

            $(document).find("link")
                .filter(function () { // Requirement: <link> element MUST have rel="stylesheet" to be considered in print document
                    var relAttr = $(this).attr("rel");
                    return ($.type(relAttr) === 'undefined') == false && relAttr.toLowerCase() == 'stylesheet';
                })
                .filter(function () { // Include if media is undefined, empty, print or all
                    var mediaAttr = $(this).attr("media");
                    return $.type(mediaAttr) === 'undefined' || mediaAttr == "" || mediaAttr.toLowerCase() == 'print' || mediaAttr.toLowerCase() == 'all'
                })
                .each(function () {
                    links += '<link type="text/css" rel="stylesheet" href="' + $(this).attr("href") + '" >';
                });
            if (settings.extraCss) settings.extraCss.replace(/([^,\s]+)/g, function (m) { links += '<link type="text/css" rel="stylesheet" href="' + m + '">' });

            return "<head><title>" + settings.popTitle + "</title>" + extraHead + links + "</head>";
        },
        getBody: function (elements) {
            var htm = "";
            var attrs = settings.retainAttr;
            elements.each(function () {
                var ele = PrintArea.getFormData($(this));

                var attributes = ""
                for (var x = 0; x < attrs.length; x++) {
                    var eleAttr = $(ele).attr(attrs[x]);
                    if (eleAttr) attributes += (attributes.length > 0 ? " " : "") + attrs[x] + "='" + eleAttr + "'";
                }

                htm += '<div ' + attributes + '>' + $(ele).html() + '</div>';
            });

            return "<body>" + htm + "</body>";
        },
        getFormData: function (ele) {
            var copy = ele.clone();
            var copiedInputs = $("input,select,textarea", copy);
            $("input,select,textarea", ele).each(function (i) {
                var typeInput = $(this).attr("type");
                if ($.type(typeInput) === 'undefined') typeInput = $(this).is("select") ? "select" : $(this).is("textarea") ? "textarea" : "";
                var copiedInput = copiedInputs.eq(i);

                if (typeInput == "radio" || typeInput == "checkbox") copiedInput.attr("checked", $(this).is(":checked"));
                else if (typeInput == "text" || typeInput == "") copiedInput.attr("value", $(this).val());
                else if (typeInput == "select")
                    $(this).find("option").each(function (i) {
                        if ($(this).is(":selected")) $("option", copiedInput).eq(i).attr("selected", true);
                    });
                else if (typeInput == "textarea") copiedInput.text($(this).val());
            });
            return copy;
        },
        getPrintWindow: function () {
            switch (settings.mode) {
                case modes.iframe:
                    var f = new PrintArea.Iframe();
                    return { win: f.contentWindow || f, doc: f.doc };
                case modes.popup:
                    var p = new PrintArea.Popup();
                    return { win: p, doc: p.doc };
            }
        },
        Iframe: function () {
            var frameId = settings.id;
            var iframeStyle = 'border:0;position:absolute;width:0px;height:0px;right:0px;top:0px;';
            var iframe;

            try {
                iframe = document.createElement('iframe');
                document.body.appendChild(iframe);
                $(iframe).attr({ style: iframeStyle, id: frameId, src: "#" + new Date().getTime() });
                iframe.doc = null;
                iframe.doc = iframe.contentDocument ? iframe.contentDocument : (iframe.contentWindow ? iframe.contentWindow.document : iframe.document);
            }
            catch (e) { throw e + ". iframes may not be supported in this browser."; }

            if (iframe.doc == null) throw "Cannot find document.";

            return iframe;
        },
        Popup: function () {
            var windowAttr = "location=yes,statusbar=no,directories=no,menubar=no,titlebar=no,toolbar=no,dependent=no";
            windowAttr += ",width=" + settings.popWd + ",height=" + settings.popHt;
            windowAttr += ",resizable=yes,screenX=" + settings.popX + ",screenY=" + settings.popY + ",personalbar=no,scrollbars=yes";

            var newWin = window.open("", "_blank", windowAttr);

            newWin.doc = newWin.document;

            return newWin;
        }
    };
})(jQuery);

function AddTHEAD(tableName) {
    $('#ctl00_div_ucSearchResults_schoolSearchResults_gvSearchResults tr:first').siblings().wrapAll('<tbody id="tblBody" />');
    $('#ctl00_div_ucSearchResults_schoolSearchResults_gvSearchResults tr:first').wrapAll('<thead id="tblHead" />');

    $('#ctl00_div_ucSearchResults_districtSearchResults_gvSearchResults tr:first').siblings().wrapAll('<tbody id="tblBody" />');
    $('#ctl00_div_ucSearchResults_districtSearchResults_gvSearchResults tr:first').wrapAll('<thead id="tblHead" />');

    $('#ctl00_div_ucSearchResults_schoolSearchResults_gvSearchResults').tablesorter({
        // sort on the first column and third column, order asc
        sortList: [[0, 0], [2, 0]]
    });


    $('#ctl00_div_ucSearchResults_districtSearchResults_gvSearchResults').tablesorter({
        // sort on the first column and third column, order asc
        sortList: [[0, 0], [2, 0]]
    });

}


function CenterDiv(Xwidth, Yheight, divid) {
    // First, determine how much the visitor has scrolled 

    var scrolledX, scrolledY;
    if (self.pageYOffset) {
        scrolledX = self.pageXOffset;
        scrolledY = self.pageYOffset;
    } else if (document.documentElement && document.documentElement.scrollTop) {
        scrolledX = document.documentElement.scrollLeft;
        scrolledY = document.documentElement.scrollTop;
    } else if (document.body) {
        scrolledX = document.body.scrollLeft;
        scrolledY = document.body.scrollTop;
    }

    // Next, determine the coordinates of the center of browser's window 

    var centerX, centerY;
    if (self.innerHeight) {
        centerX = self.innerWidth;
        centerY = self.innerHeight;
    } else if (document.documentElement && document.documentElement.clientHeight) {
        centerX = document.documentElement.clientWidth;
        centerY = document.documentElement.clientHeight;
    } else if (document.body) {
        centerX = document.body.clientWidth;
        centerY = document.body.clientHeight;
    }

    // Xwidth is the width of the div, Yheight is the height of the 
    // div passed as arguments to the function: 
    var leftOffset = scrolledX + (centerX - Xwidth) / 2;
    var topOffset = scrolledY + (centerY - Yheight) / 2;
    // The initial width and height of the div can be set in the 
    // style sheet with display:none; divid is passed as an argument to // the function 
    var o = document.getElementById(divid);
    var r = o.style;
    r.position = 'absolute';
    r.top = topOffset + 'px';
    r.left = leftOffset + 'px';
    r.display = "block";
}

$.extend({ URLEncode: function (c) {
    var o = ''; var x = 0; c = c.toString(); var r = /(^[a-zA-Z0-9_.]*)/;
    while (x < c.length) {
        var m = r.exec(c.substr(x));
        if (m != null && m.length > 1 && m[1] != '') {
            o += m[1]; x += m[1].length;
        } else {
            if (c[x] == ' ') o += '+'; else {
                var d = c.charCodeAt(x); var h = d.toString(16);
                o += '%' + (h.length < 2 ? '0' : '') + h.toUpperCase();
            } x++;
        }
    } return o;
},
    URLDecode: function (s) {
        var o = s; var binVal, t; var r = /(%[^%]{2})/;
        while ((m = r.exec(o)) != null && m.length > 1 && m[1] != '') {
            b = parseInt(m[1].substr(1), 16);
            t = String.fromCharCode(b); o = o.replace(m[1], t);
        } return o;
    }
});


// usage: var csvText = tableRowsToCSV($("#table1").getElementsByTagName("tr")); 

function tableRowsToCSV(theRows) {
    // Converts table rows into a csv stream
    var csv = "";
    for (var r = 0; r < theRows.length; r++) {
        var csvRow = "";

        var theCells = theRows.item(r).cells;
        for (var c = 0; c < theCells.length; c++) {
            var cellData = theCells.item(c).innerText;
            if (cellData.indexOf(",") != -1) {
                cellData = "'" + cellData + "'";
            }
            csvRow += "," + cellData;
        }
        if (csvRow != "") {
            csvRow = csvRow.substring(1, csvRow.length);
        }
        csv += csvRow + "\n";
    }
    return csv;
}