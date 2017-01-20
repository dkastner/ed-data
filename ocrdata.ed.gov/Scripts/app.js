/// <reference path="lib/jquery-1.6.1-vsdoc.js" />
/// <reference path="lib/jquery.tmpl.js" />
/// <reference path="lib/jquery.json-2.2.js" />
/// <reference path="lib/jquery.format-1.1.js" />
/// <reference path="lib/jquery-ui-1.8.9.custom.min.js" />
/// <reference path="lib/jquery.ui.dialog.js" />
/// <reference path="lib/numberformat.min.js" />

////////////////
// Application specific code
////////////////
var App = function () {

}
var c = '<img src="../images/arrow_button_up.png" alt="open" border="0" align="absmiddle" />';
var o = '<img src="../images/arrow_button_down.png" alt="close" border="0" align="absmiddle" />';
var printChartOrTable = 'c', printPercentOrCount = 'c';
var repeaterCounter = 0;
var WeAreReadyToPrint = false;
var PageContainsPieCharts = false;
var messageIsAlreadyOnPage = false; // we only want to display an Incomplete message one time on the page. Not for every table/chart. So when we put the first one on the page we set this flag to true and if it is true we don't put one on the page again.
App.prototype = {
    chartColors: {
        "School": {
            //color: "#b3b3b3"   //RGB Code 179,179,179 
            color: "#69FB46"    //RGB Code 105,251,70 
        },
        "District": {
            //color: "#808080"    //RGB Code 128,128,128
            color: "#157901"    //RGB Code 21,121,1
        },
        "School Outcome": {
            color: "#b3b3b3"    //RGB Code 179,179,179
        },
        "District Outcome": {
            color: "#808080"    //RGB Code 128,128,128
        },
        "School Population": {
            color: "#b3b3b3"    //RGB Code 179,179,179
        },
        "District Population": {
            color: "#808080"    //RGB Code 128,128,128
        },
        "White": {
            color: "#00c0bd"    //RGB Code 0,192,189
        },
        "Black": {
            //color: "#fdfd7e"    //RGB Code 253,253,126
            color: "#ffbf00"
        },
        "Asian": {
            color: "#759fcd"    //RGB Code 117,159,205
        },
        "Asian/Pac Isl": {
            color: "#376091"    //RGB Code 55,96,145
        },
        "Hispanic": {
            color: "#fa8f8f"    //RGB Code 250,143,143
        },
        "Two or More": {
            color: "#a069bf"    //RGB Code 160,105,191
        },
        "Nat HI/Pac Isl": {
            color: "#91cd6e"    //RGB Code 145,205,110
        },
        "Am Ind/AK Nat": {
            color: "#faa95b"
        },
        "Females": {
            color: "#6254a2"    //RGB Code 98,84,162
        },
        "School Female": {
            color: "#6254a2"    //RGB Code 98,84,162
        },
        "Females-Only": {
            color: "#6254a2"    //RGB Code 98,84,162
        },
        "School Male": {
            color: "#ada4d0"    //RGB Code 173,164,208
        },
        "Males": {
            color: "#ada4d0"     //RGB Code 173,164,208
        },
        "Males-Only": {
            color: "#ada4d0"     //RGB Code 173,164,208
        },
        "LEP": {
            color: "#a4a437"     //RGB Code 164,164,55
        },
        "Non-LEP": {
            color: "#235c60"    //RGB Code 35,92,96
        },
        "LEP Students": {
            color: "#a4a437"    //RGB Code 164,164,55
        },
        "IDEA": {
            color: "#6254a2"    //RGB Code 98,84,162
        },
        "IDEA Students": {
            color: "#6254a2"    //RGB Code 98,84,162
        },
        "Non-IDEA": {
            color: "#bf8019"    //RGB Code 191,128,25
        },
        "Without Disabilities (IDEA)": {
            color: "#bf8019"    //RGB Code 191,128,25
        },
        "All (IDEA) Students": {
            color: "#60497a"    //RGB Code  96,73,122
        },
        "All Students": {
            color: "#60497a"    //RGB Code 96,73,122
        },
        "School Female ": {
            color: "#c8402a"    //LEP RGB Code 200,64,42
        },
        "School Male ": {
            color: "#e39a89"    //LEP RGB Code 227,154,137
        },
        "School Female  ": {
            color: "#3a9ca3"    //Disability RGB Code 58,156,163
        },
        "School Male  ": {
            color: "#94cbd0"    //Disability RGB Code 148,203,208
        },
        "Female ": {
            color: "#c8402a"    //District LEP RGB Code 200,64,42
        },
        "Male ": {
            color: "#e39a89"    //District LEP RGB Code 227,154,137
        },
        "Female  ": {
            color: "#3a9ca3"    //District Disability RGB Code 58,156,163
        },
        "Male  ": {
            color: "#94cbd0"    //District Disability RGB Code 148,203,208
        },
        "Female    ": {
            color: "#6254a2"    //District Gender RGB Code 98,84,162
        },
        "Male    ": {
            color: "#ada4d0"     //District Gender RGB Code 173,164,208
        }
    },
    toggleView: function () {
        var sUrl = "../handler/AjaxHandler.ashx?cmd=ToggleSuppressed";
        $.ajax({
            url: sUrl,
            type: "POST",
            processData: false,
            contentType: "application/json",
            dataType: "json",
            async: false,
            success: function (returnedData) {
                if (returnedData == null) {
                    alert('You do not have the proper credentials to view un-suppressed data.');
                    return;
                }
                else if (returnedData.msg != 'success') {
                    alert(returnedData.msg);
                    return;
                }
                else {
                    //alert(JSON.stringify(returnedData));
                    if (returnedData.IsViewingSuppressed == 'true') {
                        alert('This page will now reload and you will have access to suppressed data.');
                        window.location.reload();
                    }
                    else {
                        alert('This page will now reload and you will have access to unsuppressed data.');
                        window.location.reload();
                    }
                }
            },
            complete: function () {
            }
        });
    },
    IncompleteMessages: {
        "A": { msg: "Data&nbsp;for&nbsp;this&nbsp;report&nbsp;is&nbsp;not&nbsp;available" },
        "B": { msg: "Data&nbsp;is&nbsp;not&nbsp;available" },
        "C": { msg: "(Data&nbsp;for&nbsp;this&nbsp;<entity>&nbsp;not&nbsp;subjected&nbsp;to&nbsp;all&nbsp;quality&nbsp;checks)" },
        "D": { msg: "(IDEA&nbsp;and&nbsp;LEP&nbsp;data&nbsp;not&nbsp;provided)" },
        "E": { msg: "Data&nbsp;is&nbsp;not&nbsp;available" }
    },
    profileIncompleteValue: '',
    isSchoolOrDistrictPage: '',
    doWeNeedToShowSuppressionMessage: false,
    isDataComplete: null,
    DataTableSectionInfo: [],
    DistrictStartPageID: null,
    SchoolStartPageID: null,
    thisPageId: null,
    checkPermissions: function () {
        var thisUsersRole_ID = $('#Role_ID').val();
        $('.CheckPermissions').each(function (i, e) {
            var requiredRoll = $(e).attr('p');
            //alert(thisUsersRole_ID + ' - ' + requiredRoll);
            if (eval(thisUsersRole_ID) > eval(requiredRoll)) {
                $(this).hide();
            }
            else {
                $(this).show();
            }
        });
    },
    isNullOrEmpty: function (v) {
        if (v === null) { /*app.console_log('null');*/return true; }
        else if (v === undefined) { /*app.console_log('undefined');*/return true; }
        else if (v === '') { /*app.console_log('blank');*/return true; }
        else return false;
    },
    console_log: function (v) {
        if (window.console && window.console.log) console.log(v)
    },
    setChangeSchool_DistrictLink: function () {
        $('.ChangeSchool_District').each(function (i, e) {
            $(this).css('font-size', '10px').click(function () {
                var url = 'DistrictSchoolSearch';
                window.location.href = url;
            });
        });
        $('.ChangeState').each(function (i, e) {
            $(this).css('font-size', '10px').click(function () {
                var url = 'StateSelection';
                window.location.href = url;
            });
        });
    },
    formatPct: function (val) {
        if (app.isNullOrEmpty(val) || isNaN(val)) {
            //app.console_log(app.isNullOrEmpty(val) + ' - ' + val);
            return '0';
        }
        else if (val == 0) return '0.0';
        else if (val < 0) return '0';
        var num = new NumberFormat();
        num.setNumber(val); // obj.value is '-1000.247'
        num.setPlaces('1', false);
        num.setSeparators(false, '', '');
        return num.toFormatted();
    },
    formatBoolean: function (val) {
        if (app.isNullOrEmpty(val) || isNaN(val)) return '';
        if (val == 1) return 'Yes';
        if (val == 0) return 'No';
        return '-';
    },
    formatCurrency: function (val) {
        if (app.isNullOrEmpty(val) || isNaN(val)) return '';
        if (val == -5) return '-'
        if (val < 0) return '0.00'
        var num = new NumberFormat();
        num.setInputDecimal('.');
        num.setNumber(val); // obj.value is '-1000.247'
        num.setPlaces('2', false);
        num.setCurrencyValue('$');
        num.setCurrency(true);
        num.setCurrencyPosition(num.LEFT_OUTSIDE);
        num.setNegativeFormat(num.LEFT_DASH);
        num.setNegativeRed(true);
        num.setSeparators(true, ',', ',');
        return num.toFormatted();
    },
    formatWithCommas: function (val) {
        if (app.isNullOrEmpty(val)) return ''
        if (isNaN(val)) return val;
        if (val == -5) return '-'
        if (val < 0) return '0'
        var num = new NumberFormat();
        num.setNumber(val); // obj.value is '-1000.247'
        num.setPlaces('0', false);
        num.setSeparators(true, ',', ',');
        return num.toFormatted();
    },
    formatWithCommasAndDecimals: function (val) {
        if (app.isNullOrEmpty(val) || isNaN(val)) return '';
        if (val == -5) return '-'
        if (val < 0) return '0.0'
        var num = new NumberFormat();
        num.setNumber(val); // obj.value is '-1000.247'
        num.setPlaces('1', false);
        num.setSeparators(true, ',', ',');
        return num.toFormatted();
    },
    formatWithCommasAndTwoDecimals: function (val) {
        if (app.isNullOrEmpty(val) || isNaN(val)) return '';
        if (val == -5) return '-'
        if (val < 0) return '0.00'
        var num = new NumberFormat();
        num.setNumber(val); // obj.value is '-1000.247'
        num.setPlaces('2', false);
        num.setSeparators(true, ',', ',');
        return num.toFormatted();
    },

    requestQuerystring: function (name) {
        var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (!results) { return 0; }
        return results[1] || 0;
    },
    // used by JQGrid and the optionListAdd function (below) to create a option list to populate a select box. If this is a JQGrid select box call this directly, if it is a standard drop down list call the optionListAdd function
    // pass JSON data that contains an element ID and Name as the values to use for the value and text.
    optionsAdd: function (jsonData, optionListID, firstItem) {
        var returnString = '';
        if (firstItem != '') {
            returnString = ':--' + firstItem + '--;';
        }
        var thisListID = '';
        for (var i = 0; i < jsonData.length; i++) {
            var obj = jsonData[i];

            for (var key in obj) {
                if (key == 'OptionListID') {
                    //alert(obj[key]);
                    if (optionListID == obj[key]) thisListID = obj[key];
                }
                //alert(optionListID + ' - ' + thisListID);
                else if (thisListID == optionListID && key == 'OptionListValue') {
                    returnString += obj[key];
                    //alert(returnString);
                    return returnString;
                }
            }
        }
        return returnString;
    },
    // used to add options to a regular select box
    // jsonData = the json data returned from a jqGridOptionsList web service/handler/AjaxHandler.ashx call
    // optionListID - the name of the option list/OptionListID
    // firstItem - (optional) if you want to add an option at the top of the list (i.e. "--Select--") put it here
    // selectedValue - (optional) the value that you want selected
    // optionalListID - (optional) if the dropdown box is different than the OptionListID returned in the JSON put the ID of the dropdown box here.
    optionListAdd: function (jsonData, optionListID, firstItem, selectedValue, optionalListID) {

        var optionListString = this.optionsAdd(jsonData, optionListID, firstItem);
        var elSel;
        if (optionalListID != undefined && optionalListID != '' && optionalListID != null) { // in case we want to put this value into a dropdown list that is not named the same as the optionListID (ie: State_ID is the optionListID, but we want to put it into a dropdown list State_ID2)
            elSel = document.getElementById(optionalListID);
        }
        else {
            elSel = document.getElementById(optionListID);
        }
        var OptListArray = optionListString.split(';');
        var selArray = [];
        if (selectedValue) {
            selArray = selectedValue.toString().split(',');
        }
        for (var i = 0; i < OptListArray.length; i++) {
            var optArray = OptListArray[i].split(':');
            var elOptNew = document.createElement('option');
            var optVal = jQuery.trim(optArray[0]);
            elOptNew.text = optArray[1];
            elOptNew.value = optVal;
            elOptNew.selected = false;
            try {
                elSel.add(elOptNew, null); // standards compliant; doesn't work in IE
            }
            catch (ex) {
                elSel.add(elOptNew); // IE only
            }
            if (jQuery.inArray(optVal.toString(), selArray) != -1) {
                elOptNew.selected = true;
            }

        }
    },

    /*
    gets the text for a dropdown list
    used as follows (for a jqGrid custom formatter):

    var selectFormatter = function (cellValue, options, rowData) {
    if (cellValue == '') return '';
    var columnName = options.colModel.index;
    var cellText = app.optionsGetText(eval(addressOptionsData.d), columnName, cellValue);
    var pgHtml = '<span originalValue="' + cellValue + '">' + cellText + '</span>';
    return pgHtml;
    }
    */
    optionsGetText: function (jsonData, optionListID, passedVal) {
        var optionListString = this.optionsAdd(jsonData, optionListID, '');
        var OptListArray = optionListString.split(';');
        for (var i = 0; i < OptListArray.length; i++) {
            var optArray = OptListArray[i].split(':');
            var optVal = jQuery.trim(optArray[0]);
            var text = optArray[1];
            if (passedVal == optVal) {
                return text;
            }
        }
        return '';
    },
    getTodaysDate: function () {
        var m_TODAY = new Date();
        var m_Day = m_TODAY.getDate();
        var m_Month = (m_TODAY.getMonth() + 1);
        var m_Year = m_TODAY.getFullYear();
        var MY_DATE = m_Month + "/" + m_Day + "/" + m_Year;
        return MY_DATE;
    },
    formatJsonDate: function (jsonDate) {
        if (jsonDate) {
            try {
                var d = new Date();
                var timeZoneOffset = d.getTimezoneOffset();
                var n = parseInt(jsonDate.substr(6)) + (timeZoneOffset * 60000);
                var dt = new Date(parseInt(n));
                return dateFormat(dt, 'standard', null);
            } catch (ccc) { return ''; }
        }
        else return '';
    },
    alertWarning: function (msg, heading, showCloseBtn, _width, _height) {
        if (app.isNullOrEmpty(heading)) heading = 'Warning';
        if (_width == undefined || _width == null) _width = 250;
        if (_height == undefined || _height == null) _height = 120;
        var closeBtn = '';
        var pWidth = _width - 60;
        if (showCloseBtn == true) closeBtn = '<p><br><center><input id="btnOk" class="btnOK" title="OK" type="button" value="&nbsp;&nbsp;  OK  &nbsp;&nbsp;" onclick="app.closeAlertWarning()"  style="cursor:pointer;" /></center></p>';
        $('<div class="alertWarningDiv" id="dialog" title="' + heading + '"><div style="width:' + pWidth + 'px">' + msg + '</div><p>' + closeBtn + '</p></div>')
        .dialog({
            title: heading,
            modal: true,
            position: [500, 250],
            width: _width - 30,
            height: _height,
            closeOnEscape: true
        });
        if (showCloseBtn == true) {
            setTimeout(function () {
                $('#btnOk').focus();
            }, 200)
        }
    },
    closeAlertWarning: function () {
        $('.ui-dialog-titlebar-close').last().click();
    },
    ShowMessage: function (msg, heading, showCloseBtn, _width, _height) {
        if (app.isNullOrEmpty(heading)) heading = 'Warning';
        if (_width == undefined || _width == null) _width = 250;
        if (_height == undefined || _height == null) _height = 120;
        var closeBtn = '';
        var pWidth = _width - 60;
        if (showCloseBtn == true) closeBtn = '<p><br><center><input id="btnOk" class="btnOK" title="OK" type="button" value="&nbsp;&nbsp;  OK  &nbsp;&nbsp;" onclick="app.closeMessage()"  style="cursor:pointer;" /></center></p>';
        var alertWarningDiv = $('<div class="alertWarningDiv" id="dialog" title="' + heading + '"><div style="width:' + pWidth + 'px">' + msg + '</div><p>' + closeBtn + '</p></div>');
        $(alertWarningDiv).dialog({
            title: heading,
            modal: true,
            width: _width - 30,
            height: _height,
            closeOnEscape: true,
            open: function () {
                $('.ui-dialog-titlebar-close').remove();
            }
        });
        if (showCloseBtn == true) {
            setTimeout(function () {
                $('#btnOk').focus();
            }, 200)
        }
    },
    closeMessage: function () {
        $('.alertWarningDiv').dialog('close');
    },
    centerDivVertical: function (divid) {
        // First, determine how much the visitor has scrolled 
        var Xwidth = $('#' + divid).width();
        var scrolledX;
        if (self.pageYOffset) {
            scrolledX = self.pageXOffset;
        } else if (document.documentElement && document.documentElement.scrollTop) {
            scrolledX = document.documentElement.scrollLeft;
        } else if (document.body) {
            scrolledX = document.body.scrollLeft;
        }

        // Next, determine the coordinates of the center of browser's window 

        var centerX;
        if (self.innerHeight) {
            centerX = self.innerWidth;
        } else if (document.documentElement && document.documentElement.clientHeight) {
            centerX = document.documentElement.clientWidth;
        } else if (document.body) {
            centerX = document.body.clientWidth;
        }

        // Xwidth is the width of the div, Yheight is the height of the 
        // div passed as arguments to the function: 
        var leftOffset = scrolledX + (centerX - Xwidth) / 2;
        // The initial width and height of the div can be set in the 
        // style sheet with display:none; divid is passed as an argument to // the function 
        $('#' + divid).css({
            'position': 'absolute',
            'left': leftOffset + 'px',
            'display': 'block'
        });
    },
    initMenu: function () {
        $('#menu ul').hide();
        //$('#menu ul:first').show();
        $('#menu li a').click(
			function () {
			    var checkElement = $(this).next();
			    if ((checkElement.is('ul')) && (checkElement.is(':visible'))) {
			        return false;
			    }
			    if ((checkElement.is('ul')) && (!checkElement.is(':visible'))) {
			        $('#menu ul:visible').slideUp('normal');
			        checkElement.slideDown('normal');
			        return false;
			    }
			});
    },
    getJSONFromName_DataArray: function (a, t_c, PercentOrRegular) {
        if (PercentOrRegular == 'normal' || PercentOrRegular == 'dollars' || PercentOrRegular == 'boolean') {
            return a; // we don't want to calculate percentages if it is not a percentage value.
        }
        var json = eval(JSON.stringify(a).replace(/^,*/, ""));
        // if we are viewing tables we want to convert the counts to percentages
        if ((IsViewingCharts == false && IsViewingPercentages == true && (t_c == 'c' || t_c == 'bs')) || t_c == 'bs' || t_c == 'c' || (t_c == 't' && IsViewingPercentages == true)) { // we are viewing as a table
            var dataSumArray = []; // an array that holds the sums for each column
            // we're getting the sums for each table column
            $(json).each(function (i, v) {
                //alert(JSON.stringify(v));
                if (t_c == 'bs') {
                    var denominatorArray = [];
                    var Calc_Pct_By = (json[i].Calc_Pct_By) == 'undefined' || (json[i].Calc_Pct_By) == null ? 'N' : (json[i].Calc_Pct_By).toUpperCase();
                    var dataArray = v;
                    try {
                        dataArray = JSON.stringify(v.data).replace('[', '').replace(']', '').replace('-5', '0').split(',');
                        denominatorArray = JSON.stringify(v.Denominator).replace('[', '').replace(']', '').replace('-5', '0').split(',');
                    }
                    catch (e) { }
                    dataSumArray[i] = []; // dynamically create an array used to store the sum
                    for (var w = 0; w < denominatorArray.length; w++) {
                        dataSumArray[i].push(denominatorArray[w])
                    }
                }
                else {
                    var denominator = json[i].Denominator;
                    var Calc_Pct_By = (json[i].Calc_Pct_By) == 'undefined' || (json[i].Calc_Pct_By) == null ? 'N' : (json[i].Calc_Pct_By).toUpperCase();
                    var dataArray = v;
                    try {
                        dataArray = JSON.stringify(v.data).replace('[', '').replace(']', '').replace('-5', '0').split(',');
                    }
                    catch (e) {

                    }

                    // if we're calculating by row (instead of by column) AND we have a predefined sum (denominator)
                    if (Calc_Pct_By == 'N') { // no calculations being done.
                    }
                    else if (Calc_Pct_By == 'R' && denominator > 0) {
                        dataSumArray[i] = []; // dynamically create an array used to store the sum
                        dataSumArray[i] = eval(denominator);
                    }
                    else {
                        if (Calc_Pct_By == 'R') dataSumArray[i] = []; // dynamically create an array used to store the sum
                        $(dataArray).each(function (n, v) {
                            // if we're calculating by rows*******************
                            if (parseInt(v) == -5) v = 0;
                            if (Calc_Pct_By == 'R') {
                                if (denominator > 0) { // you can set the denominator in the database and use it with row calculations 
                                    dataSumArray[i] = eval(denominator);
                                }
                                else if (dataSumArray[i].length == 0) { // if this is the first item in a row then we start with it
                                    dataSumArray[i] = eval(v);
                                }
                                else { // otherwise we add the current value to the previous one(s)
                                    dataSumArray[i] = eval(dataSumArray[i]) + eval(v);
                                }
                            }
                            // if we're calculating by columns *****************
                            else if (Calc_Pct_By == 'C') {
                                if (i == 0) {
                                    dataSumArray[n] = []; // dynamically create an array used to store the sum
                                }
                                if (dataSumArray[n] == undefined) {
                                    dataSumArray[n] = 0;
                                }
                                else if (dataSumArray[n].length == 0) { // if this is the first item in a row then we start with it
                                    dataSumArray[n] = eval(v);
                                }
                                else { // otherwise we add the current value to the previous one(s)
                                    dataSumArray[n] = eval(dataSumArray[n]) + eval(v);
                                }
                            }

                        });
                    }
                }
            });
            json.SumArray = [];
            // now we go through and calculate the percentages
            $(json).each(function (i, v) {
                var newDataArray = []; // create a new array to hold the percentage converted values
                var Calc_Pct_By = (json[i].Calc_Pct_By) == 'undefined' || (json[i].Calc_Pct_By) == null ? 'N' : (json[i].Calc_Pct_By).toUpperCase();
                var dataArray = v;
                try {
                    dataArray = JSON.stringify(v.data).replace('[', '').replace(']', '').replace('-5', '0').split(',');
                }
                catch (e) {

                }
                // now we devide each value by the sum, multiply by 100 and turn it into a fixed(2) number (%)
                $(dataArray).each(function (ni, v) {
                    if (parseInt(v) == -5) v = 0;
                    if (t_c == 'bs') {
                        var denominatorArray = [];
                        denominatorArray = dataSumArray[i]
                        var sum = denominatorArray[ni];
                        var newVal = 0;
                        if (sum > 0)
                            newVal = eval(v / sum * 100);
                        newDataArray.push(newVal.toFixed(1));
                        var ExistingSum = json.SumArray[ni]
                        json.SumArray[ni] = ExistingSum == undefined ? v : eval(ExistingSum) + eval(v);
                    }
                    else {
                        var sum;
                        if (Calc_Pct_By == 'C') { // if we're calculating the sums by column
                            sum = dataSumArray[ni]; // the sum we calculated per COLUMN above
                        }
                        else if (Calc_Pct_By == 'R') { // if we're calculating the sums by row
                            sum = dataSumArray[i]; // the sum we calculater per ROW above
                        }
                        var newVal
                        if (Calc_Pct_By == 'N') { newVal = v; }
                        else {
                            newVal = sum > 0 ? eval(v / sum * 1000) : 0; // perform the calculation, * 1000 to support later rounding
                            newVal = Math.round(newVal);  // rounds it 
                            newVal = newVal / 10;   //moves decimal place to correct value for percentage
                        }
                        //
                        if (t_c == 't') {
                            if (isNaN(newVal)) newVal = 0;
                            newDataArray.push(newVal.toFixed(1)); // push it into our new array
                        }
                        //this is a REAL hack to prevent the devide by 0 error. I pass a very low number in the array, and the chart displays a 0% as a result
                        else if (isNaN(newVal)) {
                            newVal = .0000001;
                            newDataArray.push(newVal.toFixed(1)); // push it into our new array
                        }
                        else {
                            newDataArray.push(newVal.toFixed(1)); // push it into our new array
                        }
                        json.SumArray[ni] = sum;
                    }

                });
                json[i].data = eval(JSON.stringify(newDataArray).replace(/\"/g, '')); // assign it to the "data" field in the json data
            });
        }
        return json; // return this to the calling function
    },
    getChartWidths: function (isSideBySide, doWeHaveAMenuInThisSection) {
        var leftPane = $('.pane.ui-layout-west.ui-layout-pane.ui-layout-pane-west');
        var rightMenuLen = doWeHaveAMenuInThisSection ? 200 : 0;
        if (isSideBySide == false) return (1020 - rightMenuLen - (leftPane.is(':hidden') ? 0 : leftPane.width())) * .95;
        else return (1020 - 200 - (leftPane.is(':hidden') ? 0 : leftPane.width())) * .95 / 2;
    },
    buildNoPieChartValues: function (chartTitle, noDataPieChartWidth) {
        var retVal = '<div class="highcharts-container" style="position: relative; overflow: hidden; width: 328.7px; height: 340px; text-align: center; font-size: 12px; vertical-align:middle;"><div class="noPieChartValuesTitle">' + chartTitle + '</div><br><div class="noPieChartValuesSubTitle">&nbsp;&nbsp;No&nbsp;Students&nbsp;Reported&nbsp;</div><br/><img src="../images/Grey_out pie_chart.png"';
        var w = noDataPieChartWidth != null ? 'width: ' + noDataPieChartWidth + 'px;' : '';
        retVal = retVal + 'style="margin: 10px 0px 0px 0px;' + w + '" alt="No Students Reported" title="No Students Reported" /><br />&nbsp;</div>';
        return retVal;
    },
    buildPieChart: function (ChartData, chartContainerID, chartTitle, chartSubtitle, incomplete) {
        PageContainsPieCharts = true; // if a page contains pie charts & the browser id ie7 we need to run the adjustLegands function
        var seriesData = jQuery.parseJSON(ChartData);
        var noDataPieChartWidth = 170;
        //var incompleteArray = [];
        var noPieChartValues = app.buildNoPieChartValues(chartTitle, noDataPieChartWidth);
        var negative5Array = [];
        $(seriesData).each(function (i, e) {
            if (e[1].toString() == '-5' || e[1].toString() == '') negative5Array.push(e[1])
        });
        //app.console_log(incomplete + ' - ' + chartTitle);
        if (incomplete == 'B') {
            $(noPieChartValues).appendTo($('#' + chartContainerID))
            //            $('<div class="noPieChartValues" style="width:250px;"><div class="noPieChartValuesTitle">' + chartTitle + '</div><center><br><h4>' + app.IncompleteMessages.B.msg + '</h4></center></div>').appendTo($('#' + chartContainerID))
            return;
        }
        else if (incomplete == 'A') {
            $(noPieChartValues).appendTo($('#' + chartContainerID))
            return;
        }
        else if (incomplete == 'C' && negative5Array.length > 0 && app.isSchoolOrDistrictPage == 'd') {
            $(noPieChartValues).appendTo($('#' + chartContainerID))
            return;
        }
        else if (incomplete == 'C') {
            var schoolOrDistrict = ''
            if (app.isSchoolOrDistrictPage == 'd')
                schoolOrDistrict = 'district';
            else
                schoolOrDistrict = 'school';
            var msg = (app.IncompleteMessages.C.msg).replace('<entity>', schoolOrDistrict);
            $('.spanIncompleteMessage').html(msg);
        }

        var seriesTotal = 0;
        var tbl1 = ChartData[0];
        if (tbl1 == undefined || tbl1 == 'undefined') {
            tbl1 = ChartData;
        }

        var colorArray = [];
        var areWePrinting = app.weArePrinting();
        app.console_log(seriesData);
        $.each(seriesData, function (i, v) {
            var lbl = v[0];
            //lbl = $.trim(lbl);
            var seriesVal = ((v[1] < 0) ? 0 : v[1]);
            seriesTotal += parseFloat(seriesVal);
            if (app.chartColors[lbl]) {
                var thisColor = app.chartColors[lbl].color
                colorArray.push(thisColor);
            }
        });
        var weHaveAMenuInThisSection = true;
        if ($('#td_' + tbl1.Section_ID).length == 0) weHaveAMenuInThisSection = false;
        var ht = 340; // areWePrinting ? 250 : 433;
        var wdt = app.getChartWidths(true, weHaveAMenuInThisSection);
        var legandWidth = eval(wdt * .98);
        var legendY = 2;
        var legendLineHeight = 'normal';
        var titleX = 0;
        var titleY = 15;

        if ($.browser.msie == true && ($.browser.version).indexOf('7') != -1) {
            //            ht = ht * .9;
            //            wdt = wdt * .9;
            //            noDataPieChartWidth = noDataPieChartWidth * .85;
            //            legendY = -5;
            titleX = -55; //Please do not change this value.  It has been set for the IE browsers at the Department.
            titleY = 7;
            //            legend:
            //            {
            //                style:
            //                {
            //                    lineheight: '100%'
            //                }
            //            }
        }
        if (seriesTotal == 0) {
            $(noPieChartValues).appendTo($('#' + chartContainerID))
            return;
        }
        ChartVariable = new Highcharts.Chart({
            chart: {
                renderTo: chartContainerID,
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                width: wdt,
                height: ht,
                backgroundColor: '#ffffff',
                borderColor: '#ffffff',
                paddingTop: -1,
                marginLeft: 0,
                paddingLeft: 0,
                paddingRight: 6
            },
            legend: {
                width: legandWidth,
                floating: true,
                align: 'left',
                borderWidth: 0,
                x: 10, // = marginLeft - default spacingLeft
                y: legendY,
                itemWidth: 140,
                style: {
                    lineheight: legendLineHeight
                },
                labelFormatter: function () {
                    // adjustment to the latest highchart version - percentage is embedded
                    //var pctVal = this.config[1] / seriesTotal * 100;
                    //return this.name + ' ' + pctVal.toFixed(1) + '% ';
                    return this.name + ' ' + this.percentage.toFixed(1) + '% ';
                }
            },

            credits: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            title: {
                text: chartTitle,
                //align: 'center'
                x: titleX,
                y: titleY
            },
            subtitle: {
                text: chartSubtitle + 'n=' + app.formatWithCommas(seriesTotal)
            },
            tooltip: {
                formatter: function () {
                    var pctVal = this.percentage.toFixed(1);
                    return '<b>' + this.point.name + '</b>: ' + pctVal + '%';
                }
            },
            plotOptions: {
                pie: {
                    center: ['50%', 90],
                    size: '62%',
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        distance: 15,
                        color: '#000000',
                        style: {
                            fontSize: '10px'
                        },
                        formatter: function () {
                            var pctVal = this.percentage.toFixed(1);
                            return pctVal + '%';
                        }
                    },
                    showInLegend: true
                }
            },
            colors: (function () {
                //Colors listed in order as the appear around pie chart
                var colors = colorArray;

                return colors;
            })(),

            series: [{
                type: 'pie',
                data: seriesData
            }]
        });
    },
    showIncompleteMsg: function (msg) {
        $(document).ajaxComplete(function () {
            $('#divSectionHeaders').html('<br><h2 style="margin-bottom:-40px; padding-left:200px;">' + msg + '</h2>');
            $('.roundtopcorners, #pagefooter').hide();
            $('.AvailableChartMetricsHeader').css('background-color', '#fff');
            $('#divSectionHeaders').show();
            $('.mz').css('border', '#fff solid 0px').css('margin', '5px');
            $('.PageSubtitleTD').html('&nbsp;');
            $('.apMz').hide();
        });
    },
    buildChart: function (ChartData, isFirstTime) {
        if (ChartData == null) {
            return;
        }
        var tbl1 = ChartData[0];
        app.console_log(tbl1);
        if (tbl1 == undefined || tbl1 == 'undefined') {
            tbl1 = ChartData;
        }

        var Is_Grouped_Side_by_Side = tbl1.Is_Grouped_Side_by_Side;
        var Header = tbl1.Header;
        if (Header != null && Header != '') {
            $('#headerTD_' + tbl1.Metric_ID).html(Header);
        }
        else {
            $('#headerTD_' + tbl1.Metric_ID).remove();
        }
        var weHaveAMenuInThisSection = true;
        if ($('#td_' + tbl1.Section_ID).length == 0) weHaveAMenuInThisSection = false;

        var chartContainerID = 'AContent_' + tbl1.Metric_ID;
        var tbl2 = ChartData[1];
        var seriesData = ChartData[2];
        var Is_Hidden = tbl1.Is_Hidden;
        if (Is_Hidden) {
            $('#' + chartContainerID).addClass('Is_Hidden');
        }

        var incompleteArray = [];
        var negative5Array = [];
        $(seriesData).each(function (i, e) {
            incompleteArray.push(e.Incomplete);
            if ((e.data).indexOf(-5) != -1) negative5Array.push(-5);
            if (e.Denominator && app.isSchoolOrDistrictPage == 'd') {
                if (e.Denominator.indexOf(-5) != -1) negative5Array.push(-5);
            }
        });

        if ((incompleteArray.indexOf('B') != -1 || app.profileIncompleteValue == 'B') && app.DistrictStartPageID != app.thisPageId && app.SchoolStartPageID != app.thisPageId) {
            if (!messageIsAlreadyOnPage) {
                app.showIncompleteMsg(app.IncompleteMessages.B.msg);
                messageIsAlreadyOnPage = true;
            }
        }
        else if ((incompleteArray.indexOf('A') != -1 || (incompleteArray.indexOf('C') != -1 && negative5Array.length > 0 && app.isSchoolOrDistrictPage == 'd')) && app.DistrictStartPageID != app.thisPageId && app.SchoolStartPageID != app.thisPageId) {
            if (!messageIsAlreadyOnPage) {
                app.showIncompleteMsg(app.IncompleteMessages.A.msg);
                messageIsAlreadyOnPage = true;
            }
        }
        else {
            if (isFirstTime) chartsData.push(ChartData);
            if (tbl2 && tbl2.length == 0) {
                $('#' + chartContainerID).html('<br /><h1>No Data Available</h1>');
                return;
            }

            var isSideBySide = tbl1.Is_Grouped_Side_by_Side;
            var ChartType = tbl1.ChartType;
            var multiDenominators = tbl1.multiDenominators;
            var stackingType = tbl1.ChartPercentOrRegular;
            var chartTitle = tbl1.ChartTitle;
            var chartSubtitle = tbl1.ChartSubTitle;
            var Is_Stacked = tbl1.Is_Stacked;

            var chartCategories = [];
            $(tbl2).each(function (i, e) {
                chartCategories.push(e.ChartCategories);
            });

            //    ********************      Issue 124 requested that we remove this.   ********************
            //        var weHaveChartData = false;
            //        $(seriesData).each(function (i, e) {
            //            if (e.data.length > 0) {
            //                $(eval(e.data)).each(function (i, e) {
            //                    if (parseFloat(e) > 0) {
            //                        weHaveChartData = true;
            //                        return false;
            //                    }
            //                });
            //            }
            //        });
            //        if (weHaveChartData == false) {
            //            $('#' + chartContainerID).html('<div class="noPieChartValues"><span class="noPieChartValuesTitle">' + chartTitle + ' ' + chartSubtitle + '</span> has no values to display.</div>');
            //            return;
            //        }
            var marginTop = 30;
            //        if ($.browser.msie == true && ($.browser.version).indexOf('7') != -1) {
            //            marginTop = marginTop * .9;

            //        }

            if (ChartType != 'pie') {
                if (ChartType == 'bar_special') {
                    seriesData = app.getJSONFromName_DataArray(seriesData, 'bs'); // to account for the special denominators
                    ChartType = 'bar';
                }
                else if (multiDenominators == 'true') {
                    seriesData = app.getJSONFromName_DataArray(seriesData, 'bs'); // to account for the special denominators
                }
                else {
                    seriesData = app.getJSONFromName_DataArray(seriesData, 'c');
                }
            }
            else {
                //seriesData = eval(JSON.stringify(seriesData).replace(/"name"/g, "name").replace(/"data"/g, "data").replace(/\"\[/g, '[').replace(/\]\"/g, ']').replace(/\"/g, '\''));
                var s = JSON.stringify(seriesData).replace(/\"\[/g, '[').replace(/\]\"/g, ']').replace(/\\/g, '');
                seriesData = eval(s);

            }
            var sumArray = seriesData.SumArray;
            delete seriesData.SumArray;
            var chartYAxesTitle = stackingType == 'percent' || stackingType == 'count_as_percent' ? 'Percentage' : 'Count';

            $.each(seriesData, function (i, v) {
                var seriesName = seriesData[i].name;
                //seriesName = $.trim(seriesName);
                if (app.chartColors[seriesName]) {
                    seriesData[i].color = app.chartColors[seriesName].color;
                }
            });
            //app.console_log(seriesData);
            var wdt = app.getChartWidths(Is_Grouped_Side_by_Side, weHaveAMenuInThisSection)
            var ChartVariable = new Highcharts.Chart({
                chart: {
                    renderTo: chartContainerID,
                    defaultSeriesType: ChartType,
                    width: wdt,
                    backgroundColor: '#ffffff',
                    borderColor: '#ffffff',
                    marginTop: marginTop,
                    paddingLeft: 0,
                    marginRight: 12
                },
                credits: {
                    enabled: false
                },
                exporting: {
                    enabled: false
                },
                title: {
                    text: chartTitle,
                    align: 'left',
                    x: 50,
                    y: 5
                },
                subtitle: {
                    text: chartSubtitle,
                    align: 'left',
                    x: 50,
                    y: 23,
                    style: {
                        fontSize: '10px'
                    }
                },
                xAxis: {
                    categories: chartCategories
                },
                legend: {
                    borderWidth: 1,
                    borderRadius: 5
                },
                yAxis: {
                    minRange: 0.05,
                    min: 0,
                    //max: 100, //stackingType == 'percent' ? 110 : 100, // CRD-291 numbers above each bar
                    //max: stackingType == 'percent' ? 100 : null,
                    endOnTick: true,
                    ceiling: stackingType == 'percent' || stackingType == 'count_as_percent' ? 100 : null,
                    title: {
                        text: chartYAxesTitle
                    }
                    , stackLabels: {
                        enabled: true,
                        formatter: function () {
                            return sumArray[this.x] < 0 ? 'n=-' : sumArray[this.x] == 0 ? 'n=0' : 'n=' + app.formatWithCommas(sumArray[this.x]);
                        },
                        style: {
                            color: 'black',
                            "visibility": "visible",
                            font: 'italic 10px Verdana, sans-serif'
                        }
                        , verticalAlign: 'top'
                        , y: -10
                    }
                    , labels: {
                        // CRD-214 IE9 Misformatting some data at ED
                        // reduce label precision to 2 decimals if value is very small.
                        formatter: function () {
                            if (this.value < 1 && this.value > 0) {
                                return parseFloat(this.value.toFixed(2)).toString();
                            }
                            return this.value;
                        }
                    }
                },
                tooltip: {
                    formatter: function () {
                        //var pctOrCnt = stackingType == 'percent' && IsViewingPercentages == true ? '%' : ' #'; I changed this because the IsViewingPercentages threw it off with the 2013 changes
                        var pctOrCnt = stackingType == 'percent' || IsViewingPercentages == true ? '%' : ' #';

                        //if(Is_Stacked == true) return '<center>' + (this.point.stackTotal).toFixed(0) + ' total students<br>' + this.y + ' - ' + this.series.name + ' students<br> ' + Math.round(this.percentage) + pctOrCnt + ' - ' + this.x + '</center>';
                        //else return '<center>' + this.y + pctOrCnt + ' ' + this.series.name + ' students</center>';

                        return '<center>' + this.y + pctOrCnt + ' ' + this.series.name + '</center>';
                    }
                },
                plotOptions: {
                    series: {
                        //stacking: 'normal'
                        //stacking: 'percent'
                        stacking: Is_Stacked == true ? stackingType : false,
                        column: {
                            pointPadding: 0.2,
                            borderWidth: 0
                        }
                    },
                    bar: {
                        //                    pointPadding: 0,
                        //                    pointWidth: 10,
                        dataLabels: {
                            enabled: Is_Stacked == true ? false : true,
                            rotation: 0,
                            color: '#000000',
                            align: 'left',
                            x: Is_Stacked == true ? -30 : +5,
                            y: Is_Stacked == true ? 0 : 0,
                            formatter: function () {
                                var tVal = (this.y).toFixed(1);
                                if (stackingType == 'percent') {
                                    tVal = tVal + '%';
                                }
                                return tVal;
                            },
                            style: {
                                font: 'normal 10px Verdana, sans-serif'
                            }

                        }
                    },
                    column: {
                        pointPadding: 0,
                        pointWidth: 45,
                        dataLabels: {
                            enabled: true, //Is_Stacked == true ? false : true,
                            //rotation: Is_Stacked == true ? 0 : 0,
                            color: '#000000',
                            align: 'center',
                            padding: 0,
                            crop: false,
                            overflow: "none",
                            //x: Is_Stacked == true ? 0 : 5,
                            //y: 20,
                            //pointPadding: 0,
                            //pointWidth: 10,
                            formatter: function () {
                                var tVal = (this.y).toFixed(1);
                                var tot = '';
                                if (stackingType == 'percent' || Is_Stacked == true) {
                                    if (Is_Stacked == false) {
                                        try {
                                            if (sumArray[this.point.x] != undefined) {
                                                tot = sumArray[this.point.x] < 0 ? '<span style="font-style:italic; font-size:10px;">n=-</span><br><br>' : sumArray[this.point.x] == 0 ? '<span style="font-style:italic; font-size:10px;">n=0</span><br><br>' : '<span style="font-style:italic; font-size:10px;">n=' + app.formatWithCommas(sumArray[this.point.x]) + '</span><br><br>';
                                            }
                                        } catch (e) { }

                                    }
                                    if (tVal > 5 || Is_Stacked == false) {
                                        tVal = tVal < 1 ? tot : tot + tVal + '%';
                                    } else {
                                        tVal = '';
                                    }
                                }
                                return tVal;
                            },
                            style: {
                                font: 'normal 10px Verdana, sans-serif',
                                'font-size': '11px'
                            }
                            , verticalAlign: 'middle'
                            , y: Is_Stacked == true ? 0 : -10
                        }

                    },
                    line: {
                        dataLabels: {
                            enabled: Is_Stacked == true ? false : true,
                            rotation: 0,
                            color: '#000000',
                            align: 'center',
                            x: 0,
                            y: -5,
                            formatter: function () {
                                var tVal = (this.y).toFixed(1);
                                if (stackingType == 'percent') tVal = tVal + '%';
                                return tVal;
                            },
                            style: {
                                font: 'normal 10px Verdana, sans-serif'
                            }
                        }
                    }
                },
                series: seriesData
            });
        }
    },
    convertChartsToTables: function (isFromConvertDefaultToCounts) {
        var TableDataAll = null;
        if (chartsData.length > 0) {
            TableDataAll = eval(chartsData);
        }
        else if (tablesData.length) {
            TableDataAll = eval(tablesData);
        }
        var MetricsCount = PageInfo.Table[0].MetricsCount; // the total number of metrics we expect on this page
        var MetricsLoaded = TableDataAll.length; // the number of metrics that have already been loaded to this point
        // app.console_log(chartsData)
        if (TableDataAll == null || (isFromConvertDefaultToCounts == true && MetricsLoaded < MetricsCount)) {
            if (isFromConvertDefaultToCounts == true) {
                repeaterCounter += 1;
                if (repeaterCounter == 30) { // we've been waiting 30 seconds. time to give up and stop this process.
                    repeaterCounter = 0;
                    return;
                }
                app.setDefaultToCount(); // if all the metrics aren't on the page yet then we go back, wait 1 second and try again.
            }
            else {
                return;
            }
        }
        else {
            repeaterCounter = 0;
            if (isFromConvertDefaultToCounts) {
                IsViewingPercentages = ViewingPercentageSetByButton === false ? app.requestQuerystring('pc') == 'p' ? true : false : IsViewingPercentages;
                IsViewingCharts = false;
                printChartOrTable = 't';
                $('.Is_Hidden').show();
                areWePrinting = app.weArePrinting();
                if (areWePrinting == false) {
                    $('#btnPercentages').button({ label: 'View Data as Percentages' }).show();
                    $('#btnChartsToTable').button({ label: 'Table &#9654; Charts' });
                }
                else {
                    $('#btnPercentages').hide();
                    $('#btnChartsToTable').hide();
                }
            }

            var ctr = 0;
            $(TableDataAll).each(function (i, TableData) {
                ctr += 1;
                app.buildTable(TableData);
                if (ctr == MetricsLoaded) WeAreReadyToPrint = true;
            });
        }
    },
    convertTablesBackToCharts: function () {
        var TableDataAll = eval(chartsData);
        if (TableDataAll == null) {
            return;
        }
        $(TableDataAll).each(function (i, TableData) {
            app.buildChart(TableData)
        });
    },
    toggleTablesPercentages: function () {
        var TableDataAll = eval(tablesData);
        if (TableDataAll == null) {
            return;
        }
        $(TableDataAll).each(function (i, TableData) {
            app.buildTable(TableData)
        });
    },
    calculateByRowTitleColumnTitle: function (rowTitle, columnTitle) {
        if (isViewingSuppressed === false || eval(surveyYearKey) < 6) return false; // if the user is viewing the data unsuppressed or the survey year key is less than 6 (2011) then we don't worry about  this
        else if (rowTitle.indexOf('Disabilities (IDEA)') != -1 && columnTitle.indexOf('Enrollment') != -1) {
            //console.log(rowTitle + ' - ' + columnTitle);
            return true;
        }
        else if (columnTitle.indexOf('Disabilities (IDEA)') != -1 && rowTitle.indexOf('Enrollment') != -1) {
            //console.log(rowTitle + ' - ' + columnTitle);
            return true;
        }
        else {
            return false;
        }
    },
    calculateNegativeNumber: function (v, suppressionMethod, isPct) {
        if (suppressionMethod == '2' && eval(v) == 0 && isViewingSuppressed === true) {
            // for a IDEA suppressed value of 0 display <=2 or 0%
            if (isPct == true) return '0.0';
            else return '<=2';
        }
        else if (v < 0) {
            if (isPct == true) return '0.0';
            else if (v == -9) return '0';
            else if (v == -8) return '-';
            else if (v == -7) return '*';
            else return '';
        }
        else if (isNaN(v)) return v;
        else if (eval(v) >= 0) {
            if (isPct) {
                return app.formatPct(v);
            }
            return app.formatWithCommas(v);
        }
        else if (eval(v) === 0) {
            if (isPct) {
                return '0.0';
            }
            return '0';
        }
        else return '';
    },
    buildTable: function (TableData, isFirstTime) {
        //app.console_log(TableData)

        if (TableData == null) {
            return;
        }
        var tbl1 = TableData[0];
        var TableContainerID = 'AContent_' + tbl1.Metric_ID;            // wrapping <div>
        var tbl2 = TableData[1];
        if (tbl2 && tbl2.length == 0) {
            $('#' + TableContainerID).html('<br /><h1>No Data Available</h1>');
            return;
        }

        var seriesData;
        if (isFirstTime) {
            tablesData.push(TableData);
        }
        var TableCategories = [];
        seriesData = TableData[2];
        //app.console_log(seriesData);
        var incompleteArray = [];
        var isFromMiscTblArray = [];
        $(seriesData).each(function (i, e) {
            incompleteArray.push(e.Incomplete);
            isFromMiscTblArray.push(e.Is_Data_In_Misc_Table);
        });
        var html = [];
        var table = $('<table class="tblMetrics" cellspacing="0" cellpadding="0">');
        html.push('<table class="tblMetrics" cellspacing="0" cellpadding="0">');
        var thisLEAID = '';

        //        /*This has now been resolved, so this comment is no longer necessary.  I've left it in in case we need it in the future. */
        //        if (ProfileData.Table[0].LEAID != undefined && ProfileData.Table[0].LEAID != null && ProfileData.Table[0].LEAID != '') {
        //            var lea_ID = ProfileData.Table[0].LEAID;
        //            if (lea_ID == '3702970') {
        //                thisLEAID = $('<tr><td><span style="font-size:small; font-style:italic">*These data are under review.  Please contact <span style="cursor:pointer; color:Blue" onclick="parent.location=\'mailto:ocrdata@ed.gov\'">ocrdata@ed.gov</span> for more information.</span></td></tr>');
        //                thisLEAID.appendTo(table);
        //            }
        //        }

        var tbody = $('<tbody class="tblAltRows">');
        var thead = $('<thead class="tblMetricsHead">');

        var TableContainer = 'AContent_' + tbl1.Metric_ID;
        //app.console_log(isFromMiscTblArray);
        //app.console_log(isFromMiscTblArray.indexOf(true));

        // if the Incomplete array contains an Incomplete value of 'B' and this is not a summary of select facts page, and this is NOT data from the r_misc table...
        if ((incompleteArray.indexOf('B') != -1 && app.DistrictStartPageID != app.thisPageId && app.SchoolStartPageID != app.thisPageId && isFromMiscTblArray.indexOf(true) == -1) || (app.profileIncompleteValue == 'B' && app.DistrictStartPageID != app.thisPageId && app.SchoolStartPageID != app.thisPageId)) {
            if (!messageIsAlreadyOnPage) {
                app.showIncompleteMsg(app.IncompleteMessages.B.msg);
                messageIsAlreadyOnPage = true;
            }
        }
        else if (incompleteArray.indexOf('A') != -1 && app.DistrictStartPageID != app.thisPageId && app.SchoolStartPageID != app.thisPageId && isFromMiscTblArray.indexOf(true) == -1) {
            if (!messageIsAlreadyOnPage) {
                app.showIncompleteMsg(app.IncompleteMessages.A.msg);
                messageIsAlreadyOnPage = true;
            }
        }
        else {

            var TablePercentOrRegular = tbl1.ChartPercentOrRegular;
            if ((IsViewingPercentages == false && ViewingPercentageSetByButton == true) || (printPercentOrCount == 'c' && app.weArePrinting())) {
                TablePercentOrRegular = 'normal';
            }
            else if ((IsViewingPercentages == true && ViewingPercentageSetByButton == true) || (printPercentOrCount == 'p' && app.weArePrinting())) {
                TablePercentOrRegular = 'percent';
                IsViewingPercentages = true;
            }

            //      This section was commented out after we removed the R_Metrics.Title and Subtitles per client request.  I then changed the <TD> below to a <TH> for 508 compliance.

            //        $('<tr><td colspan="10"><hr /></td></tr><tr style="width:100%"><th colspan="10">' + tbl1.ChartTitle + '</th></tr>').appendTo(thead);
            //        if (tbl1.ChartSubTitle != null && tbl1.ChartSubTitle != '') {
            //            $('<tr style="width:100%"><td colspan="10">' + tbl1.ChartSubTitle + '</td></tr>').appendTo(thead);
            //        }

            $('<tr><th colspan="10"><hr /></th></tr>').appendTo(thead);
            $(thead).appendTo(table);

            html.push('<thead class="tblMetricsHead">');
            html.push('<tr><th colspan="10"><hr /></th></tr>');
            html.push('</thead>');


            var tr = $('<tr class="tblMetricsHeaderRow">');
            var chartTitle = app.isNullOrEmpty(tbl1.ChartTitle) ? '&nbsp;' : tbl1.ChartTitle;
            $('<th>' + chartTitle + '</th>').appendTo(tr);

            html.push('<tbody>');
            html.push('<tr class="tblMetricsHeaderRow">');
            html.push('<th>' + chartTitle + '</th>');

            var series_D;
            if (TablePercentOrRegular == 'data chart type') {
                //app.console_log('data');
                series_D = eval(JSON.stringify(seriesData).replace(/"name"/g, "name").replace(/"data"/g, "data").replace(/\"\[/g, '"').replace(/\]\"/g, '"').replace(/\"/g, '\''));
            }
            else {
                if (tbl1.ChartType == 'bar_special' || tbl1.multiDenominators == 'true') {
                    // app.console_log('bar_special - multiDenominators chart type -' + TablePercentOrRegular);
                    series_D = app.getJSONFromName_DataArray(seriesData, 'bs', TablePercentOrRegular);
                }
                else {
                    //app.console_log('other chart type -' + TablePercentOrRegular);
                    series_D = app.getJSONFromName_DataArray(seriesData, 't', TablePercentOrRegular);
                }
            }
            //app.console_log(series_D);
            var columnCount = tbl2.length; // bar_special tables need to be reorientated
            //if (columnCount >= 2 && tbl1.ChartType == 'bar_special') { // This addresses CRD-20
            if (columnCount >= 1 && tbl1.ChartType == 'bar_special') { // This addresses CRD-20
                var rowCount = columnCount;
                var tableRowHeaders = [];
                $(tbl2).each(function (i, e) {
                    tableRowHeaders.push(e.ChartCategories);
                });

                $(series_D).each(function (i, e) {
                    TableCategories.push(e.name);
                });
                $(TableCategories).each(function (n, v) {
                    $('<th>' + v + '</th>').appendTo(tr);
                    html.push('<th>' + v + '</th>');
                });
                columnCount = TableCategories.length;
                $(tr).appendTo(table);
                html.push('</tr>');
                html.push('</tbody>');
                html.push('<tbody class="tblAltRows">');
                // fill out columns
                var hin = [];
                $(tableRowHeaders).each(function (n, thContent) {
                    var tr = $('<tr>');
                    $('<th class="dynamicTableTH">' + thContent.replace(/\s\s+/g, ' ').trim() + '</th>').appendTo(tr);
                    hin.push('<tr>');
                    hin.push('<th class="dynamicTableTH">' + thContent.replace(/\s\s+/g, ' ').trim() + '</th>');

                    for (ii = 0; ii < columnCount; ii++) {
                        var columnHeader = TableCategories[ii];
                        var vv = series_D[ii].data[n];
                        var supMethod = series_D[ii].Suppression_Method[n];
                        var columnLen = 4;
                        vv = vv == undefined ? '--' : vv.toString();
                        columnLen = vv.length + 1;
                        var leftOrRight = 'Left';
                        if (isNaN(vv) == false) {
                            leftOrRight = 'Right';
                        }
                        else {
                            leftOrRight = 'Left';
                        }
                        var vvv;
                        if (isNaN(vv)) {
                            vvv = vv;
                        }
                        else if (parseInt(vv) < 0 || supMethod != null) {
                            if (TablePercentOrRegular == 'percent') {
                                vvv = app.calculateNegativeNumber(vv, supMethod, true) + ' %';
                                leftOrRight = "right";
                            }
                            else {
                                vvv = app.calculateNegativeNumber(vv, supMethod, false);
                                if (vvv != '<=2') {
                                    vvv = app.formatWithCommas(app.calculateNegativeNumber(vv, supMethod, false));
                                }
                                leftOrRight = "center";
                            }
                        }
                        else {
                            vvv = TablePercentOrRegular == 'percent' ? app.formatPct(vv) + ' %' : app.formatWithCommas(vv);
                        }
                        $('<td nowrap="nowrap" class="dynamicTableTD" style="text-align:' + leftOrRight + ';">' + vvv + '</td>').appendTo(tr);
                        hin.push('<td nowrap="nowrap" class="dynamicTableTD" style="text-align:' + leftOrRight + ';">' + vvv + '</td>');
                    }
                    $(tr).appendTo(tbody);
                    // close row
                    hin.push('</tr>');
                });
                html.push(hin.join(''));
                $(tbody).appendTo(table);
                html.push('</tbody>');

                $('<tfoot class="tblMetricsFoot"><tr style="width:100%"><td colspan="' + columnCount + 1 + '"><hr></td></tr><tr><td colspan="' + columnCount + 1 + '">&nbsp;</td></tr></tfoot>').appendTo(table);
                html.push('<tfoot class="tblMetricsFoot"><tr style="width:100%"><td colspan="' + columnCount + 1 + '"><hr></td></tr><tr><td colspan="' + columnCount + 1 + '">&nbsp;</td></tr></tfoot>');

            }
            else { //regular table construction
                $(tbl2).each(function (i, e) {
                    TableCategories.push(e.ChartCategories);
                });

                $(TableCategories).each(function (n, v) {
                    $('<th>' + v + '</th>').appendTo(tr);
                    html.push('<th>' + v + '</th>');
                });
                $(tr).appendTo(table);
                html.push('</tr>');
                html.push('</tbody>');
                html.push('<tbody class="tblAltRows">');
                var columnLen;
                // fill out columns
                var hin = [];
                $(series_D).each(function (n, v) {
                    var columnHeader = TableCategories[n];
                    var incomplete = v.Incomplete;
                    var tr = $('<tr>');
                    hin.push('<tr>');

                    var thContent = v.name;
                    var thColumn = $('<th class="dynamicTableTH">' + thContent.replace(/\s\s+/g, ' ').trim() + '</th>');
                    $(thColumn).appendTo(tr);
                    columnLen = $(v.data).length + 1;

                    if (columnLen == 1) {
                        //app.console_log('columnLen=1');
                        hin.push('<th class="dynamicTableTH" style="width:90%;">' + thContent.replace(/\s\s+/g, ' ').trim() + '</th>');
                        $(thColumn).css('width', '90%');
                        var vv = v.data.toString();
                        if ((incomplete == 'A' || incomplete == 'C') && (parseInt(vv) < 0 || vv == '')) {
                            //app.console_log('blank');
                            $('<td class="dynamicTableTD"></td>').appendTo(tr);
                            hin.push('<td class="dynamicTableTD"></td>');

                        }
                        else {
                            var fteVal = vv; // used on one special occasion to show the "Total FTE of Classroom Teachers" value as it comes from the db
                            var supMethod = series_D[n].Suppression_Method[n];
                            var leftOrRight = 'Left';
                            if (isNaN(vv) == false && vv != '') {
                                if (TablePercentOrRegular == 'normal' || TablePercentOrRegular == 'data') {
                                    if (isNaN(vv)) {
                                        leftOrRight = 'Left';
                                    }
                                    else {
                                        //vv = parseFloat(vv);
                                        leftOrRight = 'Right';
                                    }
                                }
                            }
                            //app.console_log(TablePercentOrRegular);
                            if (TablePercentOrRegular == 'hidden') {
                                $('<td style="display:none;"></td>').appendTo(tr);
                                hin.push('<td style="display:none;"></td>');
                            }
                            else if (TablePercentOrRegular == 'data' || thContent.indexOf('Ratio') != -1) {
                                $('<td nowrap="nowrap" class="dynamicTableTD OneColumn" style="width:20%; padding-left:10px; text-align:' + leftOrRight + ';">' + vv + ' </td>').appendTo(tr);
                                hin.push('<td nowrap="nowrap" class="dynamicTableTD OneColumn" style="width:20%; padding-left:10px; text-align:' + leftOrRight + ';">' + vv + ' </td>');

                            }
                            else if (TablePercentOrRegular == 'dollars' || thContent.indexOf('$') != -1 || thContent.indexOf('Salary Expend') != -1) {
                                if (app.isNullOrEmpty(vv)) vvv = '';
                                else vvv = app.formatCurrency(vv);
                                $('<td nowrap="nowrap" class="dynamicTableTD OneColumn" style="text-align:right;">' + vvv + ' </td>').appendTo(tr);
                                hin.push('<td nowrap="nowrap" class="dynamicTableTD OneColumn" style="text-align:right;">' + vvv + ' </td>');

                            }
                            else if (TablePercentOrRegular == 'boolean') {
                                if (app.isNullOrEmpty(vv)) vvv = '';
                                else vvv = app.formatBoolean(vv);
                                $('<td nowrap="nowrap" class="dynamicTableTD OneColumn" style="text-align:center;">' + vvv + ' </td>').appendTo(tr);
                                hin.push('<td nowrap="nowrap" class="dynamicTableTD OneColumn" style="text-align:center;">' + vvv + ' </td>');

                            }
                            else if ((thContent.indexOf('%') != -1 || TablePercentOrRegular == 'percent' || TablePercentOrRegular == 'count_as_percent') && IsViewingPercentages == true) {
                                var vvv;
                                if (vv < 0) vvv = app.calculateNegativeNumber(vv, supMethod, true);
                                else {
                                    //if (parseFloat(vv) <= 1) vv = parseFloat(vv) * 100;
                                    vvv = app.formatPct(vv);
                                }
                                $('<td nowrap="nowrap" class="dynamicTableTD OneColumn" style="text-align:right;">' + vvv + ' %</td>').appendTo(tr);
                                hin.push('<td nowrap="nowrap" class="dynamicTableTD OneColumn" style="text-align:right;">' + vvv + ' %</td>');

                            }
                            else if (thContent.indexOf('Total FTE') != -1) {
                                try { fteVal = app.formatWithCommasAndDecimals(fteVal) } catch (e) { }
                                $('<td nowrap="nowrap" class="dynamicTableTD OneColumn" style="text-align:right;">' + fteVal + ' </td>').appendTo(tr);
                                hin.push('<td nowrap="nowrap" class="dynamicTableTD OneColumn" style="text-align:right;">' + fteVal + ' </td>');

                            }
                            else {
                                var vvv;
                                if (vv < 0 || supMethod != null) vvv = app.calculateNegativeNumber(vv, supMethod, false);
                                else {
                                    vvv = app.formatWithCommas(vv);
                                    $('<td nowrap="nowrap" class="dynamicTableTD OneColumn" style="text-align:' + leftOrRight + ';">' + vvv + '</td>').appendTo(tr);
                                    hin.push('<td nowrap="nowrap" class="dynamicTableTD OneColumn" style="text-align:' + leftOrRight + ';">' + vvv + '</td>');
                                }
                            }
                        }
                    }

                    else {
                        //app.console_log(thContent);
                        hin.push('<th class="dynamicTableTH">' + thContent.replace(/\s\s+/g, ' ').trim() + '</th>');
                        $(v.data).each(function (ii, vv) {
                            var columnHeader = TableCategories[ii];
                            vv = vv == undefined ? '--' : vv.toString();
                            if ((incomplete == 'A' || incomplete == 'C') && (parseInt(vv) < 0 || vv == '' || vv == '--')) {
                                $('<td class="dynamicTableTD">&nbsp;</td>').appendTo(tr);
                                hin.push('<td class="dynamicTableTD">&nbsp;</td>');
                            }
                            else {
                                var fteVal = vv; // used on one special occasion to show the "Total FTE of Classroom Teachers" value as it comes from the db
                                var supMethod = series_D[n].Suppression_Method[ii];
                                var leftOrRight = 'Left';
                                if (isNaN(vv) == false) {
                                    if (TablePercentOrRegular == 'normal') {
                                        if (isNaN(vv)) {
                                            leftOrRight = 'Left';
                                        }
                                        else {
                                            //vv = parseFloat(vv);
                                            leftOrRight = 'Right';
                                        }
                                    }
                                }
                                var isRatio = thContent.indexOf('Ratio') != -1 ? true : false;
                                var toOne = isRatio ? ' : 1' : '';
                                //app.console_log(TablePercentOrRegular + ' - ' + isRatio + '-' + thContent + ' - ' + IsViewingPercentages)

                                if (TablePercentOrRegular == 'hidden') {
                                    $('<td style="display:none;"></td>').appendTo(tr);
                                    hin.push('<td style="display:none;"></td>');

                                    //app.console_log('1, v=""');
                                }
                                else if ((TablePercentOrRegular == 'data' || isRatio) && thContent.indexOf('%') == -1) {
                                    var rv = '';
                                    var l_r = 'right';
                                    var w = '';
                                    if (isNaN(vv)) {
                                        rv = vv;
                                        l_r = 'left';
                                        w = 'width:5%;padding-left:3px;padding-right:3px;';
                                    }
                                    else if (vv > 0 && toOne != '') {
                                        rv = vv + toOne;
                                    }
                                    else if (vv >= 0) {
                                        rv = app.calculateNegativeNumber(vv, supMethod, true);

                                    }
                                    else if (vv < 0) {
                                        rv = app.calculateNegativeNumber(vv, supMethod, true);
                                    }
                                    //app.console_log('3, v=' + rv);
                                    $('<td nowrap="nowrap" class="dynamicTableTD" style="text-align:' + l_r + ';' + w + '">' + rv + ' </td>').appendTo(tr);
                                    hin.push('<td nowrap="nowrap" class="dynamicTableTD" style="text-align:' + l_r + ';' + w + '">' + rv + ' </td>');

                                }
                                else if (TablePercentOrRegular == 'dollars' || thContent.indexOf('$') != -1 || thContent.indexOf('Salary Expend') != -1) {
                                    if (app.isNullOrEmpty(vv)) vvv = ''
                                    else vvv = app.formatCurrency(vv);
                                    //app.console_log('4, v=' + vvv);
                                    $('<td nowrap="nowrap" class="dynamicTableTD" style="text-align:right;">' + vvv + ' </td>').appendTo(tr);
                                    hin.push('<td nowrap="nowrap" class="dynamicTableTD" style="text-align:right;">' + vvv + ' </td>');

                                }
                                else if (TablePercentOrRegular == 'boolean') {
                                    if (app.isNullOrEmpty(vv)) vvv = ''
                                    else vvv = app.formatBoolean(vv);
                                    //app.console_log('4, v=' + vvv);
                                    $('<td nowrap="nowrap" class="dynamicTableTD" style="text-align:center;">' + vvv + ' </td>').appendTo(tr);
                                    hin.push('<td nowrap="nowrap" class="dynamicTableTD" style="text-align:center;">' + vvv + ' </td>');

                                }
                                //else if ((thContent.indexOf('%') != -1 || TablePercentOrRegular == 'percent' || TablePercentOrRegular == 'count_as_percent') && IsViewingPercentages == true) {
                                else if ((thContent.indexOf('%') != -1 || TablePercentOrRegular == 'percent' || TablePercentOrRegular == 'count_as_percent')) {
                                    var vvv;
                                    //if (vv < 0) vvv = app.formatPct(0);
                                    if (vv < 0) vvv = app.calculateNegativeNumber(vv, supMethod, true);
                                    else {
                                        //if (parseFloat(vv) <= 1) vv = parseFloat(vv) * 100;
                                        vvv = app.formatPct(vv);
                                    }
                                    //app.console_log('5, v=' + vvv);
                                    vvv = app.isNullOrEmpty(vvv) == true ? '&nbsp;' : vvv + ' %';
                                    $('<td nowrap="nowrap" class="dynamicTableTD" style="text-align:right;">' + vvv + '</td>').appendTo(tr);
                                    hin.push('<td nowrap="nowrap" class="dynamicTableTD" style="text-align:right;">' + vvv + '</td>');
                                }
                                else if ((thContent.indexOf('10 days of the School Year (FTE)') != -1 || thContent.indexOf('Year of Teaching (FTE)') != -1 || thContent.indexOf('Certification Requirements (FTE)') != -1)) {
                                    var vvv;
                                    //if (vv < 0) vvv = app.formatPct(0);
                                    if (vv < 0) vvv = app.calculateNegativeNumber(vv, supMethod, true);
                                    else {
                                        //if (parseFloat(vv) <= 1) vv = parseFloat(vv) * 100;
                                        vvv = app.formatPct(vv);
                                    }
                                    //app.console_log('5, v=' + vvv);
                                    vvv = app.isNullOrEmpty(vvv) == true ? '&nbsp;' : vvv + ' %';
                                    $('<td nowrap="nowrap" class="dynamicTableTD" style="text-align:right;">' + vvv + '</td>').appendTo(tr);
                                    hin.push('<td nowrap="nowrap" class="dynamicTableTD" style="text-align:right;">' + vvv + '</td>');
                                }
                                else if (thContent.indexOf('Total FTE') != -1 || thContent.indexOf('(FTE)') != -1) {
                                    try { fteVal = app.formatWithCommasAndDecimals(fteVal) } catch (e) { }
                                    //app.console_log('2, v=' + fteVal);
                                    $('<td nowrap="nowrap" class="dynamicTableTD" style="text-align:right;">' + fteVal + ' </td>').appendTo(tr);
                                    hin.push('<td nowrap="nowrap" class="dynamicTableTD" style="text-align:right;">' + fteVal + ' </td>');
                                }
                                else {
                                    var vvv;
                                    if (vv < 0 || supMethod != null) vvv = app.calculateNegativeNumber(vv, supMethod, false);
                                    else vvv = app.formatWithCommas(vv);
                                    //app.console_log('6, v=' + vvv);
                                    $('<td nowrap="nowrap" class="dynamicTableTD" style="text-align:' + leftOrRight + ';">' + vvv + '</td>').appendTo(tr);
                                    hin.push('<td nowrap="nowrap" class="dynamicTableTD" style="text-align:' + leftOrRight + ';">' + vvv + '</td>');
                                }
                            }
                        });
                    }
                    // close one column row
                    hin.push('</tr>');
                    $(tr).appendTo(tbody);
                });

                $(tbody).appendTo(table);
                html.push(hin.join(''));
                html.push('</tbody>');

                $('<tfoot class="tblMetricsFoot"><tr style="width:100%"><td colspan="' + columnLen + '"><hr /></td></tr><tr><td colspan="' + columnLen + '">&nbsp;</td></tr></tfoot>').appendTo(table);
                html.push('<tfoot class="tblMetricsFoot"><tr style="width:100%"><td colspan="' + columnLen + '"><hr /></td></tr><tr><td colspan="' + columnLen + '">&nbsp;</td></tr></tfoot>');

            }
            html.push('</table>');
            var t = html.join('');          // generate table
            //$('#' + TableContainer).html(table);
            $('#' + TableContainer).html(t);        // add to <div> container
            $('.tblAltRows tr:even').addClass('even').removeClass('odd');
            $('.tblAltRows tr:odd').addClass('odd').removeClass('even');
        }

    },

    showOnlyTheseGradeLevels: function (gradeLevels) {
        if (gradeLevels == '') return true; // if there are no grades passed then every grade can view this item. showOnlyTheseGradeLevels(
        var json = eval(ProfileData);
        var returnValue = false;
        var gradesOffered = json.Table[0].GradesOffered

        if (gradesOffered != null) {
            var gradesOfferedArray = gradesOffered.toLowerCase().split(',')
            var allowableGrades = gradeLevels.split(',')
            for (var i = 0; i < allowableGrades.length; i++) {

                if (gradesOfferedArray.indexOf(allowableGrades[i]) != -1) {
                    returnValue = true;
                    break;
                }
            }
        }
        return returnValue;
    },
    showOnlyHighSchools: function () {
        var json = eval(ProfileData);
        var returnValue = false;
        var gradesOffered = json.Table[0].GradesOffered

        if (gradesOffered != null) {
            var gradesOfferedArray = gradesOffered.split(',')
            if (gradesOfferedArray.indexOf('9') != -1 || gradesOfferedArray.indexOf('10') != -1 || gradesOfferedArray.indexOf('11') != -1 || gradesOfferedArray.indexOf('12') != -1) {
                returnValue = true;
            }
        }
        return returnValue;
    },
    showOnlyElementarySchools: function () {
        var json = eval(ProfileData);
        var returnValue = false;
        var gradesOffered = json.Table[0].GradesOffered

        if (gradesOffered != null) {
            var gradesOfferedArray = gradesOffered.toLowerCase().split(',')
            var allowableGrades = 'pk,prek,preschool,k,1,2,3,4,5'.split(',')
            for (var i = 0; i < allowableGrades.length; i++) {

                if (gradesOfferedArray.indexOf(allowableGrades[i]) != -1) {
                    returnValue = true;
                    break;
                }
            }
        }
        return returnValue;
    },
    showOnlyMiddleSchools: function () {
        var json = eval(ProfileData);
        var returnValue = false;
        var gradesOffered = json.Table[0].GradesOffered

        if (gradesOffered != null) {
            var gradesOfferedArray = gradesOffered.split(',')
            var allowableGrades = '6,7,8'.split(',')
            for (var i = 0; i < allowableGrades.length; i++) {
                if (gradesOfferedArray.indexOf(allowableGrades[i]) != -1) {
                    returnValue = true;
                    break;
                }
            }
        }
        return returnValue;
    },
    showOnlyMiddleSchoolsAndHighSchools: function () {
        var json = eval(ProfileData);
        var returnValue = false;
        var gradesOffered = json.Table[0].GradesOffered

        if (gradesOffered != null) {
            var gradesOfferedArray = gradesOffered.split(',')
            var allowableGrades = '6,7,8,9,10,11,12'.split(',')
            for (var i = 0; i < allowableGrades.length; i++) {
                if (gradesOfferedArray.indexOf(allowableGrades[i]) != -1) {
                    returnValue = true;
                    break;
                }
            }
        }
        return returnValue;
    },

    showGradeSchoolsAndMiddleSchools: function () {
        var json = eval(ProfileData);
        var returnValue = false;
        var gradesOffered = json.Table[0].GradesOffered

        if (gradesOffered != null) {
            var gradesOfferedArray = gradesOffered.split(',')
            var allowableGrades = 'pk,prek,preschool,k,1,2,3,4,5,6,7,8'.split(',')
            for (var i = 0; i < allowableGrades.length; i++) {
                if (gradesOfferedArray.indexOf(allowableGrades[i]) != -1) {
                    returnValue = true;
                    break;
                }
            }
        }
        return returnValue;
    },
    /*
    *****************************************   placeDataInMetrics renamed 
    */
    placeDataInMetrics: function (Section_ID, Is_Grouped_Side_by_Side, Metric_Count, extraFunction) {
        var showThisSection = true;
        var set_DefaultToCount = false;
        if (extraFunction != null) {
            if (extraFunction.indexOf('setDefaultToCount') != -1) {
                set_DefaultToCount = true;
                extraFunction = extraFunction.replace('setDefaultToCount', '');
            }
            if (extraFunction.indexOf('setPercent') != -1) {
                IsViewingPercentages = true;
                extraFunction = extraFunction.replace('setPercent', '');
            }

            if (extraFunction != '') showThisSection = eval(extraFunction);

        }
        if (showThisSection == false) {// if we passed a function to check weather this is to be shown or not.
            $('#container' + Section_ID).hide();
            return;
        }
        var metricsData;
        var contentTDName = Section_ID; // this is the td that actually holds the chart
        var availableMetricsTbodyID = contentTDName + '_AvailableMetrics'; // this is the tbody where the Available Metrics items list is placed
        var divThatHoldsAllOfThis = 'container' + contentTDName; // this is the ONLY thing the developer needs to do right.

        //GetSectionMetrics
        sUrl = "../../handler/AjaxHandler.ashx?cmd=GetSectionMetrics&Entity_ID=" + entity_id + "&Section_ID=" + Section_ID + '&IsSchoolOrDistrict=' + IsSchoolOrDistrict;
        $.ajax({
            url: sUrl,
            type: "GET",
            processData: false,
            //contentType: "application/json",
            dataType: "json",
            async: true,
            success: function (returnedData) {
                if (returnedData == null) return;
                if (Is_Grouped_Side_by_Side == true) {
                    // build template html manually
                    var html = [];
                    var t;
                    html.push('<table style="width: 684px">');
                    if (Metric_Count == 1) {
                        html.push('<tr>');
                        html.push('<td id="headerTD_' + $(returnedData.Table)[0].Metric_ID + '" class="AvailableChartMetricsHeader">');
                        html.push('</td>');
                        html.push('</tr>');     // header closing tag

                        // create row
                        html.push('<tr>');
                        if ($.browser.msie == true && ($.browser.version).indexOf('7') != -1) {
                            html.push('<td class="AvailableChartMetricsTD" id="A1Content_' + $(returnedData.Table)[0].Metric_ID + '" style="width: 100%; text-align:center;">');
                            html.push('<div class="AvailableChartMetricsDiv" id="AContent_' + $(returnedData.Table)[0].Metric_ID + '" style="width: 98%; text-align:center;">');
                            html.push('</div>');
                            html.push('</td>');
                        }
                        else {
                            html.push('<td class="AvailableChartMetricsTD" id="A1Content_' + $(returnedData.Table)[0].Metric_ID + '" style="width: 98%; text-align:center;">');
                            html.push('<div class="AvailableChartMetricsDiv" id="AContent_' + $(returnedData.Table)[0].Metric_ID + '" style="width: 90%; text-align:center;">');
                            html.push('</div>');
                            html.push('</td>');
                        }
                        html.push('</tr>');         // row closing tag
                    }
                    else {
                        var hin = [];                   // inner array
                        for (var i = 0; i < Metric_Count; i++) {
                            var leftLineClass = '';

                            if (i > 0) {
                                leftLineClass = ' lClass';
                            }
                            if (i / 2 == 0) {
                                html.push('<tr>');           // push new row, header
                            }
                            //var headerTD = $('<td id="headerTD_' + $(returnedData.Table)[i].Metric_ID + '" class="AvailableChartMetricsHeader">');
                            html.push('<td id="headerTD_' + $(returnedData.Table)[i].Metric_ID + '" class="AvailableChartMetricsHeader">');
                            if ($.browser.msie === true && ($.browser.version).indexOf('7') !== -1) {
                                hin.push('<td class="AvailableChartMetricsTD" id="A1Content_' + $(returnedData.Table)[i].Metric_ID + '" style="width:49%; text-align:center;">');
                                hin.push('<div class="AvailableChartMetricsDiv ' + leftLineClass + '" id="AContent_' + $(returnedData.Table)[i].Metric_ID + '" style="width: 99%; text-align:center;">');
                                hin.push('</div>');
                                hin.push('</td>');
                            }
                            else {
                                hin.push('<td class="AvailableChartMetricsTD" id="A1Content_' + $(returnedData.Table)[i].Metric_ID + '" style="width: 45%; text-align:center;">');
                                hin.push('<div class="AvailableChartMetricsDiv ' + leftLineClass + '" id="AContent_' + $(returnedData.Table)[i].Metric_ID + '" style="width: 90%; text-align:center;">');
                                hin.push('</div>');
                                hin.push('</td>');
                            }

                            if (i / 2 != 0) {
                                html.push('</tr>')          // close row after even i
                                // push inner array
                                html.push('<tr>');
                                html.push(hin.join(''));
                                html.push('</tr>')          // close row
                                hin = [];
                            }
                        }
                    }
                    html.push('</table>');      // outer table closing tag
                    //$(t).html(html.join(''));
                    t = html.join('');
                    $(t).appendTo('#A_' + Section_ID);

                }
                else {
                    for (var i = 0; i < Metric_Count; i++) {
                        if ($(returnedData.Table)[i] != null && $(returnedData.Table)[i] != undefined)
                            $('<div class="AContent" id="AContent_' + $(returnedData.Table)[i].Metric_ID + '">').appendTo('#A_' + Section_ID);
                    }
                }
                $(returnedData.Table).each(function (i, json) {
                    var tableChartCategories;
                    var tableValues;
                    var firstTable, secondTable;
                    if (i == 0) {
                        tableChartCategories = returnedData.Table1;
                        tableValues = returnedData.Table2;
                    }
                    else if (i == 1) {
                        tableChartCategories = returnedData.Table3;
                        tableValues = returnedData.Table4;
                    }
                    else if (i == 2) {
                        tableChartCategories = returnedData.Table5;
                        tableValues = returnedData.Table6;
                    }
                    else if (i == 3) {
                        tableChartCategories = returnedData.Table7;
                        tableValues = returnedData.Table8;
                    }
                    else if (i == 4) {
                        tableChartCategories = returnedData.Table9;
                        tableValues = returnedData.Table10;
                    }
                    else if (i == 5) {
                        tableChartCategories = returnedData.Table11;
                        tableValues = returnedData.Table12;
                    }
                    else if (i == 6) {
                        tableChartCategories = returnedData.Table13;
                        tableValues = returnedData.Table14;
                    }
                    else if (i == 7) {
                        tableChartCategories = returnedData.Table15;
                        tableValues = returnedData.Table16;
                    }
                    else if (i == 8) {
                        tableChartCategories = returnedData.Table17;
                        tableValues = returnedData.Table18;
                    }
                    else if (i == 9) {
                        tableChartCategories = returnedData.Table19;
                        tableValues = returnedData.Table20;
                    }
                    var fullJSONData = [];
                    //app.console_log(tableValues);
                    if (app.doWeNeedToShowSuppressionMessage == false) {
                        $(tableValues).each(function (supI, supV) {
                            if (supV.Suppression_Method != null) {
                                var usesSuppression = supV.Suppression_Method.toString();
                                if (usesSuppression.indexOf('2') != -1) {
                                    app.doWeNeedToShowSuppressionMessage = true;
                                    app.showSuppressionExplaination(2);
                                    // extend fieldset to fit additional link
                                    $("#fs-top-nav-links").css('width', '150px');
                                    $("#fs-top-nav-links-2").css('width', '150px');
                                    return false;
                                }
                            }
                        });

                    }
                    fullJSONData.push(json);
                    fullJSONData.push(tableChartCategories);
                    fullJSONData.push(tableValues);
                    if (app.DistrictStartPageID != app.thisPageId && app.SchoolStartPageID != app.thisPageId) { // we only want to do the "Incomplete" logic if we're not on the Summery of Select Facts page.
                        $(tableValues).each(function (i, e) {
                            if (e.Incomplete == 'D') {
                                var dMsg = app.IncompleteMessages.D.msg;
                                $('#msgDSpan').html(dMsg);
                                $(app.DataTableSectionInfo).each(function (i, e) {
                                    var sectionTitle = (e.Section_Title).toLowerCase();
                                    var containerId = 'accordian' + e.Section_ID;
                                    if (sectionTitle.indexOf('lep') != -1 || sectionTitle.indexOf('disability') != -1)
                                        $('#' + containerId).hide();
                                });
                            }
                            else if (e.Incomplete == 'C') {
                                var schoolOrDistrict = ''
                                if (app.isSchoolOrDistrictPage == 'd')
                                    schoolOrDistrict = 'district';
                                else
                                    schoolOrDistrict = 'school';
                                var msg = (app.IncompleteMessages.C.msg).replace('<entity>', schoolOrDistrict);
                                $('.spanIncompleteMessage').html(msg);
                            }
                        });
                    }
                    if (tableChartCategories == null || json == null || tableValues == null) return;
                    if (set_DefaultToCount == true) {
                        IsViewingPercentages = ViewingPercentageSetByButton === false ? app.requestQuerystring('pc') == 'p' ? true : false : IsViewingPercentages;
                        IsViewingCharts = false;
                        $('.Is_Hidden').show();
                        areWePrinting = app.weArePrinting();

                        if (areWePrinting == false) {
                            $('#btnPercentages').button({ label: 'View Data as Percentages' }).show();
                            $('#btnChartsToTable').button({ label: 'Table &#9654; Charts' });
                        }
                        else {
                            $('#btnPercentages').hide();
                            $('#btnChartsToTable').hide();
                        }
                        app.buildTable(fullJSONData, true);
                        IsViewingCharts = false;
                        printChartOrTable = 't'
                    }
                    else if (json.ChartOrTable == 'C') {
                        app.buildChart(fullJSONData, true);
                    }
                    else {
                        app.buildTable(fullJSONData, true);

                    }
                });
            },
            complete: function () {
            }
        });
    },
    showSuppressionExplaination: function (supMethod) {
        var isCachedData = false;
        var div = $('<div id="explanationDiv">');

        /* 
        for this to work you have to create a file in the Templates directory and name it 
        SuppressionMethodNNNExplaination.htm where NNN is the value passed in the supMethod parameter.
        For example, at the time of this development there was only one suppression method. It is Suppression Method 2,
        so I created a file in the Templates directory called SuppressionMethod2Explaination.htm. Now when the Suppression Metheo
        is equal to 2 we get that file, put the html in that file into a div, and use the JQuery.dialog to display it's contents.
        */
        $('#spanSuppressionExplaination').click(function () {
            if (isCachedData == false) {
                $.get("../../Templates/SuppressionMethod" + supMethod + "Explaination.htm", function (data) { // get the correct template
                    isCachedData = true; // so next time we don't have to get the template
                    // create a div to use as our dialog popup
                    $(div).html(data); // populate the div with the contents of the template
                    var popupTitle = '';
                    if (supMethod == '2') popupTitle = 'What Does Zero Mean? Rounding to Protect Privacy';
                    $(div).dialog({ // create and open a dialog popup.
                        width: 250,
                        title: popupTitle,
                        buttons: {
                            Close: function () {
                                $(this).dialog('close');
                            }
                        },
                        position: [700, 250],
                        open: function () {
                            $('.ui-dialog-titlebar-close').remove();
                        }
                    });
                });
            }
            else {
                $(div).dialog({ // create and open a dialog popup.
                    width: 250,
                    buttons: {
                        Close: function () {
                            $(this).dialog('close');
                        }
                    },
                    position: [700, 250],
                    open: function () {
                        $('.ui-dialog-titlebar-close').remove();
                    }
                });
            }

        }).show(); // show the "What Does Zero Mean? Rounding to Protect Privacy" link
    },
    // this automatically builds a chart based on the data in the HTML table
    buildChartFromTableContent: function (chartContainer) {
        var doWeHaveChartableData = false;
        var table = document.getElementById('tbl_' + chartContainer),
			options = {
			    chart: {
			        renderTo: 'div_' + chartContainer,
			        defaultSeriesType: 'column',
			        width: app.getChartWidths()
			    },
			    credits: {
			        enabled: false
			    },
			    title: {
			        text: 'Metrics Chart'
			    },
			    xAxis: {
			    },
			    yAxis: {
			        ceiling: 100,
			        title: {
			            text: 'Percentage'
			        }
			    },
			    tooltip: {
			        formatter: function () {
			            return '<b>' + this.series.name + '</b><br/>' + this.y + ' ' + this.x.toLowerCase();
			        }
			    }
			};

        // the categories
        options.xAxis.categories = [];
        $('tbody th', table).each(function (i) {
            var P_C = $(this).parent().attr('dt'); // we don't want to put ratio or boolean data type into the chart (is not a real number)
            if (P_C != 'R' && P_C != 'B') {
                doWeHaveChartableData = true; // there is data available that can be put into a chart
                options.xAxis.categories.push(this.innerHTML);
            }
        });

        // the data series
        options.series = [];
        $('tr', table).each(function (i) {
            var tr = this;
            $('th, td', tr).each(function (j) {
                var P_C = $(this).parent().attr('dt'); // we don't want to put ratio or boolean data type into the chart (is not a real number)
                if (P_C != 'R' && P_C != 'B') { // this is not ratio data
                    if (j > 0) { // skip first column
                        if (i == 0) { // get the name and init the series
                            options.series[j - 1] = {
                                name: this.innerHTML,
                                data: []
                            };
                        } else { // add values
                            options.series[j - 1].data.push(parseFloat(this.innerHTML));
                        }
                    }
                }
            });
        });
        if (doWeHaveChartableData) {
            $('#btnChart' + chartContainer).show(); // show the "Hide/Show Chart" button
            var chart = new Highcharts.Chart(options); // put the chart on the page
        }
        else { // there is no chartable data so we don't want to put an empty chart on the page
            $('#btnChart' + chartContainer).hide(); // hide the "Hide/Show Chart" button
        }
    },
    // toggles the up/down arrow images on the section accordian headings
    toggleArrows: function (e) {
        var span = $('.upDn', e)[0];
        var txt = $(span).attr('t');
        $(span).removeAttr('t');
        if (txt == 'o') {
            $(span).html(c)
            $(span).parent().attr('title', "Close Section");
            $(span).attr('t', 'c')
        }
        else {
            $(span).html(o)
            $(span).parent().attr('title', "Open Section");
            $(span).attr('t', 'o')
        }
    },
    hideChartsToTableButtons: function () {
        $('#btnChartsTd').hide();
    },
    handlePageChange: function () {

        var el = app.requestQuerystring('el');
        if (el != '') {
            if ($('#ul_container' + el).length > 0) {
                menuItemClick(el, '');
                repeaterCounter = 0;
            }
            else if (repeaterCounter < 30) {
                repeaterCounter += 1
                setTimeout('app.handlePageChange()', 50);
            }
        }
    },
    goToNewControl: function (pid) {
        if (isNaN(pid) || pid <= 0) return;
        $.blockUI({
            message: 'Processing...',
            fadeIn: 100,
            css: {
                border: 'none',
                padding: '15px',
                backgroundColor: '#000',
                '-webkit-border-radius': '10px',
                '-moz-border-radius': '10px',
                opacity: .5,
                color: '#fff'
            },
            onBlock: function () {
                var loc = window.location.toString();
                var thisPages_pid = app.requestQuerystring('pid');
                loc = loc.split('&el')[0];
                //alert('thisPages_pid=' + thisPages_pid + ' - pid=' + pid + ' - sectionToShow=' + sectionToShow);
                loc = loc.replace('#', '').replace('pid=' + thisPages_pid, 'pid=' + pid);
                window.location.href = loc;
            }
        });

    },
    goToNewControlKeyPress: function (pid, e) {
        if (isNaN(pid) || pid <= 0) return;
        var charCode;
        if (e && e.which) {
            charCode = e.which;
        }
        else if (window.event) {
            e = window.event;
            charCode = e.keyCode;
        }
        if (charCode == 13) {
            $.blockUI({
                message: 'Processing...',
                fadeIn: 100,
                css: {
                    border: 'none',
                    padding: '15px',
                    backgroundColor: '#000',
                    '-webkit-border-radius': '10px',
                    '-moz-border-radius': '10px',
                    opacity: .5,
                    color: '#fff'
                },
                onBlock: function () {
                    var loc = window.location.toString();
                    var thisPages_pid = app.requestQuerystring('pid');
                    loc = loc.split('&el')[0];
                    //alert('thisPages_pid=' + thisPages_pid + ' - pid=' + pid + ' - sectionToShow=' + sectionToShow);
                    loc = loc.replace('#', '').replace('pid=' + thisPages_pid, 'pid=' + pid);
                    window.location.href = loc;
                }
            });
        }
    },
    toggleMenuChildren: function (pId, e) {
        $('tr[ParentID="' + pId + '"]').toggle();
        var img = $(e);
        if ($(e).attr('t') == 'c') {
            $(e).attr('src', '../images/_btn_menu_minus.png').attr('t', 'o');
        }
        else {
            $(e).attr('src', '../images/_btn_menu_plus.png').attr('t', 'c');
        }
    },
    toggleMenuChildrenKeyDown: function (pId, e, ev) {
        if (isNaN(pId) || pId <= 0) return;
        var charCode;
        if (ev && ev.which) {
            charCode = ev.which;
        }
        else if (window.event) {
            ev = window.event;
            charCode = ev.keyCode;
        }
        if (charCode == 13) {
            $('tr[ParentID="' + pId + '"]').toggle();
            var img = $(e);
            if ($(e).attr('t') == 'c') {
                $(e).attr('src', '../images/_btn_menu_minus.png').attr('t', 'o');
            }
            else {
                $(e).attr('src', '../images/_btn_menu_plus.png').attr('t', 'c');
            }
        }
    },
    getSchoolLeaCityState: function (returnedData, profileContainer) {
        $('#' + profileContainer).show();
        if (returnedData == null) {
            $('#' + profileContainer).html('There is no data available for this school during this survey year<br><br>');
            return false;
        }

        sData = returnedData.Table;
        if (app.isNullOrEmpty(sData)) {
            $('#' + profileContainer).html('There is no data available for this school during this survey year<br><br>');
            return false;
        }
        if (IsSchoolOrDistrict == 's') {
            var thisPageID = app.requestQuerystring('pid');
            var entityName = sData[0].SCH_NAME;
            var survey_year_key = sData[0].Survey_Year_Key;
            var LeaName = sData[0].LEA_NAME;
            var School_ID = sData[0].School_ID;
            var Lea_ID = sData[0].LEA_ID;
            var SchoolCityState = sData[0].SCH_CITY + ', ' + sData[0].SCH_STATE;
            var SurveyYear = sData[0].SurveyYear;
            var ncesId = sData[0].Long_NCES_ID;
            var combokey = sData[0].Combokey;
            $('.spanSchool').each(function () {
                var json = PageInfo.Table6;
                var SchoolStartPageID = json[0].SchoolStartPageID
                //Page?t=s&eid=527098&syk=6&pid=732
                if (thisPageID == SchoolStartPageID) {
                    $(this).html(entityName);
                }
                else {
                    $(this).html('<a tabindex="9.5" title="View School Information-' + entityName + '" href="Page?t=s&eid=' + School_ID + '&syk=' + survey_year_key + '&pid=' + SchoolStartPageID + '">' + entityName + '</a>');
                }
            });
            $('.spanLEA').each(function () {
                var json = PageInfo.Table5;
                var districtStartPageId = json[0].DistrictStartPageID
                $(this).html('<a tabindex="10" title="View District Information-' + LeaName + '" href="Page?t=d&eid=' + Lea_ID + '&syk=' + survey_year_key + '&pid=' + districtStartPageId + '">' + LeaName + '</a>');
            });
            $('.spanCityState').each(function () {
                $(this).html(SchoolCityState);
            });

            $('.spanSurveyYear').each(function () {
                $(this).html(SurveyYear);
            });

            $('.spanNCESID').each(function () {
                if (ncesId != null) {
                    $(this).html(ncesId);
                    $('#spanIsNCES').show();
                }
                else {
                    $('#spanIsNCES').hide();
                }
            });

            $('.spanCRDCID').each(function () {
                if (combokey != null) {
                    $(this).html(combokey);
                    $('#spanIsCRDC').show();
                }
                else {
                    $('#spanIsCRDC').hide();
                }
            });

            return true;
        }
        else if (IsSchoolOrDistrict == 'd') {
            //app.console_log(sData)
            $('#spanIsCRDC').hide();
            var entityName = sData[0].LEA_NAME;
            var LeaName = sData[0].LEA_NAME;
            var SchoolCityState = sData[0].LEA_City + ', ' + sData[0].LEA_State;
            var SurveyYear = sData[0].SURVEY_YEAR;
            var ncesId = sData[0].LEAID;
            $('.spanSchool').each(function () {
                $(this).html(entityName);
            });
            $('.spanLEA').each(function () {
                $(this).hide();
            });
            $('.spanCityState').each(function () {
                $(this).html(SchoolCityState);
            });

            $('.spanSurveyYear').each(function () {
                $(this).html(SurveyYear);
            });
            $('.spanNCESID').each(function () {
                $(this).html(ncesId);
            });

            return true;
        }
        else return false;

    },
    showSeriesHelp: function (msg) {
        app.alertWarning(msg, 'Series Definition & Calculations', true);
    },
    getKinderPrekinderOfferings: function (containerName) {
        if (ProfileData == null) {
            $('#container' + containerName).html('There is no data available for this survey year');
            return;
        }
        else {
            //KinderPrekinderOfferings
            $.get('../Templates/KinderPrekinderOfferings.tmpl.htm', function (template) {
                $.tmpl(template, ProfileData.Table).appendTo('#A_' + containerName);
            });
        }
    },
    showDistrictHarassmentBullying: function (containerName, isGroupedSideBySide, metricCount, extraFunction) {
        var showThisSection = true;
        if (extraFunction != null) {
            showThisSection = eval(extraFunction);
        }
        if (showThisSection == false) {// if we passed a function to check weather this is to be shown or not.
            $('#container' + containerName).hide();
            return;
        }
        if (entityDetails == null) {
            sUrl = '../../handler/AjaxHandler.ashx?cmd=getDataSet_By_ID_Survey_Year_Key&ID=' + entity_id + '&Survey_Year_Key=' + survey_year_key + '&sp=getDistrictInfo&SchoolOrDistrict=' + IsSchoolOrDistrict;
            $.ajax({
                url: sUrl,
                type: "GET",
                processData: false,
                contentType: "application/json",
                dataType: "json",
                async: true,
                success: function (Data) {
                    if (Data == null) {
                        $('#container' + containerName).html('There is no data available for this district during this survey year');
                        return;
                    }
                    else {
                        entityDetails = Data;
                        // $('#bullyPolicyTemplate').tmpl(Data.Table).appendTo('#A_' + containerName);
                        $.get('../Templates/BullyPolicy.tmpl.htm', function (template) {
                            $.tmpl(template, Data.Table).appendTo('#A_' + containerName);
                        });
                    }
                }
            });
        }
        else {
            $.get('../Templates/BullyPolicy.tmpl.htm', function (template) {
                $.tmpl(template, entityDetails.Table).appendTo('#A_' + containerName);
            });
        }
    },
    showAPPolicyOfferings: function (containerName, Is_Grouped_Side_by_Side, Metric_Count, extraFunction) {
        var showThisSection = true;
        if (extraFunction != null) {
            showThisSection = eval(extraFunction);
        }
        if (showThisSection == false) {// if we passed a function to check weather this is to be shown or not.
            $('#container' + containerName).hide();
            return;
        }
        sUrl = '../../handler/AjaxHandler.ashx?cmd=getDataSet_By_ID_Survey_Year_Key&ID=' + entity_id + '&Survey_Year_Key=' + survey_year_key + '&sp=R_GetAdvancedPlacementOverview&SchoolOrDistrict=' + IsSchoolOrDistrict;
        $.ajax({
            url: sUrl,
            type: "GET",
            processData: false,
            contentType: "application/json",
            dataType: "json",
            async: true,
            success: function (Data) {
                if (Data == null) {
                    $('#container' + containerName).html('There is no data available for this survey year');
                    return;
                }
                else {
                    //                    $('#APPolicyOfferingsTemplate').tmpl(Data.Table).appendTo('#container' + containerName);
                    $.get('../Templates/APPolicyOfferingsTemplate.tmpl.htm', function (template) {
                        $.tmpl(template, Data.Table).appendTo('#container' + containerName);
                    });
                }
            }
        });

    },
    buildSimpleStackedColumnChart: function (options) {
        var defaults = {
            chartWidth: 450,
            categoryArray: [],
            seriesData: [],
            denominatorData: []
        };
        var properties = $.extend(true, {}, defaults, options);
        $.each(properties.seriesData, function (i) {
            var seriesName = properties.seriesData[i].name;
            if (app.chartColors[seriesName]) {
                properties.seriesData[i].color = app.chartColors[seriesName].color;
            }
        });

        var newChart = $('<div>').highcharts({
            chart: {
                type: 'column',
                backgroundColor: '#ffffff',
                borderColor: '#ffffff',
                width: properties.chartWidth,
                marginTop: 30,
                paddingLeft: 0,
                marginRight: 12
            },
            credits: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            title: {
                text: ''
            },
            xAxis: {
                categories: properties.categoryArray
            },
            legend: {
                borderWidth: 1,
                borderRadius: 5
            },
            yAxis: {
                minRange: 0.05,
                min: 0,
                endOnTick: true,
                ceiling: 100,
                stackLabels: {
                    enabled: true,
                    formatter: function () {
                        var counter = this.x;
                        var stackTotal = properties.denominatorData.length > 0 ? properties.denominatorData[counter] : this.total;
                        return stackTotal < 0 ? 'n=-' : stackTotal == 0 ? 'n=0' : 'n=' + app.formatWithCommas(stackTotal);
                    },
                    style: {
                        color: 'black',
                        "visibility": "visible",
                        font: 'italic 10px Verdana, sans-serif'
                    },
                    verticalAlign: 'top',
                    y: -10
                },
                title: {
                    text: 'Percentage'
                },
                labels: {
                    formatter: function () {
                        if (this.value < 1 && this.value > 0) {
                            return parseFloat(this.value.toFixed(2)).toString();
                        }
                        return this.value;
                    }
                }
            },
            tooltip: {
                //pointFormat:'<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.1f}%)<br/>',
                //backgroundColor : "rgba(248,248,255,1)",
                backgroundColor: "rgba(255,255,255,1)",
                formatter: function () {
                    var counter = properties.categoryArray.indexOf(this.x);
                    //'<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.1f}%)<br/>'
                    var denominator = properties.denominatorData.length > 0 ? properties.denominatorData[counter] : this.points[0].total;
                    var returnVal = '';
                    $(properties.seriesData).each(function (i, e) {
                        var numerator = properties.seriesData[i].data[counter];
                        var pct = '0.0%';
                        if (denominator > 0 && numerator > 0) {
                            pct = ((numerator / denominator * 100).toFixed(1)) + '%';
                        }
                        returnVal = returnVal + '<span style="color:' + properties.seriesData[i].color + '">' + properties.seriesData[i].name + '</span>: <b>' + properties.seriesData[i].data[counter] + '</b> (' + pct + ')<br/>';
                    });
                    return returnVal;

                },
                shared: true
            },
            plotOptions: {
                column: {
                    stacking: 'percent',
                    pointPadding: 0,
                    pointWidth: 45,
                    dataLabels: {
                        enabled: true,
                        color: '#000000',
                        align: 'center',
                        padding: 0,
                        crop: false,
                        overflow: "none",
                        formatter: function () {
                            var counter = this.point.index;
                            var denominator = properties.denominatorData.length > 0 ? properties.denominatorData[counter] : this.total;
                            var numerator = this.y;
                            if (denominator > 0 && numerator > 0) {
                                if ((numerator / denominator) > .05) {
                                    return ((numerator / denominator * 100).toFixed(1)) + '%';
                                } else {
                                    return '';
                                }
                            }
                            else {
                                //return this.point.index;
                                return '';
                            }

                        },
                        style: {
                            font: 'normal 10px Verdana, sans-serif',
                            'font-size': '11px'
                        },
                        verticalAlign: 'middle',
                        y: 0
                    }
                }
            },
            series: properties.seriesData
        });
        return newChart;
    },

    //#region Educational Equity Report *******************************************************************************************
    buildEducationEquityCharts: function (measureIds, measureNames, tdId, containerName, measureIds1, measureIds2, categories1, categories2, leftContent, rightContent, isHighschoolMeasureOnly) {

        var sUrl = '../../handler/AjaxHandler.ashx?cmd=GetEducationalEquityReportSections&LEA_ID=' + entity_id + '&Survey_Year_Key=' + survey_year_key + '&MeasureIds=' + measureIds + '&MeasureNames=' + measureNames + '&isHighschoolMeasureOnly=' + isHighschoolMeasureOnly;
        $.ajax({
            url: sUrl,
            type: "GET",
            processData: false,
            dataType: "json",
            async: true,
            success: function (data) {
                if (data == null) {
                    $('#container' + containerName).html('There is no data available for this survey year');
                    return;
                }
                else {
                    try {
                        var table0 = data.Table;
                        var table1 = data.Table1;
                        var series = [];
                        $(table0).each(function (i, e) {
                            var raceName = e["races"];
                            var obj = {
                                name: raceName,
                                data: []
                            }

                            $(table1).each(function (ii, d) {
                                if (measureIds1.indexOf(d['MeasureId']) != -1) {
                                    obj.data.push(d[raceName]);
                                }
                            });
                            series.push(obj);
                        });

                        var chart1 = app.buildSimpleStackedColumnChart({ chartWidth: 450, categoryArray: categories1, seriesData: series });

                        series = [];
                        $(table0).each(function (i, e) {
                            var raceName = e["races"];
                            var obj = {
                                name: raceName,
                                data: []
                            }

                            $(table1).each(function (ii, d) {
                                if (measureIds2.indexOf(d['MeasureId']) != -1) {
                                    obj.data.push(d[raceName]);
                                }
                            });
                            series.push(obj);
                        });
                        var chart2 = app.buildSimpleStackedColumnChart({ chartWidth: 350, categoryArray: categories2, seriesData: series });
                        var tbl = $('<table>');
                        var tr = $('<tr>');
                        var td = $('<td style="width:50%; vertical-align: middle;" class="SummaryAvailableMetrics">').html(leftContent);
                        var td0 = $('<td style="width:50%; vertical-align: middle;" class="SummaryAvailableMetrics">').html(rightContent);
                        tr.append(td);
                        tr.append(td0);
                        tbl.append(tr);
                        var td1 = $('<td id="td' + tdId + '1" style="width:50%">');
                        var td2 = $('<td id="td' + tdId + '2" style="width:50%">');
                        tr = $('<tr>');
                        td1.append(chart1);
                        td2.append(chart2);
                        tr.append(td1);
                        tr.append(td2);
                        tbl.append(tr);
                        $('#A_' + containerName).append(tbl);
                    }
                    catch (e) {
                        $('#container' + containerName).html('There was an error when attempting to retrieve your data. ');
                        return;
                    }
                }
            }
        });
    },
    buildEducationalEquity2: function (containerName, isGroupedSideBySide, metricCount, extraFunction) {
        disregardRegularPrintingRules = true; // we don't want the system to automatically set where our page breaks are with printing. We do it ourself.
        var showThisSection = true;
        if (extraFunction != null) {
            showThisSection = eval(extraFunction);
        }
        if (showThisSection == false) {// if we passed a function to check weather this is to be shown or not.
            $('#container' + containerName).hide();
            return;
        }
        $.get('../Templates/EE.AdditionalCharecteristics.tmpl.htm', function (template) {
            $.tmpl(template).appendTo('#A_' + containerName);
            $('#export-ss-data').button({ label: ' Export ' }).click(function () {
                var url = 'Page/Export';
                var form = $('<form></form>').attr('action', url).attr('method', 'post');
                form.append($("<input>").attr('type', 'hidden').attr('name', 'sp').attr('value', 'GetEducationalEquityReportExportStudentStaff'));
                form.append($("<input>").attr('type', 'hidden').attr('name', 'LEA_ID').attr('value', entity_id));
                form.append($("<input>").attr('type', 'hidden').attr('name', 'Survey_Year_Key').attr('value', survey_year_key));
                form.append($("<input>").attr('type', 'hidden').attr('name', 'ssName').attr('value', "Student and Staff Data"));
                //send request
                form.appendTo('body').submit().remove();

                return false;

            });

            $('#export-pccr-data').button({ label: ' Export ' }).click(function () {
                var url = 'Page/Export';
                var form = $('<form></form>').attr('action', url).attr('method', 'post');
                form.append($("<input>").attr('type', 'hidden').attr('name', 'sp').attr('value', 'GetEducationalEquityReportExportPathways'));
                form.append($("<input>").attr('type', 'hidden').attr('name', 'LEA_ID').attr('value', entity_id));
                form.append($("<input>").attr('type', 'hidden').attr('name', 'Survey_Year_Key').attr('value', survey_year_key));
                form.append($("<input>").attr('type', 'hidden').attr('name', 'ssName').attr('value', "Pathways to College and Career Readiness Data"));
                //send request
                form.appendTo('body').submit().remove();

                return false;
            });
        });
    },
    buildEducationalEquity3: function (containerName, isGroupedSideBySide, metricCount, extraFunction) {
        disregardRegularPrintingRules = true; // we don't want the system to automatically set where our page breaks are with printing. We do it ourself.
        var showThisSection = true;
        if (extraFunction != null) {
            showThisSection = eval(extraFunction);
        }
        if (showThisSection == false) {// if we passed a function to check weather this is to be shown or not.
            $('#container' + containerName).hide();
            return;
        }
        var categories1 = ["Enrollment in schools offering G/T", "Enrollment in schools not offering G/T", "Enrollment in schools"];
        var categories2 = ["Enrollment in G/T"];
        var measureIds1 = [382, 378, 1];
        var measureIds2 = [58];

        var measureNames = 'Enrollment in schools offering G/T,Enrollment in schools not offering G/T,Enrollment in schools,Enrollment in G/T';
        var measureIds = '382,378,1,58';

        var leftContent = "What is the student enrollment, by race/ethnicity, in schools offering G/T, compared to schools not offering G/T? What is the district's overall student enrollment, by race/ethnicity?";
        var rightContent = "What is the student enrollment in G/T, by race/ethnicity?";

        app.buildEducationEquityCharts(measureIds, measureNames, 'GT', containerName, measureIds1, measureIds2, categories1, categories2, leftContent, rightContent, 0);

    },
    buildEducationalEquity4: function (containerName, isGroupedSideBySide, metricCount, extraFunction) {
        disregardRegularPrintingRules = true; // we don't want the system to automatically set where our page breaks are with printing. We do it ourself.
        var showThisSection = true;
        if (extraFunction != null) {
            showThisSection = eval(extraFunction);
        }
        if (showThisSection == false) {// if we passed a function to check weather this is to be shown or not.
            $('#container' + containerName).hide();
            return;
        }
        var categories1 = ["Enrollment in HS offering AP/IB", "Enrollment in HS not offering AP/IB", "Enrollment in HS"];
        var categories2 = ["Enrollment in AP/IB"];
        var measureIds1 = [383, 379, 388];
        var measureIds2 = [386];

        var measureNames = 'Enrollment in HS offering AP/IB,Enrollment in HS not offering AP/IB,Enrollment in HS,Enrollment in AP/IB';
        var measureIds = '383,379,388,386';

        var leftContent = "What is the student enrollment, by race/ethnicity, in high schools (HS) offering AP/IB, compared to schools not offering AP/IB? What is the district's overall student enrollment, by race/ethnicity?";
        var rightContent = "What is the student enrollment in AP/IB, by race/ethnicity?";

        app.buildEducationEquityCharts(measureIds, measureNames, 'AP-IB', containerName, measureIds1, measureIds2, categories1, categories2, leftContent, rightContent, 1);
    },
    buildEducationalEquity5: function (containerName, isGroupedSideBySide, metricCount, extraFunction) {
        disregardRegularPrintingRules = true; // we don't want the system to automatically set where our page breaks are with printing. We do it ourself.
        var showThisSection = true;
        if (extraFunction != null) {
            showThisSection = eval(extraFunction);
        }
        if (showThisSection == false) {// if we passed a function to check weather this is to be shown or not.
            $('#container' + containerName).hide();
            return;
        }
        var categories1 = ["Enrollment in HS offering calculus", "Enrollment in HS not offering calculus", "Enrollment in HS"];
        var categories2 = ["Enrollment in calculus"];
        var measureIds1 = [384, 380, 388];
        var measureIds2 = [115];

        var measureNames = 'Enrollment in HS offering calculus,Enrollment in HS not offering calculus,Enrollment in HS,Enrollment in calculus';
        var measureIds = '384,380,388,115';

        var leftContent = "What is the student enrollment, by race/ethnicity, in high schools (HS) offering Calculus, compared to schools not offering Calculus? What is the district's overall student enrollment, by race/ethnicity?";
        var rightContent = "What is the student enrollment in Calculus, by race/ethnicity?";

        app.buildEducationEquityCharts(measureIds, measureNames, 'CALC', containerName, measureIds1, measureIds2, categories1, categories2, leftContent, rightContent, 1);
    },
    buildEducationalEquity6: function (containerName, isGroupedSideBySide, metricCount, extraFunction) {
        disregardRegularPrintingRules = true; // we don't want the system to automatically set where our page breaks are with printing. We do it ourself.
        var showThisSection = true;
        if (extraFunction != null) {
            showThisSection = eval(extraFunction);
        }
        if (showThisSection == false) {// if we passed a function to check weather this is to be shown or not.
            $('#container' + containerName).hide();
            return;
        }
        var categories1 = ["Enrollment in HS offering physics", "Enrollment in HS not offering physics", "Enrollment in HS"];
        var categories2 = ["Enrollment in physics"];
        var measureIds1 = [385, 381, 388];
        var measureIds2 = [118];

        var measureNames = 'Enrollment in HS offering physics,Enrollment in HS not offering physics,Enrollment in HS,Enrollment in physics';
        var measureIds = '385,381,388,118';

        var leftContent = "What is the student enrollment, by race/ethnicity, in high schools (HS) offering Physics, compared to schools not offering Physics? What is the district's overall student enrollment, by race/ethnicity?";
        var rightContent = "What is the student enrollment in Physics, by race/ethnicity?";

        app.buildEducationEquityCharts(measureIds, measureNames, 'PHYS', containerName, measureIds1, measureIds2, categories1, categories2, leftContent, rightContent, 1);
    },

    //#endregion Educational Equity report ******************************************************************************************************

    //#region Discipline Summary report *******************************************************************************************
    buildDiscSection1: function (containerName, Is_Grouped_Side_by_Side, Metric_Count, extraFunction) {
        disregardRegularPrintingRules = true; // we don't want the system to automatically set where our page breaks are with printing. We do it ourself.

        var showThisSection = true;
        if (extraFunction != null) {
            showThisSection = eval(extraFunction);
        }
        if (showThisSection == false) {// if we passed a function to check weather this is to be shown or not.
            $('#container' + containerName).hide();
            return;
        }

        sUrl = '../../handler/AjaxHandler.ashx?cmd=getDataString_By_ID_Survey_Year_Key&ID=' + entity_id + '&Survey_Year_Key=' + survey_year_key + '&sp=GetDiscipline_Section1&SchoolOrDistrict=' + IsSchoolOrDistrict;
        $.ajax({
            url: sUrl,
            type: "GET",
            processData: false,
            dataType: "html",
            async: true,
            success: function (Data) {
                if (Data == null) {
                    $('#container' + containerName).html('There is no data available for this survey year');
                    return;
                }
                else {
                    try {
                        var fullArray = Data.split('&~&');
                        var TotalEnrollment = fullArray[0].split('~~');
                        var inSchoolSuspensions = fullArray[1].split('~~');
                        var outOfSchoolSuspensions = fullArray[2].split('~~');
                        var expulsions = fullArray[3].split('~~');
                        var referrals = fullArray[4].split('~~');
                        var punishment = fullArray[5].split('~~');

                        var SATArray = fullArray[6].split('~~');
                        var SATData = {
                            "IDEALaw": SATArray[0],
                            "NonIDEALaw": SATArray[1],
                            "TotalLaw": SATArray[2],
                            "IDEAArrest": SATArray[3],
                            "NonIDEAArrest": SATArray[4],
                            "TotalArrest": SATArray[5],
                            "IDEAEXP": SATArray[6],
                            "NonIDEAEXP": SATArray[7],
                            "TotalEXP": SATArray[8],
                            "InSchoolSusp504": SATArray[9],
                            "OutOfSchoolSusp504": SATArray[10],
                            "Expulsions504": SATArray[11],
                            "TotalCorporal504": SATArray[12],
                            "TotalLaw504": SATArray[13],
                            "Total504Enrollment": SATArray[14],
                            "LEAID": ProfileData.Table[0].LEAID
                        };
                        //console.log(SATData);
                        $.get('../Templates/DiscSection1.tmpl.htm', function (template) {
                            //$(template).appendTo('#A_' + containerName);
                            $.tmpl(template, SATData).appendTo('#A_' + containerName);
                            app.buildPieChart(TotalEnrollment[1], 'tdTotalDiscEnrollment', TotalEnrollment[0], '', TotalEnrollment[2])
                            app.buildPieChart(inSchoolSuspensions[1], 'tdInSchoolSuspensions', inSchoolSuspensions[0], '', inSchoolSuspensions[2])
                            app.buildPieChart(outOfSchoolSuspensions[1], 'tdOutOfSchoolSuspensions', outOfSchoolSuspensions[0], '', outOfSchoolSuspensions[2])
                            app.buildPieChart(expulsions[1], 'tdExpulsions', expulsions[0], '', expulsions[2]);
                            app.buildPieChart(referrals[1], 'tdReferrals', referrals[0], '', referrals[2]);
                            app.buildPieChart(punishment[1], 'tdPunishment', punishment[0], '', punishment[2]);
                        });
                    }
                    catch (e) {
                        $('#container' + containerName).html('There was an error when attempting to retrieve your data. ');
                        return;
                    }
                }
            }
        });
    },
    buildDiscSection2: function (containerName, Is_Grouped_Side_by_Side, Metric_Count, extraFunction) {
        var showThisSection = true;
        disregardRegularPrintingRules = true; // we don't want the system to automatically set where our page breaks are with printing. We do it ourself.

        if (extraFunction != null) {
            showThisSection = eval(extraFunction);
        }
        if (showThisSection == false) {// if we passed a function to check weather this is to be shown or not.
            $('#container' + containerName).hide();
            return;
        }

        $.get('../Templates/DiscSection2.tmpl.htm', function (template) {
            $.tmpl(template, null).appendTo('#A_' + containerName);
            sUrl = '../../handler/AjaxHandler.ashx?cmd=getDataSet_By_ID_Survey_Year_Key&ID=' + entity_id + '&Survey_Year_Key=' + survey_year_key + '&sp=GetDiscipline_Section2&SchoolOrDistrict=' + IsSchoolOrDistrict;
            $.ajax({
                url: sUrl,
                type: "GET",
                dataType: "json",
                async: true,
                success: function (JsonData) {
                    var _data = JsonData.Table;
                    var options = {
                        chart: {
                            renderTo: 'tdNonDisOutOfSchool',
                            type: 'column',
                            width: app.getChartWidths(false, false),
                            height: 300
                        },
                        credits: {
                            enabled: false
                        },
                        exporting: {
                            enabled: false
                        },
                        title: {
                            text: ''
                        },
                        xAxis: {
                            categories: ['All Students', 'Am Ind/AK Nat', 'Asian', 'Black', 'Hispanic', 'Nat HI/Pac Isl', 'Two or More', 'White']
                        },
                        yAxis: {
                            ceiling: 100,
                            title: {
                                text: 'Percentage'
                            }
                        },
                        tooltip: {
                            formatter: function () {
                                var race = this.x.toString();
                                if (race == 'All Students') {
                                    return this.y.toFixed(1) + '%'; // of ALL enrolled Non-Disabled students<br>have received out of school suspensions';
                                }
                                else {
                                    return this.y.toFixed(1) + '%'; // of enrolled ' + this.x.toString() + ' Non-Disabled students<br>have received out of school suspensions';
                                }
                            }
                        }
                    };
                    options.series = [];
                    options.series[0] = {
                        name: 'Male',
                        data: jQuery.parseJSON(_data[0]['Male']),
                        dataLabels: {
                            enabled: true,
                            formatter: function () {
                                return this.y.toFixed(1) + '%';
                            },
                            style: {
                                color: 'black',
                                "visibility": "visible",
                                font: 'italic 10px Verdana, sans-serif',
                                fontSize: '8px'
                            },
                            align: 'center',
                            padding: 0,
                            crop: false,
                            overflow: "none"
                            , verticalAlign: 'middle'
                            , y: -10
                        }
                    };
                    options.series[1] = {
                        name: 'Female',
                        data: jQuery.parseJSON(_data[0]['Female']),
                        dataLabels: {
                            enabled: true,
                            formatter: function () {
                                return this.y.toFixed(1) + '%';
                            },
                            style: {
                                color: 'black',
                                "visibility": "visible",
                                font: 'italic 10px Verdana, sans-serif',
                                fontSize: '8px'
                            },
                            align: 'center',
                            padding: 0,
                            crop: false,
                            overflow: "none"
                            , verticalAlign: 'middle'
                            , y: -10
                        }
                    };
                    setTimeout(function () {
                        var chart = new Highcharts.Chart(options);
                    }, 0);
                }
            });
        });
    },
    buildDiscSection3: function (containerName, Is_Grouped_Side_by_Side, Metric_Count, extraFunction) {
        var showThisSection = true;
        disregardRegularPrintingRules = true; // we don't want the system to automatically set where our page breaks are with printing. We do it ourself.

        if (extraFunction != null) {
            showThisSection = eval(extraFunction);
        }
        if (showThisSection == false) {// if we passed a function to check weather this is to be shown or not.
            $('#container' + containerName).hide();
            return;
        }

        $.get('../Templates/DiscSection3.tmpl.htm', function (template) {
            sUrl = '../../handler/AjaxHandler.ashx?cmd=getDataSet_By_ID_Survey_Year_Key&ID=' + entity_id + '&Survey_Year_Key=' + survey_year_key + '&sp=GetDiscipline_Section3&SchoolOrDistrict=' + IsSchoolOrDistrict;
            $.ajax({
                url: sUrl,
                type: "GET",
                dataType: "json",
                async: true,
                success: function (JsonData) {
                    var _data = JsonData.Table;
                    $.tmpl(template, JsonData.Table1).appendTo('#A_' + containerName);
                    setTimeout(function () {
                        var options = {
                            chart: {
                                renderTo: 'tdDisOutOfSchool',
                                type: 'column',
                                width: app.getChartWidths(false, false),
                                height: 300
                            },
                            credits: {
                                enabled: false
                            },
                            exporting: {
                                enabled: false
                            },
                            title: {
                                text: ''
                            },
                            xAxis: {
                                categories: ['All Students', 'Am Ind/AK Nat', 'Asian', 'Black', 'Hispanic', 'Nat HI/Pac Isl', 'Two or More', 'White']
                            },
                            yAxis: {
                                ceiling: 100,
                                title: {
                                    text: 'Percentage'
                                }
                            },
                            tooltip: {
                                formatter: function () {
                                    var race = this.x.toString();
                                    if (race == 'All Students') {
                                        return this.y.toFixed(1) + '%'; // of ALL enrolled IDEA students<br>have received out of school suspensions';
                                    }
                                    else {
                                        return this.y.toFixed(1) + '%'; // of enrolled ' + this.x.toString() + ' IDEA students<br>have received out of school suspensions';
                                    }
                                }
                            }
                        };
                        options.series = [];
                        options.series[0] = {
                            name: 'Male',
                            data: jQuery.parseJSON(_data[0]['Male']),
                            dataLabels: {
                                enabled: true,
                                formatter: function () {
                                    return this.y.toFixed(1) + '%';
                                },
                                style: {
                                    color: 'black',
                                    "visibility": "visible",
                                    font: 'italic 10px Verdana, sans-serif',
                                    fontSize: '8px'
                                },
                                align: 'center',
                                padding: 0,
                                crop: false,
                                overflow: "none"
                                , verticalAlign: 'middle'
                                , y: -10
                            }
                        };
                        options.series[1] = {
                            name: 'Female',
                            data: jQuery.parseJSON(_data[0]['Female']),
                            dataLabels: {
                                enabled: true,
                                formatter: function () {
                                    return this.y.toFixed(1) + '%';
                                },
                                style: {
                                    color: 'black',
                                    "visibility": "visible",
                                    font: 'italic 10px Verdana, sans-serif',
                                    fontSize: '8px'
                                },
                                align: 'center',
                                padding: 0,
                                crop: false,
                                overflow: "none"
                                , verticalAlign: 'middle'
                                , y: -10
                            }
                        };
                        setTimeout(function () {
                            var chart = new Highcharts.Chart(options);
                        }, 0);
                    }, 1000);
                }
            });
        });
    },
    buildDiscSection4: function (containerName, Is_Grouped_Side_by_Side, Metric_Count, extraFunction) {
        disregardRegularPrintingRules = true; // we don't want the system to automatically set where our page breaks are with printing. We do it ourself.

        var showThisSection = true;
        if (extraFunction != null) {
            showThisSection = eval(extraFunction);
        }
        if (showThisSection == false) {// if we passed a function to check weather this is to be shown or not.
            $('#container' + containerName).hide();
            return;
        }

        sUrl = '../../handler/AjaxHandler.ashx?cmd=getDataString_By_ID_Survey_Year_Key&ID=' + entity_id + '&Survey_Year_Key=' + survey_year_key + '&sp=GetDiscipline_Section4&SchoolOrDistrict=' + IsSchoolOrDistrict;
        $.ajax({
            url: sUrl,
            type: "GET",
            processData: false,
            dataType: "html",
            async: true,
            success: function (Data) {
                if (Data == null) {
                    $('#container' + containerName).html('There is no data available for this survey year');
                    return;
                }
                else {
                    try {
                        var fullArray = Data.split('&~&');
                        var TotalEnrollment = fullArray[0].split('~~');
                        var inSchoolSuspensions = fullArray[1].split('~~');
                        var outOfSchoolSuspensions = fullArray[2].split('~~');
                        var expulsions = fullArray[3].split('~~');
                        var referrals = fullArray[4].split('~~');
                        var punishment = fullArray[5].split('~~');
                        var SATData = [];
                        $.get('../Templates/DiscSection4.tmpl.htm', function (template) {
                            $(template).appendTo('#A_' + containerName);
                            //$.tmpl(template, SATData).appendTo('#A_' + containerName);
                            app.buildPieChart(TotalEnrollment[1], 'tdIdeaTotalDiscEnrollment', TotalEnrollment[0], '', TotalEnrollment[2])
                            app.buildPieChart(inSchoolSuspensions[1], 'tdIdeaInSchoolSuspensions', inSchoolSuspensions[0], '', inSchoolSuspensions[2])
                            app.buildPieChart(outOfSchoolSuspensions[1], 'tdIdeaOutOfSchoolSuspensions', outOfSchoolSuspensions[0], '', outOfSchoolSuspensions[2])
                            app.buildPieChart(expulsions[1], 'tdIdeaExpulsions', expulsions[0], '', expulsions[2]);
                            app.buildPieChart(referrals[1], 'tdIdeaReferrals', referrals[0], '', referrals[2]);
                            app.buildPieChart(punishment[1], 'tdIdeaPunishment', punishment[0], '', punishment[2]);
                        });
                    }
                    catch (e) {
                        $('#container' + containerName).html('There was an error when attempting to retrieve your data. ');
                        return;
                    }
                }
            }
        });
    },
    buildDiscSection5: function (containerName, Is_Grouped_Side_by_Side, Metric_Count, extraFunction) {
        disregardRegularPrintingRules = true; // we don't want the system to automatically set where our page breaks are with printing. We do it ourself.

        var showThisSection = true;
        if (extraFunction != null) {
            showThisSection = eval(extraFunction);
        }
        if (showThisSection == false) {// if we passed a function to check weather this is to be shown or not.
            $('#container' + containerName).hide();
            return;
        }

        sUrl = '../../handler/AjaxHandler.ashx?cmd=getDataString_By_ID_Survey_Year_Key&ID=' + entity_id + '&Survey_Year_Key=' + survey_year_key + '&sp=GetDiscipline_Section5&SchoolOrDistrict=' + IsSchoolOrDistrict;
        $.ajax({
            url: sUrl,
            type: "GET",
            processData: false,
            dataType: "html",
            async: true,
            success: function (Data) {
                if (Data == null) {
                    $('#container' + containerName).html('There is no data available for this survey year');
                    return;
                }
                else {
                    try {
                        var fullArray = Data.split('&~&');
                        var TotalEnrollment = fullArray[0].split('~~');
                        var inSchoolSuspensions = fullArray[1].split('~~');
                        var outOfSchoolSuspensions = fullArray[2].split('~~');
                        var expulsions = fullArray[3].split('~~');
                        var referrals = fullArray[4].split('~~');
                        var punishment = fullArray[5].split('~~');
                        var SATData = [];
                        $.get('../Templates/DiscSection5.tmpl.htm', function (template) {
                            $(template).appendTo('#A_' + containerName);
                            //$.tmpl(template, SATData).appendTo('#A_' + containerName);
                            app.buildPieChart(TotalEnrollment[1], 'tdIdea_TotalDiscEnrollment', TotalEnrollment[0], '', TotalEnrollment[2])
                            app.buildPieChart(inSchoolSuspensions[1], 'tdIdea_InSchoolSuspensions', inSchoolSuspensions[0], '', inSchoolSuspensions[2])
                            app.buildPieChart(outOfSchoolSuspensions[1], 'tdIdea_OutOfSchoolSuspensions', outOfSchoolSuspensions[0], '', outOfSchoolSuspensions[2])
                            app.buildPieChart(expulsions[1], 'tdIdea_Expulsions', expulsions[0], '', expulsions[2]);
                            app.buildPieChart(referrals[1], 'tdIdea_Referrals', referrals[0], '', referrals[2]);
                            app.buildPieChart(punishment[1], 'tdIdea_Punishment', punishment[0], '', punishment[2]);
                        });
                    }
                    catch (e) {
                        $('#container' + containerName).html('There was an error when attempting to retrieve your data. ');
                        return;
                    }
                }
            }
        });
    },

    //#endregion Discipline Summary report ******************************************************************************************************

    //#region LEP Summary *********************************************************************************************************
    buildLEPEarlyChildSummary: function (containerName, Is_Grouped_Side_by_Side, Metric_Count, extraFunction) {
        var showThisSection = true;
        disregardRegularPrintingRules = true; // we don't want the system to automatically set where our page breaks are with printing. We do it ourself.
        if (extraFunction != null) {
            showThisSection = eval(extraFunction);
        }
        if (showThisSection == false) {// if we passed a function to check weather this is to be shown or not.
            $('#container' + containerName).hide();
            return;
        }
        var sUrl = '../../handler/AjaxHandler.ashx?cmd=getDataString_By_ID_Survey_Year_Key&ID=' + entity_id + '&Survey_Year_Key=' + survey_year_key + '&sp=GetLEPEarlyChildhood&SchoolOrDistrict=' + IsSchoolOrDistrict;
        var params = $('.elems').serialize();

        $.ajax({
            url: sUrl,
            type: "GET",
            processData: false,
            dataType: "html",
            async: true,
            success: function (Data) {
                if (Data == null) {
                    $('#container' + containerName).html('There is no data available for this survey year');
                    return;
                }
                else {
                    try {
                        var fullArray = Data.split('&~&');
                        var TotalEnrollment = fullArray[0].split('~~');
                        var EarlyChild = fullArray[1].split('~~');
                        var Gifted = fullArray[2].split('~~');

                        $.get('../Templates/LEPEarlyChildhood.tmpl.htm', function (template) {
                            $.tmpl(template, null).appendTo('#A_' + containerName);
                            app.buildPieChart(TotalEnrollment[1], 'tdFull_TotalEnrollmentEarlyChildhood', TotalEnrollment[0], '', TotalEnrollment[2])
                            app.buildPieChart(EarlyChild[1], 'tdEarlyChildhoodStudents', EarlyChild[0], '', EarlyChild[2])
                            var isMiddle_HighSchool = app.showOnlyMiddleSchoolsAndHighSchools();
                            var isElementary = app.showOnlyElementarySchools();
                            if (isMiddle_HighSchool && isElementary) { // if this school/district contains all grades then we hide this section because it's included in another section
                                $('.hideFormLEA').hide();
                            }
                            else { // if this is a school we want to show this next section. We don't want to show it if it contains all grades (handled above)
                                app.buildPieChart(TotalEnrollment[1], 'tdFull_TotalEnrollmentEarlyChildhood2', TotalEnrollment[0], '', TotalEnrollment[2])
                                app.buildPieChart(Gifted[1], 'tdGiftedStudents', Gifted[0], '', Gifted[2])
                                /*setTimeout(function () {
                                $('.roundtopcorners').each(function (i, e) {
                                if (i != 0) $(this).parent().parent().addClass('pgBreak');
                                });
                                }, 1500);*/
                            }
                        });
                    }
                    catch (e) {
                        $('#container' + containerName).html('There was an error when attempting to retrieve your data. ');
                        return;
                    }
                }
            },
            complete: function () {

            }
        });
    },
    buildLEPGandTSummary: function (containerName, Is_Grouped_Side_by_Side, Metric_Count, extraFunction) {
        var showThisSection = true;
        disregardRegularPrintingRules = true; // we don't want the system to automatically set where our page breaks are with printing. We do it ourself.

        if (extraFunction != null) {
            showThisSection = eval(extraFunction);
        }
        if (showThisSection == false) {// if we passed a function to check weather this is to be shown or not.
            $('#container' + containerName).hide();
            return;
        }
        var sUrl = '../../handler/AjaxHandler.ashx?cmd=getDataString_By_ID_Survey_Year_Key&ID=' + entity_id + '&Survey_Year_Key=' + survey_year_key + '&sp=GetLEPCollegeAndCareer&SchoolOrDistrict=' + IsSchoolOrDistrict;
        var params = $('.elems').serialize();
        $.ajax({
            url: sUrl,
            type: "GET",
            processData: false,
            dataType: "html",
            async: true,
            success: function (Data) {
                if (Data == null) {
                    $('#container' + containerName).html('There is no data available for this survey year');
                    return;
                }
                else {
                    try {
                        var fullArray = Data.split('&~&');
                        var TotalEnrollment = fullArray[0].split('~~');
                        var GT = fullArray[1].split('~~');
                        var Calculus = fullArray[2].split('~~');
                        var Chemistry = fullArray[3].split('~~');
                        var Physics = fullArray[4].split('~~');


                        $.get('../Templates/LEPGandT.tmpl.htm', function (template) {
                            $.tmpl(template, null).appendTo('#A_' + containerName);
                            app.buildPieChart(TotalEnrollment[1], 'tdFull_TotalEnrollmentGandT1', TotalEnrollment[0], '', TotalEnrollment[2])
                            app.buildPieChart(TotalEnrollment[1], 'tdFull_TotalEnrollmentGandT2', TotalEnrollment[0], '', TotalEnrollment[2])
                            app.buildPieChart(GT[1], 'tdGTStudents', GT[0], '', GT[2])
                            app.buildPieChart(Calculus[1], 'tdCalc', Calculus[0], '', Calculus[2])
                            app.buildPieChart(Chemistry[1], 'tdChemistry', Chemistry[0], '', Chemistry[2])
                            app.buildPieChart(Physics[1], 'tdPhysics', Physics[0], '', Physics[2])
                            /*setTimeout(function () {
                            $('.roundtopcorners').each(function (i, e) {
                            if (i != 0) $(this).parent().parent().addClass('pgBreak');
                            });
                            }, 1500);*/

                        });
                    }
                    catch (e) {
                        $('#container' + containerName).html('There was an error when attempting to retrieve your data. ');
                        return;
                    }
                }
            },
            complete: function () {
            }
        });

    },
    buildLEPAPSummary: function (containerName, Is_Grouped_Side_by_Side, Metric_Count, extraFunction) {
        var showThisSection = true;
        disregardRegularPrintingRules = true; // we don't want the system to automatically set where our page breaks are with printing. We do it ourself.

        if (extraFunction != null) {
            showThisSection = eval(extraFunction);
        }
        if (showThisSection == false) {// if we passed a function to check weather this is to be shown or not.
            $('#container' + containerName).hide();
            return;
        }
        $('#accordian' + containerName).addClass('preventPgBreak');
        var sUrl = '../../handler/AjaxHandler.ashx?cmd=getDataString_By_ID_Survey_Year_Key&ID=' + entity_id + '&Survey_Year_Key=' + survey_year_key + '&sp=GetLEPAP&SchoolOrDistrict=' + IsSchoolOrDistrict;
        var params = $('.elems').serialize();
        $.ajax({
            url: sUrl,
            type: "GET",
            processData: false,
            dataType: "html",
            async: true,
            success: function (Data) {
                if (Data == null) {
                    $('#container' + containerName).html('There is no data available for this survey year');
                    return;
                }
                else {
                    try {
                        var fullArray = Data.split('&~&');
                        var TotalEnrollment = fullArray[0].split('~~');
                        var AP = fullArray[1].split('~~');

                        $.get('../Templates/LEPAP.tmpl.htm', function (template) {
                            $.tmpl(template, null).appendTo('#A_' + containerName);
                            app.buildPieChart(TotalEnrollment[1], 'tdFull_TotalEnrollmentAP', TotalEnrollment[0], '', TotalEnrollment[2])
                            app.buildPieChart(AP[1], 'tdAPStudents', AP[0], '', AP[2])
                            /*setTimeout(function () {
                            $('.roundtopcorners').each(function (i, e) {
                            if (i != 0) $(this).parent().parent().addClass('pgBreak');
                            });
                            }, 1500);*/

                        });
                    }
                    catch (e) {
                        $('#container' + containerName).html('There was an error when attempting to retrieve your data. ');
                        return;
                    }
                }
            },
            complete: function () {
            }
        });
    },
    buildLEPDisciplineSummary: function (containerName, Is_Grouped_Side_by_Side, Metric_Count, extraFunction) {
        var showThisSection = true;
        disregardRegularPrintingRules = true; // we don't want the system to automatically set where our page breaks are with printing. We do it ourself.

        if (extraFunction != null) {
            showThisSection = eval(extraFunction);
        }
        if (showThisSection == false) {// if we passed a function to check weather this is to be shown or not.
            $('#container' + containerName).hide();
            return;
        }

        $('#accordian' + containerName).addClass('pgBreak');
        var sUrl = '../../handler/AjaxHandler.ashx?cmd=getDataString_By_ID_Survey_Year_Key&ID=' + entity_id + '&Survey_Year_Key=' + survey_year_key + '&sp=GetLEPDiscipline&SchoolOrDistrict=' + IsSchoolOrDistrict;
        var params = $('.elems').serialize();
        $.ajax({
            url: sUrl,
            type: "GET",
            processData: false,
            dataType: "html",
            async: true,
            success: function (Data) {
                if (Data == null) {
                    $('#container' + containerName).html('There is no data available for this survey year');
                    return;
                }
                else {
                    try {
                        var fullArray = Data.split('&~&');
                        var TotalEnrollment = fullArray[0].split('~~');
                        var IN = fullArray[1].split('~~');
                        var OUT = fullArray[2].split('~~');
                        var EXP = fullArray[3].split('~~');

                        $.get('../Templates/LEPDiscipline.tmpl.htm', function (template) {
                            $.tmpl(template, null).appendTo('#A_' + containerName);
                            app.buildPieChart(TotalEnrollment[1], 'tdFull_TotalEnrollmentDisipline', TotalEnrollment[0], '', TotalEnrollment[2])
                            app.buildPieChart(IN[1], 'tdLEPInSchool', IN[0], '', IN[2])
                            app.buildPieChart(OUT[1], 'tdLEPOutOfSchool', OUT[0], '', OUT[2])
                            app.buildPieChart(EXP[1], 'tdLEPExpulsion', EXP[0], '', EXP[2])
                            /*setTimeout(function () {
                            $('.roundtopcorners').each(function (i, e) {
                            if (i != 0) $(this).parent().parent().addClass('pgBreak');
                            });
                            }, 1500);*/
                        });
                    }
                    catch (e) {
                        $('#container' + containerName).html('There was an error when attempting to retrieve your data. ');
                        return;
                    }
                }
            },
            complete: function () {
            }
        });
    },
    buildLEPSATSummary: function (containerName, Is_Grouped_Side_by_Side, Metric_Count, extraFunction) {
        var showThisSection = true;
        disregardRegularPrintingRules = true; // we don't want the system to automatically set where our page breaks are with printing. We do it ourself.

        if (extraFunction != null) {
            showThisSection = eval(extraFunction);
        }
        if (showThisSection == false) {// if we passed a function to check weather this is to be shown or not.
            $('#container' + containerName).hide();
            return;
        }
        var sUrl = '../../handler/AjaxHandler.ashx?cmd=getDataString_By_ID_Survey_Year_Key&ID=' + entity_id + '&Survey_Year_Key=' + survey_year_key + '&sp=GetLEPSAT&SchoolOrDistrict=' + IsSchoolOrDistrict;
        var params = $('.elems').serialize();
        $.ajax({
            url: sUrl,
            type: "GET",
            processData: false,
            dataType: "html",
            async: true,
            success: function (Data) {
                if (Data == null) {
                    $('#container' + containerName).html('There is no data available for this survey year');
                    return;
                }
                else {
                    try {
                        var fullArray = Data.split('&~&');
                        var TotalEnrollment = fullArray[0].split('~~');
                        var SAT = fullArray[1].split('~~');

                        $.get('../Templates/LEPACT.tmpl.htm', function (template) {
                            $.tmpl(template, null).appendTo('#A_' + containerName);
                            app.buildPieChart(TotalEnrollment[1], 'tdFull_TotalEnrollmentSAT', TotalEnrollment[0], '', TotalEnrollment[2])
                            app.buildPieChart(SAT[1], 'tdSATStudents', SAT[0], '', SAT[2])
                            /*setTimeout(function () {
                            $('.roundtopcorners').each(function (i, e) {
                            if (i != 0) $(this).parent().parent().addClass('pgBreak');
                            });
                            }, 1500);*/

                        });
                    }
                    catch (e) {
                        $('#container' + containerName).html('There was an error when attempting to retrieve your data. ');
                        return;
                    }
                }
            },
            complete: function () {
            }
        });
    },
    buildLEPELIPSummary: function (containerName, Is_Grouped_Side_by_Side, Metric_Count, extraFunction) {
        var showThisSection = true;
        disregardRegularPrintingRules = true; // we don't want the system to automatically set where our page breaks are with printing. We do it ourself.

        if (extraFunction != null) {
            showThisSection = eval(extraFunction);
        }
        if (showThisSection == false) {// if we passed a function to check weather this is to be shown or not.
            $('#container' + containerName).hide();
            return;
        }

        var sUrl = '../../handler/AjaxHandler.ashx?cmd=getDataString_By_ID_Survey_Year_Key&ID=' + entity_id + '&Survey_Year_Key=' + survey_year_key + '&sp=GetLEPELIPSummary&SchoolOrDistrict=' + IsSchoolOrDistrict;
        $.ajax({
            url: sUrl,
            type: "GET",
            processData: false,
            dataType: "html",
            async: true,
            success: function (Data) {
                if (Data == null) {
                    $('#container' + containerName).html('There is no data available for this survey year');
                    return;
                }
                else {
                    try {
                        var fullArray = Data.split('&~&');
                        var TotalEnrollment = fullArray[0].split('~~');
                        var LEP = fullArray[1].split('~~');

                        $.get('../Templates/LEPElip.tmpl.htm', function (template) {
                            $.tmpl(template, null).appendTo('#A_' + containerName);
                            app.buildPieChart(TotalEnrollment[1], 'tdFull_TotalEnrollment2', TotalEnrollment[0], '', TotalEnrollment[2])
                            app.buildPieChart(LEP[1], 'tdLEPElieStudents', LEP[0], '', LEP[2])

                            //tdLEPParticipants
                            sUrl = '../../handler/AjaxHandler.ashx?cmd=getDataSet_By_ID_Survey_Year_Key&ID=' + entity_id + '&Survey_Year_Key=' + survey_year_key + '&sp=GetLEPStudentParticipantsByRace&SchoolOrDistrict=' + IsSchoolOrDistrict;
                            $.ajax({
                                url: sUrl,
                                type: "GET",
                                dataType: "json",
                                async: true,
                                success: function (JsonData) {
                                    var options = {
                                        chart: {
                                            renderTo: 'tdLEPParticipants',
                                            type: 'column',
                                            width: app.getChartWidths(false, false),
                                            height: 300
                                        },
                                        credits: {
                                            enabled: false
                                        },
                                        exporting: {
                                            enabled: false
                                        },
                                        title: {
                                            text: ''
                                        },
                                        xAxis: {
                                            categories: ['All Students', 'Am Ind/AK Nat', 'Asian', 'Black', 'Hispanic', 'Nat HI/Pac Isl', 'Two or More', 'White']
                                        },
                                        yAxis: {
                                            ceiling: 100,
                                            title: {
                                                text: 'Percentage'
                                            }
                                        },
                                        tooltip: {
                                            formatter: function () {
                                                var race = this.x.toString();
                                                if (race == 'All Students') {
                                                    return this.y + '% of ALL enrolled LEP students<br>are participating in LEP programs';
                                                }
                                                else {
                                                    return this.y + '% of enrolled ' + this.x.toString() + ' LEP students<br>are participating in LEP programs';
                                                }
                                            }
                                        }
                                    };
                                    options.series = [];
                                    var vals = [];
                                    $.each(JsonData.Table[0], function (i, r) {
                                        vals.push(parseFloat(r));
                                    });
                                    options.series[0] = {
                                        name: 'Percentage of LEP students per race/ethnicity category participating in LEP programs',
                                        data: vals
                                    };
                                    setTimeout(function () {
                                        var chart = new Highcharts.Chart(options);
                                        var txt = '<br><span style="color: Teal; padding-top: 8px; font-size: 16px;"><span id="pctLEPParticipantsFemales">' + app.formatPct(JsonData.Table1[0]['FemaleStudents']) + '</span>% of female LEP students are participating in LEP programs and <span id="pctParticipantsLEPMales">' + app.formatPct(JsonData.Table1[0]['MaleStudents']) + '</span>% of male LEP students are participating in LEP programs.</span><br />'
                                        //$('#pctLEPParticipantsFemales').text(JsonData.Table1[0]['FemaleStudents']);
                                        //$('#pctParticipantsLEPMales').text(JsonData.Table1[0]['MaleStudents']);
                                        $('#tdLEPParticipants').append(txt);
                                    }, 0);

                                    /*setTimeout(function () {
                                    $('.roundtopcorners').each(function (i, e) {
                                    if (i != 0) $(this).parent().parent().addClass('pgBreak');
                                    });
                                    }, 1500);*/
                                }
                            });

                        });
                    }
                    catch (e) {
                        $('#container' + containerName).html('There was an error when attempting to retrieve your data. ');
                        return;
                    }
                }
            },
            complete: function () {
            }
        });

    },
    buildLEPCharacteristics: function (containerName, Is_Grouped_Side_by_Side, Metric_Count, extraFunction) {
        var showThisSection = true;
        disregardRegularPrintingRules = true; // we don't want the system to automatically set where our page breaks are with printing. We do it ourself.

        if (extraFunction != null) {
            showThisSection = eval(extraFunction);
        }
        if (showThisSection == false) {// if we passed a function to check weather this is to be shown or not.
            $('#container' + containerName).hide();
            return;
        }
        var TemplateName = '';
        if (app.requestQuerystring('t') == 's') {
            TemplateName = '../Templates/CharacteristicsSchool.tmpl.htm';
        }
        else {
            TemplateName = '../Templates/CharacteristicsDistrict.tmpl.htm';
        }

        $.get(TemplateName, function (template) {
            $.tmpl(template, ProfileData.Table).appendTo('#A_' + containerName);
        });
        if (app.requestQuerystring('syk') == '6') {
            $('.spanSurveyYear').html('2011-12');
        }
        else if (app.requestQuerystring('syk') == '7') {
            $('.spanSurveyYear').html('2013-14');
        }
    },
    buildLEPEnrollmentSummary: function (containerName, Is_Grouped_Side_by_Side, Metric_Count, extraFunction) {
        var showThisSection = true;
        disregardRegularPrintingRules = true; // we don't want the system to automatically set where our page breaks are with printing. We do it ourself.

        if (extraFunction != null) {
            showThisSection = eval(extraFunction);
        }
        if (showThisSection == false) {// if we passed a function to check weather this is to be shown or not.
            $('#container' + containerName).hide();
            return;
        }

        var sUrl = '../../handler/AjaxHandler.ashx?cmd=getDataString_By_ID_Survey_Year_Key&ID=' + entity_id + '&Survey_Year_Key=' + survey_year_key + '&sp=GetLEPEnrollmentSummary&SchoolOrDistrict=' + IsSchoolOrDistrict;
        $.ajax({
            url: sUrl,
            type: "GET",
            processData: false,
            dataType: "html",
            async: true,
            success: function (Data) {
                if (Data == null) {
                    $('#container' + containerName).html('There is no data available for this survey year');
                    return;
                }
                else {
                    try {
                        var fullArray = Data.split('&~&');
                        var TotalEnrollment = fullArray[0].split('~~');
                        var LEP = fullArray[1].split('~~');
                        var IDEATotalEnrollment = fullArray[2].split('~~');
                        var IDEALep = fullArray[3].split('~~');


                        $.get('../Templates/LEPStudents.tmpl.htm', function (template) {
                            $.tmpl(template, null).appendTo('#A_' + containerName);
                            app.buildPieChart(TotalEnrollment[1], 'tdFull_TotalEnrollment', TotalEnrollment[0], '', TotalEnrollment[2])
                            app.buildPieChart(LEP[1], 'tdLEPStudents', LEP[0], '', LEP[2])
                            app.buildPieChart(IDEATotalEnrollment[1], 'tdFull_TotalIDEA', IDEATotalEnrollment[0], '', IDEATotalEnrollment[2])
                            app.buildPieChart(IDEALep[1], 'tdFull_LEPIDEA', IDEALep[0], '', IDEALep[2])

                            sUrl = '../../handler/AjaxHandler.ashx?cmd=getDataSet_By_ID_Survey_Year_Key&ID=' + entity_id + '&Survey_Year_Key=' + survey_year_key + '&sp=GetLEPStudentsByRace&SchoolOrDistrict=' + IsSchoolOrDistrict;
                            $.ajax({
                                url: sUrl,
                                type: "GET",
                                dataType: "json",
                                async: true,
                                success: function (JsonData) {
                                    var options = {
                                        chart: {
                                            renderTo: 'tdLEP_ByRace',
                                            type: 'column',
                                            width: app.getChartWidths(false, false),
                                            height: 300
                                        },
                                        credits: {
                                            enabled: false
                                        },
                                        exporting: {
                                            enabled: false
                                        },
                                        title: {
                                            text: ''
                                        },
                                        xAxis: {
                                            categories: ['All Students', 'Am Ind/AK Nat', 'Asian', 'Black', 'Hispanic', 'Nat HI/Pac Isl', 'Two or More', 'White']
                                        },
                                        yAxis: {
                                            ceiling: 100,
                                            title: {
                                                text: 'Percentage'
                                            }
                                        },
                                        tooltip: {
                                            formatter: function () {
                                                var race = this.x.toString();
                                                if (race == 'All Students') {
                                                    return this.y + '% of all enrolled students are LEP';
                                                }
                                                else {
                                                    return this.y + '% of all ' + this.x.toString() + ' students are LEP';
                                                }
                                            }
                                        }
                                    };
                                    options.series = [];
                                    var vals = [];
                                    $.each(JsonData.Table[0], function (i, r) {
                                        vals.push(parseFloat(r));
                                    });
                                    options.series[0] = {
                                        name: 'Percentage of students per race/ethnicity category who are LEP',
                                        data: vals
                                    };
                                    setTimeout(function () {
                                        var chart = new Highcharts.Chart(options);
                                        var txt = '<br><span style="color:Teal; padding-top:8px; font-size:16px;"><span id="pctLEPFemales">' + app.formatPct(JsonData.Table1[0]['FemaleStudents']) + '</span>% of female students are LEP and <span id="pctLEPMales">' + app.formatPct(JsonData.Table1[0]['MaleStudents']) + '</span>% of male students are LEP.</span><br />';
                                        $('#tdLEP_ByRace').append(txt);
                                    }, 0);
                                }
                            });
                        });
                    }
                    catch (e) {
                        $('#container' + containerName).html('There was an error when attempting to retrieve your data. ');
                        return;
                    }
                }
            },
            complete: function () {
            }
        });


    },
    //#endregion LEP Summary ******************************************************************************************************

    buildPreschoolEligibility: function (containerName) {
        var sData = MiscData.Table;
        $.get('../Templates/PreschoolEligibility.tmpl.htm', function (template) {
            $.tmpl(template, sData).appendTo('#A_' + containerName);
        });
    },
    buildLeaCharacteristicsWAdditional: function (containerName, Is_Grouped_Side_by_Side, Metric_Count, extraFunction) {
        var showThisSection = true;
        disregardRegularPrintingRules = true; // we don't want the system to automatically set where our page breaks are with printing. We do it ourself.

        if (extraFunction != null) {
            showThisSection = eval(extraFunction);
        }
        if (showThisSection == false) {// if we passed a function to check weather this is to be shown or not.
            $('#container' + containerName).hide();
            return;
        }
        var TemplateName = '';
        if (app.requestQuerystring('t') == 's') {
            TemplateName = '../Templates/CharacteristicsSchool.tmpl.htm';
        }
        else {
            TemplateName = '../Templates/CharacteristicsDistrict.tmpl.htm';
        }

        var json = ProfileData.Table;
        json[0].ShowAdditionalCharacteristics = true;

        $.get(TemplateName, function (template) {
            $.tmpl(template, json).appendTo('#A_' + containerName);
        });
    },
    buildPathwaysToCareerReadiness: function (containerName, Is_Grouped_Side_by_Side, Metric_Count, extraFunction) {
        var showThisSection = true;
        if (extraFunction != null) {
            showThisSection = eval(extraFunction);
        }
        if (showThisSection == false) {// if we passed a function to check weather this is to be shown or not.
            $('#container' + containerName).hide();
            return;
        }

        sUrl = '../../handler/AjaxHandler.ashx?cmd=getDataString_By_ID_Survey_Year_Key&ID=' + entity_id + '&Survey_Year_Key=' + survey_year_key + '&sp=GetPathwaysToCareerReadiness&SchoolOrDistrict=' + IsSchoolOrDistrict;
        $.ajax({
            url: sUrl,
            type: "GET",
            processData: false,
            dataType: "html",
            async: true,
            success: function (Data) {
                if (Data == null) {
                    $('#container' + containerName).html('There is no data available for this survey year');
                    return;
                }
                else {
                    try {
                        var fullArray = Data.split('&~&');
                        var TotalEnrollmentArray = fullArray[0].split('~~');
                        var EarlyEnrollmentArray = fullArray[1].split('~~');
                        var GiftedTalentedArray = fullArray[2].split('~~');
                        var AlgebraIArray = fullArray[3].split('~~');
                        var RetentionArray = fullArray[4].split('~~');
                        var LEPArray = fullArray[5].split('~~');
                        var LEPData = { "PctTotalLEP": LEPArray[0], "PctPreSchoolLEP": LEPArray[1], "PREK_ALL": LEPArray[2], "PREK_DIS": LEPArray[3], "PREK_TITLE_1": LEPArray[4], "PREK_LOW_INCOME": LEPArray[5], "PREK_OTHER": LEPArray[6] };

                        $.get('../Templates/Pathways_College_Readiness.tmpl.htm', function (template) {

                            $.tmpl(template, LEPData).appendTo('#A_' + containerName);

                            app.buildPieChart(TotalEnrollmentArray[1], 'tdTotalEnrollment1', TotalEnrollmentArray[0], '', TotalEnrollmentArray[2])
                            app.buildPieChart(TotalEnrollmentArray[1], 'tdTotalEnrollment', TotalEnrollmentArray[0], '', TotalEnrollmentArray[2])
                            app.buildPieChart(TotalEnrollmentArray[1], 'tdTotalEnrollment2', TotalEnrollmentArray[0], '', TotalEnrollmentArray[2])
                            app.buildPieChart(EarlyEnrollmentArray[1], 'tdEarlyEnrollment', EarlyEnrollmentArray[0], '', EarlyEnrollmentArray[2])
                            app.buildPieChart(GiftedTalentedArray[1], 'tdGiftedTalented', GiftedTalentedArray[0], '', GiftedTalentedArray[2])
                            app.buildPieChart(AlgebraIArray[1], 'tdAlgebraI', AlgebraIArray[0], '', AlgebraIArray[2])
                            app.buildPieChart(RetentionArray[1], 'tdRetention', RetentionArray[0], '', RetentionArray[2])
                        });
                    }
                    catch (e) {
                        $('#container' + containerName).html('There was an error when attempting to retrieve your data. ');
                        return;
                    }
                }
            }
        });

    },
    adjustLegands: function () {
        if (PageContainsPieCharts == false) return;
        if ($.browser.msie == true && ($.browser.version).indexOf('7') != -1) {
            $('.highcharts-legend').each(function () {
                $(this).css('margin-top', '255px');
                var spans = $(this).find('span');
                var ctr = -20;

                var topArr = [];
                $(spans).each(function () {
                    var top = $(this).css("top");
                    if (topArr.indexOf(top) == -1)
                        topArr.push(top);
                });

                if (topArr.length == 1) {
                    $(spans).each(function () {
                        var left = $(this).css("left");
                        if (left == '30px') ctr += 20
                        $(this).css('top', ctr + 'px');
                        $(this).next('shape').css('top', ctr - 3 + 'px');
                    });
                }

            });
        }

    },
    buildDiscipline_Restraints_Bully: function (containerName, Is_Grouped_Side_by_Side, Metric_Count, extraFunction) {
        var showThisSection = true;
        if (extraFunction != null) {
            showThisSection = eval(extraFunction);
        }
        if (showThisSection == false) {// if we passed a function to check weather this is to be shown or not.
            $('#container' + containerName).hide();
            return;
        }

        sUrl = '../../handler/AjaxHandler.ashx?cmd=getDataString_By_ID_Survey_Year_Key&ID=' + entity_id + '&Survey_Year_Key=' + survey_year_key + '&sp=GetDiscipline_Restraints_Bully&SchoolOrDistrict=' + IsSchoolOrDistrict;
        $.ajax({
            url: sUrl,
            type: "GET",
            processData: false,
            dataType: "html",
            async: true,
            success: function (Data) {
                if (Data == null) {
                    $('#container' + containerName).html('There is no data available for this survey year');
                    return;
                }
                else {
                    try {
                        var fullArray = Data.split('&~&');
                        var TotalEnrollment = fullArray[0].split('~~');
                        var inSchoolSuspensions = fullArray[1].split('~~');
                        var outOfSchoolSuspensions = fullArray[2].split('~~');
                        var expulsions = fullArray[3].split('~~');

                        var SATArray = fullArray[4].split('~~');
                        var SATData = {
                            "IDEALaw": SATArray[0],
                            "NonIDEALaw": SATArray[1],
                            "TotalLaw": SATArray[2],
                            "IDEAArrest": SATArray[3],
                            "NonIDEAArrest": SATArray[4],
                            "TotalArrest": SATArray[5],
                            "IDEAEXP": SATArray[6],
                            "NonIDEAEXP": SATArray[7],
                            "TotalEXP": SATArray[8],
                            "InSchoolSusp504": SATArray[9],
                            "OutOfSchoolSusp504": SATArray[10],
                            "Expulsions504": SATArray[11],
                            "LEAID": ProfileData.Table[0].LEAID,
                            "HasSwornLawEnforcement": SATArray[12],
                            "CorpPunishment": SATArray[13]
                        };
                        //app.console_log(SATData);
                        $.get('../Templates/DisciplineRestraintsSeclusion.tmpl.htm', function (template) {
                            //$(template).appendTo('#A_' + containerName);
                            $.tmpl(template, SATData).appendTo('#A_' + containerName);
                            app.buildPieChart(TotalEnrollment[1], 'tdTotalDiscEnrollment', TotalEnrollment[0], '', TotalEnrollment[2])
                            app.buildPieChart(inSchoolSuspensions[1], 'tdInSchoolSuspensions', inSchoolSuspensions[0], '', inSchoolSuspensions[2])
                            app.buildPieChart(outOfSchoolSuspensions[1], 'tdOutOfSchoolSuspensions', outOfSchoolSuspensions[0], '', outOfSchoolSuspensions[2])
                            app.buildPieChart(expulsions[1], 'tdExpulsions', expulsions[0], '', expulsions[2]);
                        });
                    }
                    catch (e) {
                        $('#container' + containerName).html('There was an error when attempting to retrieve your data. ');
                        return;
                    }
                }
            }
        });

    },

    buildCareerReadiness: function (containerName, Is_Grouped_Side_by_Side, Metric_Count, extraFunction) {
        var showThisSection = true;
        if (extraFunction != null) {
            showThisSection = eval(extraFunction);
        }
        if (showThisSection == false) {// if we passed a function to check weather this is to be shown or not.
            $('#container' + containerName).hide();
            return;
        }

        sUrl = '../../handler/AjaxHandler.ashx?cmd=getDataString_By_ID_Survey_Year_Key&ID=' + entity_id + '&Survey_Year_Key=' + survey_year_key + '&sp=GetCareerReadiness&SchoolOrDistrict=' + IsSchoolOrDistrict;
        $.ajax({
            url: sUrl,
            type: "GET",
            processData: false,
            dataType: "html",
            async: true,
            success: function (Data) {
                if (Data == null) {
                    $('#container' + containerName).html('There is no data available for this survey year');
                    return;
                }
                else {
                    try {
                        var fullArray = Data.split('&~&');
                        var MathScienceTotalEnrollment = fullArray[0].split('~~');
                        var Calculus = fullArray[1].split('~~');
                        var Chemestry = fullArray[2].split('~~');
                        var Physics = fullArray[3].split('~~');
                        var TotalSAT = fullArray[4].split('~~');

                        var SATArray = fullArray[5].split('~~');
                        var SATData = {
                            "SATParticipants": SATArray[0],
                            "PctTotalLEP": SATArray[1],
                            "PctTotalLEPParticipants": SATArray[2],
                            "PctTotalIDEA": SATArray[3],
                            "PctTotalIDEAParticipants": SATArray[4],
                            "pctGenderEnrolled": SATArray[5],
                            "pctGenderParticipating": SATArray[6],
                            "ShowDualEnrollmentTable": SATArray[7],
                            "DualEnrollmentLabel": SATArray[8],
                            "DualEnrollment": SATArray[9],
                            "CreditRecoveryLabel": SATArray[10],
                            "CreditRecovery": SATArray[11]
                        };

                        $.get('../Templates/CollegeReadiness.tmpl.htm', function (template) {
                            //$(template).appendTo('#A_' + containerName);
                            $.tmpl(template, SATData).appendTo('#A_' + containerName);

                            app.buildPieChart(MathScienceTotalEnrollment[1], 'tdMathScienceTotalEnrollment', MathScienceTotalEnrollment[0], '', MathScienceTotalEnrollment[2]);
                            app.buildPieChart(Calculus[1], 'tdCalculus', Calculus[0], '', Calculus[2]);
                            app.buildPieChart(Chemestry[1], 'tdChemestry', Chemestry[0], '', Chemestry[2]);
                            app.buildPieChart(Physics[1], 'tdPhysics', Physics[0], '', Physics[2]);
                            app.buildPieChart(MathScienceTotalEnrollment[1], 'tdTotalEnrolledC', MathScienceTotalEnrollment[0], '', MathScienceTotalEnrollment[2]);
                            app.buildPieChart(TotalSAT[1], 'tdTotalSAT', TotalSAT[0], '', TotalSAT[2]);
                        });
                    }
                    catch (e) {
                        $('#container' + containerName).html('There was an error when attempting to retrieve your data. ');
                        return;
                    }
                }
            }
        });

    },
    buildGifted_talented: function (containerName, Is_Grouped_Side_by_Side, Metric_Count, extraFunction) {
        var showThisSection = true;
        if (extraFunction != null) {
            showThisSection = eval(extraFunction);
        }
        if (showThisSection == false) {// if we passed a function to check weather this is to be shown or not.
            $('#container' + containerName).hide();
            return;
        }

        sUrl = '../../handler/AjaxHandler.ashx?cmd=getDataString_By_ID_Survey_Year_Key&ID=' + entity_id + '&Survey_Year_Key=' + survey_year_key + '&sp=GetGiftedTalented&SchoolOrDistrict=' + IsSchoolOrDistrict;
        $.ajax({
            url: sUrl,
            type: "GET",
            processData: false,
            dataType: "html",
            async: true,
            success: function (Data) {
                if (Data == null) {
                    $('#container' + containerName).html('There is no data available for this survey year');
                    return;
                }
                else {
                    try {
                        var fullArray = Data.split('&~&');
                        var TotalEnrollment = fullArray[0].split('~~');
                        var GT = fullArray[1].split('~~');

                        var SATArray = fullArray[2].split('~~');
                        var SATData = {
                            "GTParticipants": SATArray[0],
                            "PctTotalLEP": SATArray[1],
                            "PctTotalLEPParticipants": SATArray[2],
                            "PctTotalIDEA": SATArray[3],
                            "PctTotalIDEAParticipants": SATArray[4],
                            "pctGenderEnrolled": SATArray[5],
                            "pctGenderParticipating": SATArray[6]
                        };

                        $.get('../Templates/GiftedTalented.tmpl.htm', function (template) {
                            //$(template).appendTo('#A_' + containerName);
                            $.tmpl(template, SATData).appendTo('#A_' + containerName);
                            app.buildPieChart(TotalEnrollment[1], 'tdFull_TotalEnrollment', TotalEnrollment[0], '', TotalEnrollment[2])
                            app.buildPieChart(GT[1], 'tdGiftedTalented', GT[0], '', GT[2])

                        });
                    }
                    catch (e) {
                        $('#container' + containerName).html('There was an error when attempting to retrieve your data. ');
                        return;
                    }
                }
            }
        });
    },
    buildSchoolProfile: function (Section_ID, Is_Grouped_Side_by_Side, Metric_Count, extraFunction) {
        if (extraFunction != null) {
            showThisSection = eval(extraFunction);
        }
        if (ProfileData == null) {
            $('#container' + Section_ID).html('There is no data available for this school during this survey year');
            return;
        }
        $.get('../Templates/schoolProfile.tmpl.htm', function (template) {
            $.tmpl(template, ProfileData.Table).appendTo('#A_' + Section_ID);
            //TODO - make sure this is correct
            var incomplete = ProfileData.Table[0].Incomplete;
            if (incomplete == 'B') {
                //$('.imgCkBox').hide();
                $('#td-profile-right').html('<tr><td colspan="3" style="text-align:center;"><h3>' + app.IncompleteMessages[incomplete].msg + '</h3></td></tr>').removeClass('tblAltRows');
                $('.AvailableChartMetrics').each(function (i, e) { // we don't want to prevent the basic enrollment data from being displayed.
                    if (i > 0) {
                        $(this).parent().prepend('<td style="vertical-align:top;"><center><br><h3>' + app.IncompleteMessages[incomplete].msg + '</h3></center></td>');
                        $(this).hide();
                    };
                });
            }
            $.get('../Templates/EntityProfileMenu.tmpl.htm', function (tmp) {
                $.tmpl(tmp, ProfileData.Table1).appendTo('#tdEntityProfileMenu');
                $('#MenuItemsTemplate').tmpl(ProfileData.Table2).appendTo($('#tbodyEntityProfileMenu'));
                $('.tblAltRows tr:even').addClass('even').removeClass('odd');
                $('.tblAltRows tr:odd').addClass('odd').removeClass('even');
                $('.MenuMetricsTrHidden').hide();
            });
            $('.number').each(function () {
                $(this).text(app.formatWithCommas($(this).text()));
            });
            $('<input id="EntityProfileSection_ID" value="' + Section_ID + '" type="hidden">').appendTo($('#ul_containerEntityProfile'));
            return true;
        });

    },
    buildDistrictProfile: function (Section_ID, Is_Grouped_Side_by_Side, Metric_Count, extraFunction) {
        if (extraFunction != null) {
            showThisSection = eval(extraFunction);
        }
        if (ProfileData == null) {
            $('#container' + Section_ID).html('There is no data available for this district during this survey year');
            return;
        }

        $.get('../Templates/districtProfile.tmpl.htm', function (template) {
            $.tmpl(template, ProfileData.Table).appendTo('#A_' + Section_ID);
            $.get('../Templates/EntityProfileMenu.tmpl.htm', function (tmp) {
                $.tmpl(tmp, ProfileData.Table1).appendTo('#tdEntityProfileMenu');
                $('#MenuItemsTemplate').tmpl(ProfileData.Table2).appendTo($('#tbodyEntityProfileMenu'));
                $('.tblAltRows tr:even').addClass('even').removeClass('odd');
                $('.tblAltRows tr:odd').addClass('odd').removeClass('even');
                $('.MenuMetricsTrHidden').hide();
            });
            $('.number').each(function () {
                $(this).text(app.formatWithCommas($(this).text()));
            });
            $('<input id="EntityProfileSection_ID" value="' + Section_ID + '" type="hidden">').appendTo($('#ul_containerEntityProfile'));
            var incomplete = ProfileData.Table[0].Incomplete;
            if (incomplete == 'B') {
                $('#td-profile-right').html('<tr><td colspan="3" style="text-align:center;"><h3>' + app.IncompleteMessages[incomplete].msg + '</h3></td></tr>').removeClass('tblAltRows');
                $('.AvailableChartMetrics').each(function (i, e) { // we don't want to prevent the basic enrollment data from being displayed.
                    if (i > 0) {
                        $(this).parent().prepend('<td style="vertical-align:top;"><center><br><h3>' + app.IncompleteMessages[incomplete].msg + '</h3></center></td>');
                        $(this).hide();
                    };
                });
            }
            return true;
        });
    },
    showExtendedDistrictProfile: function (section) {
        //Dis504 DisIDEA LEP Desegregation GED SingleSex Athletics HarassmentBullying PreK_K AbilityGrouping
        //alert(section)
    },
    showAdditionalProfileInfo: function () {
        if (IsFullProfile) {
            IsFullProfile = false;
        }
        else {
            IsFullProfile = true;
        }
        var Section_ID = $('#EntityProfileSection_ID').val();
        $('#ul_containerEntityProfile').remove();
        app.buildSchoolProfile(Section_ID);
    },
    weArePrinting: function () {
        var loc = window.document.location.toString();
        if (loc.indexOf('print') != -1) return true;
        return false;
    },

    Specialreportmenu: function (report) {
        $('#printIcon').unbind('click').attr('href', '/SpecialReports').html('<img src="../../images/DataAnalysis_18x20px.png" alt="Special Reports" height="12" /><span>&nbsp;</span>Special Reports');
        $('#lnkRet').attr('href', 'DataAnalysisTools/DataSetBuilder?Report=' + Report).html('<img src="../../images/back_18x20px.png" alt="Back to Report Home" height="12" />&nbsp;Report&nbsp;Home');
        $('#lnkRet').attr('title', 'Back to Report Home');
        $('.AvailableMetrics').remove();
        $('#ul_menuReports').hide();
        $('#spanBreadCrumb').html('');
    },

    buildPage: function (Data) {
        //app.console_log(Data)
        app.isSchoolOrDistrictPage = app.requestQuerystring('t').toLowerCase();
        var sData = Data.Table;
        var areWePrinting = app.weArePrinting();
        $('.Page_Title').text(sData[0].Page_Title);
        app.DistrictStartPageID = PageInfo.Table5[0].DistrictStartPageID;
        app.SchoolStartPageID = PageInfo.Table6[0].SchoolStartPageID;
        app.thisPageId = app.requestQuerystring('pid');

        app.profileIncompleteValue = ProfileData.Table[0].Incomplete;

        var Page_Subtitle = sData[0].Page_Subtitle;
        if (Page_Subtitle != null) {
            var pgSubTitle = '<p><span class="Page_Subtitle">' + Page_Subtitle + '</span></p>';
            $('.PageSubTitle').html(pgSubTitle);
        }

        var Left_Header = sData[0].Left_Header;
        var Right_Header = sData[0].Right_Header;
        if (Left_Header != null || Right_Header != null) {
            $('#pageHeadersTemplate').tmpl(sData).appendTo($('#divSectionHeaders'));
        }
        else {
            $('#divSectionHeaders').hide();
        }

        if (sData[0].Is_Start_Page == true) {
            $.cookie('StartPageID', sData[0].Page_ID, { path: '/' });
        }

        if (sData[0].Show_Header == true) {
            $('#divHeader').show();
        }
        else {
            $('#divHeader').hide();
        }
        // add the sections (accordians) to the page
        $('#accordianTemplate').tmpl(Data.Table1).appendTo($('#divDocumentContent'));
        app.DataTableSectionInfo = Data.Table1; // used so we can hide sections if they have an incomplete status of "D". Used in the placeDataInMetrics function above.
        $(Data.Table3).each(function (i, e) {
            var Section_ID = Data.Table3[i].Section_ID;
            var divThatHoldsTheMenu = 'container' + Section_ID;
            $('#chartTemplate').tmpl(Data.Table3[i]).appendTo($('#' + divThatHoldsTheMenu));
            var show_metric_menu = $('#container' + Section_ID).attr('show_metric_menu');
            if (areWePrinting == true || show_metric_menu == 'false') {
                $('#td_' + Section_ID).hide();
            }
        });
        //this is so we can highlight the menu items for the page we're on.
        var pageIDArray = [];
        $(Data.Table2).each(function (i, j) {
            pageIDArray.push($(j)[0].Page_ID);
        });

        //        // we do the following because there is always suppressed data on the Summary of Select Facts page during and after survey year key 6.
        //        var syk = app.requestQuerystring('syk');
        //        if ((app.DistrictStartPageID == app.thisPageId || app.SchoolStartPageID == app.thisPageId) && areWePrinting == false && eval(syk) >= 6) {
        //            app.doWeNeedToShowSuppressionMessage = true;
        //            app.showSuppressionExplaination(2);

        //        }

        if (areWePrinting == false) {
            if (sData[0].Show_Menu == false) {
                $("#container").layout({
                    west__initClosed: true,
                    west__spacing_closed: 0
                });
            }
            else {
                $('#container').layout();
            }

            if (sData[0].Show_Breadcrumbs == true) {
                $('#spanBreadCrumb').show();
            }
            else {
                $('#spanBreadCrumb').hide();
            }
            // add the menu items to the menu
            $(Data.Table4).each(function (i, e) {
                var Limit_to_Grades = Data.Table4[i].Limit_to_Grades;
                //app.console_log(Limit_to_Grades)
                var itemIsViewable = app.showOnlyTheseGradeLevels(Limit_to_Grades);
                if (itemIsViewable) {
                    var divThatHoldsTheMenu = Data.Table4[i].Section_ID + '_AvailableMetrics';
                    $('#MenuItemsTemplate').tmpl(Data.Table4[i]).appendTo($('#' + divThatHoldsTheMenu));
                }
                else {

                }

            });
            $('.MenuMetricsTrHidden').hide();
            $('.MenuMetricsTr3').each(function (i, e) {
                var thisLinksID = $(e).attr('id');
                var splitArr = thisLinksID.split('_')
                var thisLinksPageID = splitArr[2];
                if (pageIDArray.indexOf(parseInt(thisLinksPageID)) != -1) {
                    $('#span_' + thisLinksPageID).addClass('selectedLink').prop("onclick", null).removeClass('goToNewControl');
                    return false;
                }
            });

            $('.MenuMetricsTr2').each(function (i, e) {
                var thisLinksID = $(e).attr('id');
                var splitArr = thisLinksID.split('_')
                var thisLinksPageID = splitArr[2];
                if (pageIDArray.indexOf(parseInt(thisLinksPageID)) != -1) {
                    $('#span_' + thisLinksPageID).addClass('selectedLink').prop("onclick", null).removeClass('goToNewControl');
                    return false;
                }
            });

            $('.MenuMetricsTrHidden').each(function (i, e) {
                var thisLinksID = $(e).attr('id');
                var splitArr = thisLinksID.split('_')
                var thisLinksPageID = splitArr[2];
                var thisLinksParentTr = splitArr[3];
                if (pageIDArray.indexOf(parseInt(thisLinksPageID)) != -1) {
                    var img = $('#img_' + thisLinksParentTr);
                    app.toggleMenuChildren(thisLinksParentTr, img);
                    $('#span_' + thisLinksPageID).addClass('selectedLink').prop("onclick", null).removeClass('goToNewControl');
                    return false;
                }
            });
        }
        else { // we are printing
            $("#container").layout({
                west__initClosed: true,
                west__spacing_closed: 0,
                north__initClosed: true,
                north__spacing_closed: 0
            });
            $('.upDn').hide();
            $('#printIcon').hide();
            $('button').hide();
        }
        var executeCount = $('.execJS').length; //PageInfo.Table1.length
        var jsCounter = 0;
        $('.execJS').each(function () {
            var js = $(this).attr('js');
            eval(js);
            if (areWePrinting) {
                jsCounter += 1;
                if (jsCounter == executeCount) {
                    startPageCompletionCount();
                }
            }
        });

        if (areWePrinting) {
            //adjustPrintableAreaSizeIfPrintPage();
            printChartOrTable = app.requestQuerystring('ct');
            printPercentOrCount = app.requestQuerystring('pc');
            $('#fs-top-nav-links').hide();
            if (printChartOrTable == 'c') {
                IsViewingCharts = true;
            }
            else {
                WeAreReadyToPrint = false; // we don't want to do this just yet. We need to change the page.
                app.setDefaultToCount();
            }
        }
        app.handlePageChange();
        // display message if no sections are visible
        var bShow = true;
        $(Data.Table3).each(function (i, e) {
            var Section_ID = Data.Table3[i].Section_ID;
            var visibility = $('#container' + Section_ID).is(":visible");
            if (visibility == true) {
                bShow = false;
                return false;
            }
        });
        if (bShow == true)
            $('#msgNoInfo').html('No data to display');
    },
    showStaffingAndFinance: function () {
        var sData = MiscData.Table;
        $.get('Templates/StaffingAndFinanceSchool.tmpl.htm', function (template) {
            var t = $('<table style="width:100%">');
            var tr = $('<tr>');
            var td = $('<td id="AContent_8">');
            $(td).appendTo(tr);
            $(tr).appendTo(t);
            $(t).appendTo('#A_8');

            $.tmpl(template, sData).appendTo('#AContent_8');
            $('.tblAltRows tr:even').addClass('even').removeClass('odd');
            $('.tblAltRows tr:odd').addClass('odd').removeClass('even');
        });
    },
    showSchoolExpenditures: function (containerName) {
        $.get('../Templates/SchoolExpenditures.tmpl.htm', function (template) {
            $.tmpl(template, null).appendTo('#A_' + containerName);
        });
    },
    /*===========================================
    * set options as selected for <select> element
    * parameters:
    * sender - source <select> element; pass empty string when calling from btnMap
    * ddl - target <select> element
    * commaStr - list of State Abbr passed by map; pass empty string when calling from region <select>
    ==============================================*/
    SelectStates: function (sender, ddl, commaStr) {
        // clean states selection
        $('#' + ddl + ' option').prop('selected', false);
        // return list of states according to selected regions

        var thisVal;
        if (commaStr === '') {
            thisVal = $('#' + sender).val();
        } else {
            thisVal = commaStr;
        }

        // convert to array
        if (thisVal) {
            var arSelectedStates = thisVal.toString().split(",");
            // highlight states for each selected region
            $(arSelectedStates).each(function (i, v) {
                $('#' + ddl + ' option[value=' + v + ']').prop('selected', true);
            });
        }

    },
    hideBtnChartsToTable: function () {
        $('#btnChartsToTable').hide();
        $('#btnPercentages').show();
        printChartOrTable = 't';

    },
    setDefaultToCount: function () {
        if (app.requestQuerystring('ct') === 'c') return; // if this is a print page and the ct (chart/table) param === 'c' (chart) then we bypass this function
        setTimeout(function () {
            var pOrC = app.requestQuerystring('pc')
            var isCount = pOrC === 'p' ? false : true;
            app.convertChartsToTables(isCount);
        }, 2000);
    },
    ClearRegion: function (ddl) {
        // clean states selection
        $('#' + ddl + ' option').prop('selected', false);

    },
    printPage: function () {
        var loc, printWindow;
        $.ajax({
            url: "../../Templates/blank.htm",
            beforeSend: function () {
                $('#pleaseWaitText').text('Processing...');
                $('#divPleaseWaitOnLoad').show();
                loc = window.document.location.toString() + '&print=1&ct=' + printChartOrTable + '&pc=' + printPercentOrCount; //printChartOrTable = 'c', printPercentOrCount = 'c';

                loc = loc.replace('Page?', 'Page/PrintPage?');
                printWindow = window.open(loc, 'Print_blank', 'width=5px,height=5px,channelmode=0,location=0,menubar=0,resizable=1,scrollbars=0,status=0,titlebar=0,toolbar=0');
                printWindow.focus();
            },
            complete: function () {
                var delayTimeClosePrintWin = 2000;
                var printTimeClosePrintWinChrome = 60000;
                $('#pleaseWaitText').text('Printing...');

                var printWinFn = function () {
                    var tc = false;
                    if (printWindow != null) {
                        if (printWindow.closed) {
                            $('#divPleaseWaitOnLoad').hide();
                            $('#pleaseWaitText').text('Loading...');
                            return false;
                        }
                    }
                    else {
                        $('#divPleaseWaitOnLoad').hide();
                        $('#pleaseWaitText').text('Loading...');
                        return false;
                    }

                    tc = printWindow.WeAreReadyToPrint;
                    if (tc === true) {
                        printWindow.print();
                        if ($.browser.webkit === true) { // GOOGLE chrome
                            $('#divPleaseWaitOnLoad').hide();
                            $('#pleaseWaitText').text('Loading...');
                            setTimeout(function () {
                                printWindow.close();
                            }, printTimeClosePrintWinChrome);
                        }
                        else {
                            setTimeout(function () {
                                printWindow.close();
                                $('#divPleaseWaitOnLoad').hide();
                                $('#pleaseWaitText').text('Loading...');
                            }, delayTimeClosePrintWin);
                        }

                    }
                    else if (tc === 'fail') {
                        alert('There was an error. Your page cannot be printed.');
                        printWindow.close();
                        $('#divPleaseWaitOnLoad').hide();
                        $('#pleaseWaitText').text('Loading...');
                        $('#printIcon').hide();
                        $('#btnPrintContent').hide();
                    }
                    else {
                        setTimeout(function () {
                            printWinFn();
                        }, 1000)
                    }
                }

                setTimeout(function () {
                    printWinFn();
                }, 1000);
            }
        });
    }
};

var app = new App();
//**********************************************************************************************************************
//**********************************************************************************************************************
//**********************************************************************************************************************
//**********************************************************************************************************************
//**********************************************************************************************************************

function startPageCompletionCount() {
    $(document).ajaxStop(function () {
        setTimeout(function () {
            app.adjustLegands();
            WeAreReadyToPrint = true;
        }, 2000);
    });
}

if (typeof String.prototype.trim !== 'function') {
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, '');
    }
}
//**********************************************************************************************************************
//**********************************************************************************************************************
//**********************************************************************************************************************
//**********************************************************************************************************************
//**********************************************************************************************************************
// a jQuery addition that prevents anything but numbers from being keyed in.
// usage: $("#SSN").ForceNumericOnly();
jQuery.fn.ForceNumericOnly =
function () {
	return this.each(function () {
		$(this).keydown(function (e) {
			var key = e.charCode || e.keyCode || 0;
			// allow backspace, tab, delete, arrows, numbers and keypad numbers ONLY 
			return (
				key == 8 ||
				key == 9 ||
				key == 46 ||
				(key >= 37 && key <= 40) ||
				(key >= 48 && key <= 57) ||
				(key >= 96 && key <= 105));
		})
	})
};

/// <summary>
/// Returns the max zOrder in the document (no parameter)
/// Sets max zOrder by passing a non-zero number
/// which gets added to the highest zOrder.
/// </summary>    
/// <param name="opt" type="object">
/// inc: increment value, 
/// group: selector for zIndex elements to find max for
/// </param>
/// <returns type="jQuery" />
jQuery.fn.maxZIndex = function (opt) {

	var def = { inc: 10, group: "*" };
	$.extend(def, opt);
	var zmax = 0;
	$(def.group).each(function () {
		var cur = parseInt($(this).css('z-index'));
		zmax = cur > zmax ? cur : zmax;
	});
	if (!this.jquery)
		return zmax;

	return this.each(function () {
		zmax += def.inc;
		$(this).css("z-index", zmax + 1);
	});
};

jQuery.fn.lowerZIndex = function (opt) {

	var def = { inc: 10, group: "*" };
	$.extend(def, opt);
	var zmax = 0;
	$(def.group).each(function () {
		var cur = parseInt($(this).css('z-index'));
		zmax = cur > zmax ? cur : zmax;
	});
	if (!this.jquery)
		return zmax;

	return this.each(function () {
		zmax += def.inc;
		$(this).css("z-index", zmax - 1);
	});
};

jQuery.fn.validDate = function (value) {
	var validformat = /^\d{1,2}\/\d{1,2}\/\d{4}$/ //Basic check for format validity
	var returnval = false
	if (!validformat.test(value)) {
		return false;
	}
	else { //Detailed check for valid date ranges
		var monthfield = value.split("/")[0]
		var dayfield = value.split("/")[1]
		var yearfield = value.split("/")[2]
		var dayobj = new Date(yearfield, monthfield - 1, dayfield)
		if ((dayobj.getMonth() + 1 != monthfield) || (dayobj.getDate() != dayfield) || (dayobj.getFullYear() != yearfield)) {
			return false;
		}
		else {
			return true;
		}
	}
};

/**
*  Version 2.1
*      -Contributors: "mindinquiring" : filter to exclude any stylesheet other than print.
*  Tested ONLY in IE 8 and FF 3.6. No official support for other browsers, but will
*      TRY to accomodate challenges in other browsers.
*  Example:
*      Print Button: <div id="print_button">Print</div>
*      Print Area  : <div class="PrintArea"> ... html ... </div>
*      Javascript  : <script>
*                       $("div#print_button").click(function(){
*                           $("div.PrintArea").printArea( [OPTIONS] );
*                       });
*                     </script>
*  options are passed as json (json example: {mode: "popup", popClose: true, popHt: 600, popWd: 500, popTitle: "Profile"})
*
*  {OPTIONS} | [type]    | (default), values      | Explanation
*  --------- | --------- | ---------------------- | -----------
*  @mode     | [string]  | ("iframe"),"popup"     | printable window is either iframe or browser popup
*  @popHt    | [number]  | (500)                  | popup window height
*  @popWd    | [number]  | (400)                  | popup window width
*  @popX     | [number]  | (500)                  | popup window screen X position
*  @popY     | [number]  | (500)                  | popup window screen Y position
*  @popTitle | [string]  | ('')                   | popup window title element
*  @popClose | [boolean] | (false),true           | popup window close after printing
*  @strict   | [boolean] | (undefined),true,false | strict or loose(Transitional) html 4.01 document standard or undefined to not include at all (only for popup option)
*/
(function ($) {
    var counter = 0;
    var modes = { iframe: "iframe", popup: "popup" };
    var defaults = { mode: modes.iframe,
        popHt: 500,
        popWd: 400,
        popX: 200,
        popY: 200,
        popTitle: '',
        popClose: false
    };

    var settings = {}; //global settings

    $.fn.printArea = function (options) {
        $.extend(settings, defaults, options);

        counter++;
        var idPrefix = "printArea_";
        $("[id^=" + idPrefix + "]").remove();
        var ele = getFormData($(this));

        settings.id = idPrefix + counter;

        var writeDoc;
        var printWindow;

        switch (settings.mode) {
            case modes.iframe:
                var f = new Iframe();
                writeDoc = f.doc;
                printWindow = f.contentWindow || f;
                break;
            case modes.popup:
                printWindow = new Popup();
                writeDoc = printWindow.doc;
        }

        writeDoc.open();
        writeDoc.write(docType() + "<html>" + getHead() + getBody(ele) + "</html>");
        writeDoc.close();

        printWindow.focus();
        printWindow.print();

        if (settings.mode == modes.popup && settings.popClose)
            printWindow.close();
    }

    function docType() {
        if (settings.mode == modes.iframe || !settings.strict) return "";

        var standard = settings.strict == false ? " Trasitional" : "";
        var dtd = settings.strict == false ? "loose" : "strict";

        return '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">';
    }

    function getHead() {
        var head = "<head><title>" + settings.popTitle + "</title>";
        $(document).find("link")
			.filter(function () {
			    return $(this).prop("rel").toLowerCase() == "stylesheet";
			})
			.filter(function () { // this filter contributed by "mindinquiring"
			    var media = $(this).prop("media");
			    return (media.toLowerCase() == "" || media.toLowerCase() == "print")
			})
			.each(function () {
			    head += '<link type="text/css" rel="stylesheet" href="' + $(this).attr("href") + '" >\n';
			});
        head += "</head>";
        return head;
    }

    function getBody(printElement) {
        var body = $(printElement).clone(true, true).find('td.AvailableMetrics').hide().end().find('button').hide().end().find('#printIcon').hide().end();
        $(body).find("SCRIPT").each(function (i, e) {
            $(e).remove();
        });
        return '<body><div class="' + $(printElement).attr("class") + '">' + $(body).html() + '</div></body>';
    }

    function getFormData(ele) {
        $("input,select,textarea", ele).each(function () {
            // In cases where radio, checkboxes and select elements are selected and deselected, and the print
            // button is pressed between select/deselect, the print screen shows incorrectly selected elements.
            // To ensure that the correct inputs are selected, when eventually printed, we must inspect each dom element
            var type = $(this).attr("type");
            if (type == "radio" || type == "checkbox") {
                if ($(this).is(":not(:checked)")) this.removeAttribute("checked");
                else this.setAttribute("checked", true);
            }
            else if (type == "text")
                this.setAttribute("value", $(this).val());
            else if (type == "select-multiple" || type == "select-one")
                $(this).find("option").each(function () {
                    if ($(this).is(":not(:selected)")) this.removeAttribute("selected");
                    else this.setAttribute("selected", true);
                });
            else if (type == "textarea") {
                var v = $(this).attr("value");
                if ($.browser.mozilla) {
                    if (this.firstChild) this.firstChild.textContent = v;
                    else this.textContent = v;
                }
                else this.innerHTML = v;
            }
        });

        return ele;
    }

    function Iframe() {
        var frameId = settings.id;
        var iframeStyle = 'border:0;position:absolute;width:0px;height:0px;left:0px;top:0px;';
        var iframe;

        try {
            iframe = document.createElement('iframe');
            document.body.appendChild(iframe);
            $(iframe).attr({ style: iframeStyle, id: frameId, src: "" });
            iframe.doc = null;
            iframe.doc = iframe.contentDocument ? iframe.contentDocument : (iframe.contentWindow ? iframe.contentWindow.document : iframe.document);
        }
        catch (e) { throw e + ". iframes may not be supported in this browser."; }

        if (iframe.doc == null) throw "Cannot find document.";

        return iframe;
    }

    function Popup() {
        var windowAttr = "location=no,statusbar=no,directories=no,menubar=no,titlebar=no,toolbar=no,dependent=no";
        windowAttr += ",width=" + settings.popWd + ",height=" + settings.popHt;
        windowAttr += ",resizable=yes,screenX=" + settings.popX + ",screenY=" + settings.popY + ",personalbar=no,scrollbars=no";

        var newWin = window.open("", "_blank", windowAttr);

        newWin.doc = newWin.document;

        return newWin;  
    }
})(jQuery);


/* jQuery timepicker
* replaces a single text input with a set of pulldowns to select hour, minute, and am/pm
*
* Copyright (c) 2007 Jason Huck/Core Five Creative (http://www.corefive.com/)
* Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) 
* and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
*
* Version 1.0
*/
(function ($) {
	jQuery.fn.timepicker = function () {
		this.each(function () {
			// get the ID and value of the current element
			var i = this.id;
			var v = $(this).val();

			// the options we need to generate
			var hrs = new Array('01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12');
			var mins = new Array('00', '15', '30', '45');
			var ap = new Array('AM', 'PM');

			// default to the current time
			var d = new Date;
			var h = d.getHours();
			var m = d.getMinutes();
			var p = (h >= 12 ? 'PM' : 'AM');

			// adjust hour to 12-hour format
			if (h > 12) h = h - 12;

			// round minutes to nearest quarter hour
			for (mn in mins) {
				if (m <= parseInt(mins[mn])) {
					m = parseInt(mins[mn]);
					break;
				}
			}

			// increment hour if we push minutes to next 00
			if (m > 45) {
				m = 0;

				switch (h) {
					case (11):
						h += 1;
						p = (p.toUpperCase() === 'AM' ? 'PM' : 'AM');
						break;

					case (12):
						h = 1;
						break;

					default:
						h += 1;
						break;
				}
			}

			// override with current values if applicable
			if (v.length === 7) {
				h = parseInt(v.substr(0, 2));
				m = parseInt(v.substr(3, 2));
				p = v.substr(5);
			}

			// build the new DOM objects
			var output = '';

			output += '<select  id="h_' + i + '" class="h timepicker">';
			for (hr = 0; hr < hrs.length; hr++) {
				output += '<option value="' + hrs[hr] + '"';
				if (parseInt(hrs[hr]) === h) output += ' selected';
				output += '>' + hrs[hr] + '</option>';
			}
			output += '</select>';

			output += '<select  id="m_' + i + '" class="m timepicker">';
			for (mn = 0; mn < mins.length; mn++) {
				output += '<option value="' + mins[mn] + '"';
				if (parseInt(mins[mn]) === m) output += ' selected';
				output += '>' + mins[mn] + '</option>';
			}
			output += '</select>';

			output += '<select  id="p_' + i + '" class="p timepicker">';
			for (pp = 0; pp < ap.length; pp++) {
				output += '<option value="' + ap[pp] + '"';
				if (ap[pp] === p) output += ' selected';
				output += '>' + ap[pp] + '</option>';
			}
			output += '</select>';
			// hide original input and append new replacement inputs
			$(this).attr('style', 'display:none').after(output);
		});

		$('select.timepicker').change(function () {
			var i = this.id.substr(2);
			var h = $('#h_' + i).val();
			var m = $('#m_' + i).val();
			var p = $('#p_' + i).val();
			var v = h + ':' + m + p;
			$('#' + i).val(v);
		});

		return this;
	};
})(jQuery);


/*
* Date Format 1.2.3
* (c) 2007-2009 Steven Levithan <stevenlevithan.com>
* MIT license
*
* Includes enhancements by Scott Trenda <scott.trenda.net>
* and Kris Kowal <cixar.com/~kris.kowal/>
*
* Accepts a date, a mask, or a date and a mask.
* Returns a formatted version of the given date.
* The date defaults to the current date/time.
* The mask defaults to dateFormat.masks.default.
*/

var dateFormat = function () {
	var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
			val = String(val);
			len = len || 2;
			while (val.length < len) val = "0" + val;
			return val;
		};

	// Regexes and supporting functions are cached through closure
	return function (date, mask, utc) {
		var dF = dateFormat;

		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
		if (arguments.length === 1 && Object.prototype.toString.call(date) === "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}

		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date(date) : new Date;
		if (isNaN(date)) throw SyntaxError("invalid date");

		mask = String(dF.masks[mask] || mask || dF.masks["default"]);

		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}

		var _ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
				d: d,
				dd: pad(d),
				ddd: dF.i18n.dayNames[D],
				dddd: dF.i18n.dayNames[D + 7],
				m: m + 1,
				mm: pad(m + 1),
				mmm: dF.i18n.monthNames[m],
				mmmm: dF.i18n.monthNames[m + 12],
				yy: String(y).slice(2),
				yyyy: y,
				h: H % 12 || 12,
				hh: pad(H % 12 || 12),
				H: H,
				HH: pad(H),
				M: M,
				MM: pad(M),
				s: s,
				ss: pad(s),
				l: pad(L, 3),
				L: pad(L > 99 ? Math.round(L / 10) : L),
				t: H < 12 ? "a" : "p",
				tt: H < 12 ? "am" : "pm",
				T: H < 12 ? "A" : "P",
				TT: H < 12 ? "AM" : "PM",
				Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
				S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};

		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
} ();

// Some common format strings
dateFormat.masks = {
	"default": "ddd mmm dd yyyy HH:MM:ss",
	shortDate: "m/d/yy",
	standard: "mm/dd/yyyy",
	mediumDate: "mmm d, yyyy",
	longDate: "mmmm d, yyyy",
	fullDate: "dddd, mmmm d, yyyy",
	shortTime: "h:MM TT",
	mediumTime: "h:MM:ss TT",
	longTime: "h:MM:ss TT Z",
	isoDate: "yyyy-mm-dd",
	isoTime: "HH:MM:ss",
	isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
	dayNames: [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
	],
	monthNames: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	]
};

// IE doesn't have indexOf method so we add it here
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function (elt) {
		var len = this.length;

		var from = Number(arguments[1]) || 0;
		from = (from < 0)
		 ? Math.ceil(from)
		 : Math.floor(from);
		if (from < 0)
			from += len;

		for (; from < len; from++) {
			if (from in this &&
		  this[from] === elt)
				return from;
		}
		return -1;
	};
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

/*!
* jQuery replaceText - v1.1 - 11/21/2009
* http://benalman.com/projects/jquery-replacetext-plugin/
* 
* Copyright (c) 2009 "Cowboy" Ben Alman
* Dual licensed under the MIT and GPL licenses.
* http://benalman.com/about/license/
*/

// Script: jQuery replaceText: String replace for your jQueries!
//
// *Version: 1.1, Last updated: 11/21/2009*
// 
// Project Home - http://benalman.com/projects/jquery-replacetext-plugin/
// GitHub       - http://github.com/cowboy/jquery-replacetext/
// Source       - http://github.com/cowboy/jquery-replacetext/raw/master/jquery.ba-replacetext.js
// (Minified)   - http://github.com/cowboy/jquery-replacetext/raw/master/jquery.ba-replacetext.min.js (0.5kb)
// 
// About: License
// 
// Copyright (c) 2009 "Cowboy" Ben Alman,
// Dual licensed under the MIT and GPL licenses.
// http://benalman.com/about/license/
// 
// About: Examples
// 
// This working example, complete with fully commented code, illustrates one way
// in which this plugin can be used.
// 
// replaceText - http://benalman.com/code/projects/jquery-replacetext/examples/replacetext/
// 
// About: Support and Testing
// 
// Information about what version or versions of jQuery this plugin has been
// tested with, and what browsers it has been tested in.
// 
// jQuery Versions - 1.3.2, 1.4.1
// Browsers Tested - Internet Explorer 6-8, Firefox 2-3.6, Safari 3-4, Chrome, Opera 9.6-10.1.
// 
// About: Release History
// 
// 1.1 - (11/21/2009) Simplified the code and API substantially.
// 1.0 - (11/21/2009) Initial release

(function ($) {
	'$:nomunge'; // Used by YUI compressor.

	// Method: jQuery.fn.replaceText
	// 
	// Replace text in specified elements. Note that only text content will be
	// modified, leaving all tags and attributes untouched. The new text can be
	// either text or HTML.
	// 
	// Uses the String prototype replace method, full documentation on that method
	// can be found here: 
	// 
	// https://developer.mozilla.org/En/Core_JavaScript_1.5_Reference/Objects/String/Replace
	// 
	// Usage:
	// 
	// > jQuery('selector').replaceText( search, replace [, text_only ] );
	// 
	// Arguments:
	// 
	//  search - (RegExp|String) A RegExp object or substring to be replaced.
	//    Because the String prototype replace method is used internally, this
	//    argument should be specified accordingly.
	//  replace - (String|Function) The String that replaces the substring received
	//    from the search argument, or a function to be invoked to create the new
	//    substring. Because the String prototype replace method is used internally,
	//    this argument should be specified accordingly.
	//  text_only - (Boolean) If true, any HTML will be rendered as text. Defaults
	//    to false.
	// 
	// Returns:
	// 
	//  (jQuery) The initial jQuery collection of elements.

	$.fn.replaceText = function (search, replace, text_only) {
		return this.each(function () {
			var node = this.firstChild,
		val,
		new_val,

			// Elements to be removed at the end.
		remove = [];

			// Only continue if firstChild exists.
			if (node) {

				// Loop over all childNodes.
				do {

					// Only process text nodes.
					if (node.nodeType === 3) {

						// The original node value.
						val = node.nodeValue;

						// The new value.
						new_val = val.replace(search, replace);

						// Only replace text if the new value is actually different!
						if (new_val !== val) {

							if (!text_only && /</.test(new_val)) {
								// The new value contains HTML, set it in a slower but far more
								// robust way.
								$(node).before(new_val);

								// Don't remove the node yet, or the loop will lose its place.
								remove.push(node);
							} else {
								// The new value contains no HTML, so it can be set in this
								// very fast, simple way.
								node.nodeValue = new_val;
							}
						}
					}

				} while (node = node.nextSibling);
			}

			// Time to remove those elements!
			remove.length && $(remove).remove();
		});
	};

})(jQuery);


//==============================================
// move elements between two listboxes
// obsolete implementation. replaced by jQuery 
// custom function: SelectOptionsMove
//==============================================
//function ElementListboxMove(fromlist, tolist, forceselect, forceclear) {
//        var OneSelected = false;
//        $(fromlist).each( function (i,e) {
//            var val = $(e).val();
//            //var name = $(e).attr('name');
//            if (forceclear){
//                $(tolist).append($("<option></option>").text($(e).attr('text')).attr("value",$(e).val()) )
//                OneSelected = true;
//                $(e).remove();
//            }
//            else {
//                if ( $(e).attr('selected') == true){
//                    $(tolist).append($("<option></option>").text($(e).attr('text')).attr("value",$(e).val()) )
//                    OneSelected = true;
//                    $(e).remove();
//                }
//            }
//        });
//        if (OneSelected == false && forceselect == true) {
//            app.alertWarning('You must select at least one field', 'Warning', true);
//            return false;
//        }
//}

/*==============================================
* move elements between two <select> elements
* parameters:
* fromlist - source <select> element
* tolist - target <select> element
* forceselect - true-> display warning - no option selected in source <select> element
* forceclear - true -> flag to clear source <select> control and move
* all elements to tolist <select> control
==============================================*/
(function ($) {
$.fn.SelectOptionsMove = function (tolist, forceselect, forceclear) {
	var OneSelected = false;
	if ($(this).is('select') == false || $(tolist).is('select') == false) {
		alert('This function is not applicable to elements other then <select>');
		return;
	}
	$(this).children('option').each(function (i, e) {
		//alert(forceclear);
		if (forceclear) {
			$(tolist).append($("<option></option>").text($(e).html()).attr("value", $(e).val()))
			OneSelected = true;
			$(e).remove();
		}
		else {
			if ($(e).attr('selected') ==  'selected') {
				$(tolist).append($("<option></option>").text($(e).html()).attr("value", $(e).val()))
				OneSelected = true;
				$(e).remove();
			}
		}
	});
	if (OneSelected == false && forceselect == true) {
		alert('You must select at least one field');
		return false;
	}
}
	
})(jQuery);

/*!
* jQuery blockUI plugin
* Version 2.39 (23-MAY-2011)
* @requires jQuery v1.2.3 or later
*
* Examples at: http://malsup.com/jquery/block/
* Copyright (c) 2007-2010 M. Alsup
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
*
* Thanks to Amir-Hossein Sobhi for some excellent contributions!
*/

; (function ($) {

    if (/1\.(0|1|2)\.(0|1|2)/.test($.fn.jquery) || /^1.1/.test($.fn.jquery)) {
        //alert('blockUI requires jQuery v1.2.3 or later!  You are using v' + $.fn.jquery);
        return;
    }

    $.fn._fadeIn = $.fn.fadeIn;

    var noOp = function () { };

    // this bit is to ensure we don't call setExpression when we shouldn't (with extra muscle to handle
    // retarded userAgent strings on Vista)
    var mode = document.documentMode || 0;
    var setExpr = $.browser.msie && (($.browser.version < 8 && !mode) || mode < 8);
    var ie6 = $.browser.msie && /MSIE 6.0/.test(navigator.userAgent) && !mode;

    // global $ methods for blocking/unblocking the entire page
    $.blockUI = function (opts) { install(window, opts); };
    $.unblockUI = function (opts) { remove(window, opts); };

    // convenience method for quick growl-like notifications  (http://www.google.com/search?q=growl)
    $.growlUI = function (title, message, timeout, onClose) {
        var $m = $('<div class="growlUI"></div>');
        if (title) $m.append('<h1>' + title + '</h1>');
        if (message) $m.append('<h2>' + message + '</h2>');
        if (timeout == undefined) timeout = 3000;
        $.blockUI({
            message: $m, fadeIn: 700, fadeOut: 1000, centerY: false,
            timeout: timeout, showOverlay: false,
            onUnblock: onClose,
            css: $.blockUI.defaults.growlCSS
        });
    };

    // plugin method for blocking element content
    $.fn.block = function (opts) {
        return this.unblock({ fadeOut: 0 }).each(function () {
            if ($.css(this, 'position') == 'static')
                this.style.position = 'relative';
            if ($.browser.msie)
                this.style.zoom = 1; // force 'hasLayout'
            install(this, opts);
        });
    };

    // plugin method for unblocking element content
    $.fn.unblock = function (opts) {
        return this.each(function () {
            remove(this, opts);
        });
    };

    $.blockUI.version = 2.39; // 2nd generation blocking at no extra cost!

    // override these in your code to change the default behavior and style
    $.blockUI.defaults = {
        // message displayed when blocking (use null for no message)
        message: '<h1>Please wait...</h1>',

        title: null,   // title string; only used when theme == true
        draggable: true,  // only used when theme == true (requires jquery-ui.js to be loaded)

        theme: false, // set to true to use with jQuery UI themes

        // styles for the message when blocking; if you wish to disable
        // these and use an external stylesheet then do this in your code:
        // $.blockUI.defaults.css = {};
        css: {
            padding: 0,
            margin: 0,
            width: '30%',
            top: '40%',
            left: '35%',
            textAlign: 'center',
            color: '#000',
            border: '3px solid #aaa',
            backgroundColor: '#fff',
            cursor: 'wait'
        },

        // minimal style set used when themes are used
        themedCSS: {
            width: '30%',
            top: '40%',
            left: '35%'
        },

        // styles for the overlay
        overlayCSS: {
            backgroundColor: '#000',
            opacity: 0.6,
            cursor: 'wait'
        },

        // styles applied when using $.growlUI
        growlCSS: {
            width: '350px',
            top: '10px',
            left: '',
            right: '10px',
            border: 'none',
            padding: '5px',
            opacity: 0.6,
            cursor: 'default',
            color: '#fff',
            backgroundColor: '#000',
            '-webkit-border-radius': '10px',
            '-moz-border-radius': '10px',
            'border-radius': '10px'
        },

        // IE issues: 'about:blank' fails on HTTPS and javascript:false is s-l-o-w
        // (hat tip to Jorge H. N. de Vasconcelos)
        iframeSrc: /^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank',

        // force usage of iframe in non-IE browsers (handy for blocking applets)
        forceIframe: false,

        // z-index for the blocking overlay
        baseZ: 1000,

        // set these to true to have the message automatically centered
        centerX: true, // <-- only effects element blocking (page block controlled via css above)
        centerY: true,

        // allow body element to be stetched in ie6; this makes blocking look better
        // on "short" pages.  disable if you wish to prevent changes to the body height
        allowBodyStretch: true,

        // enable if you want key and mouse events to be disabled for content that is blocked
        bindEvents: true,

        // be default blockUI will supress tab navigation from leaving blocking content
        // (if bindEvents is true)
        constrainTabKey: true,

        // fadeIn time in millis; set to 0 to disable fadeIn on block
        fadeIn: 200,

        // fadeOut time in millis; set to 0 to disable fadeOut on unblock
        fadeOut: 400,

        // time in millis to wait before auto-unblocking; set to 0 to disable auto-unblock
        timeout: 0,

        // disable if you don't want to show the overlay
        showOverlay: true,

        // if true, focus will be placed in the first available input field when
        // page blocking
        focusInput: true,

        // suppresses the use of overlay styles on FF/Linux (due to performance issues with opacity)
        applyPlatformOpacityRules: true,

        // callback method invoked when fadeIn has completed and blocking message is visible
        onBlock: null,

        // callback method invoked when unblocking has completed; the callback is
        // passed the element that has been unblocked (which is the window object for page
        // blocks) and the options that were passed to the unblock call:
        //	 onUnblock(element, options)
        onUnblock: null,

        // don't ask; if you really must know: http://groups.google.com/group/jquery-en/browse_thread/thread/36640a8730503595/2f6a79a77a78e493#2f6a79a77a78e493
        quirksmodeOffsetHack: 4,

        // class name of the message block
        blockMsgClass: 'blockMsg'
    };

    // private data and functions follow...

    var pageBlock = null;
    var pageBlockEls = [];

    function install(el, opts) {
        var full = (el == window);
        var msg = opts && opts.message !== undefined ? opts.message : undefined;
        opts = $.extend({}, $.blockUI.defaults, opts || {});
        opts.overlayCSS = $.extend({}, $.blockUI.defaults.overlayCSS, opts.overlayCSS || {});
        var css = $.extend({}, $.blockUI.defaults.css, opts.css || {});
        var themedCSS = $.extend({}, $.blockUI.defaults.themedCSS, opts.themedCSS || {});
        msg = msg === undefined ? opts.message : msg;

        // remove the current block (if there is one)
        if (full && pageBlock)
            remove(window, { fadeOut: 0 });

        // if an existing element is being used as the blocking content then we capture
        // its current place in the DOM (and current display style) so we can restore
        // it when we unblock
        if (msg && typeof msg != 'string' && (msg.parentNode || msg.jquery)) {
            var node = msg.jquery ? msg[0] : msg;
            var data = {};
            $(el).data('blockUI.history', data);
            data.el = node;
            data.parent = node.parentNode;
            data.display = node.style.display;
            data.position = node.style.position;
            if (data.parent)
                data.parent.removeChild(node);
        }

        $(el).data('blockUI.onUnblock', opts.onUnblock);
        var z = opts.baseZ;

        // blockUI uses 3 layers for blocking, for simplicity they are all used on every platform;
        // layer1 is the iframe layer which is used to supress bleed through of underlying content
        // layer2 is the overlay layer which has opacity and a wait cursor (by default)
        // layer3 is the message content that is displayed while blocking

        var lyr1 = ($.browser.msie || opts.forceIframe)
		? $('<iframe class="blockUI" style="z-index:' + (z++) + ';display:none;border:none;margin:0;padding:0;position:absolute;width:100%;height:100%;top:0;left:0" src="' + opts.iframeSrc + '"></iframe>')
		: $('<div class="blockUI" style="display:none"></div>');

        var lyr2 = opts.theme
	 	? $('<div class="blockUI blockOverlay ui-widget-overlay" style="z-index:' + (z++) + ';display:none"></div>')
	 	: $('<div class="blockUI blockOverlay" style="z-index:' + (z++) + ';display:none;border:none;margin:0;padding:0;width:100%;height:100%;top:0;left:0"></div>');

        var lyr3, s;
        if (opts.theme && full) {
            s = '<div class="blockUI ' + opts.blockMsgClass + ' blockPage ui-dialog ui-widget ui-corner-all" style="z-index:' + (z + 10) + ';display:none;position:fixed">' +
				'<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">' + (opts.title || '&nbsp;') + '</div>' +
				'<div class="ui-widget-content ui-dialog-content"></div>' +
			'</div>';
        }
        else if (opts.theme) {
            s = '<div class="blockUI ' + opts.blockMsgClass + ' blockElement ui-dialog ui-widget ui-corner-all" style="z-index:' + (z + 10) + ';display:none;position:absolute">' +
				'<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">' + (opts.title || '&nbsp;') + '</div>' +
				'<div class="ui-widget-content ui-dialog-content"></div>' +
			'</div>';
        }
        else if (full) {
            s = '<div class="blockUI ' + opts.blockMsgClass + ' blockPage" style="z-index:' + (z + 10) + ';display:none;position:fixed"></div>';
        }
        else {
            s = '<div class="blockUI ' + opts.blockMsgClass + ' blockElement" style="z-index:' + (z + 10) + ';display:none;position:absolute"></div>';
        }
        lyr3 = $(s);

        // if we have a message, style it
        if (msg) {
            if (opts.theme) {
                lyr3.css(themedCSS);
                lyr3.addClass('ui-widget-content');
            }
            else
                lyr3.css(css);
        }

        // style the overlay
        if (!opts.theme && (!opts.applyPlatformOpacityRules || !($.browser.mozilla && /Linux/.test(navigator.platform))))
            lyr2.css(opts.overlayCSS);
        lyr2.css('position', full ? 'fixed' : 'absolute');

        // make iframe layer transparent in IE
        if ($.browser.msie || opts.forceIframe)
            lyr1.css('opacity', 0.0);

        //$([lyr1[0],lyr2[0],lyr3[0]]).appendTo(full ? 'body' : el);
        var layers = [lyr1, lyr2, lyr3], $par = full ? $('body') : $(el);
        $.each(layers, function () {
            this.appendTo($par);
        });

        if (opts.theme && opts.draggable && $.fn.draggable) {
            lyr3.draggable({
                handle: '.ui-dialog-titlebar',
                cancel: 'li'
            });
        }

        // ie7 must use absolute positioning in quirks mode and to account for activex issues (when scrolling)
        var expr = setExpr && (!$.boxModel || $('object,embed', full ? null : el).length > 0);
        if (ie6 || expr) {
            // give body 100% height
            if (full && opts.allowBodyStretch && $.boxModel)
                $('html,body').css('height', '100%');

            // fix ie6 issue when blocked element has a border width
            if ((ie6 || !$.boxModel) && !full) {
                var t = sz(el, 'borderTopWidth'), l = sz(el, 'borderLeftWidth');
                var fixT = t ? '(0 - ' + t + ')' : 0;
                var fixL = l ? '(0 - ' + l + ')' : 0;
            }

            // simulate fixed position
            $.each([lyr1, lyr2, lyr3], function (i, o) {
                var s = o[0].style;
                s.position = 'absolute';
                if (i < 2) {
                    full ? s.setExpression('height', 'Math.max(document.body.scrollHeight, document.body.offsetHeight) - (jQuery.boxModel?0:' + opts.quirksmodeOffsetHack + ') + "px"')
					 : s.setExpression('height', 'this.parentNode.offsetHeight + "px"');
                    full ? s.setExpression('width', 'jQuery.boxModel && document.documentElement.clientWidth || document.body.clientWidth + "px"')
					 : s.setExpression('width', 'this.parentNode.offsetWidth + "px"');
                    if (fixL) s.setExpression('left', fixL);
                    if (fixT) s.setExpression('top', fixT);
                }
                else if (opts.centerY) {
                    if (full) s.setExpression('top', '(document.documentElement.clientHeight || document.body.clientHeight) / 2 - (this.offsetHeight / 2) + (blah = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"');
                    s.marginTop = 0;
                }
                else if (!opts.centerY && full) {
                    var top = (opts.css && opts.css.top) ? parseInt(opts.css.top) : 0;
                    var expression = '((document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + ' + top + ') + "px"';
                    s.setExpression('top', expression);
                }
            });
        }

        // show the message
        if (msg) {
            if (opts.theme)
                lyr3.find('.ui-widget-content').append(msg);
            else
                lyr3.append(msg);
            if (msg.jquery || msg.nodeType)
                $(msg).show();
        }

        if (($.browser.msie || opts.forceIframe) && opts.showOverlay)
            lyr1.show(); // opacity is zero
        if (opts.fadeIn) {
            var cb = opts.onBlock ? opts.onBlock : noOp;
            var cb1 = (opts.showOverlay && !msg) ? cb : noOp;
            var cb2 = msg ? cb : noOp;
            if (opts.showOverlay)
                lyr2._fadeIn(opts.fadeIn, cb1);
            if (msg)
                lyr3._fadeIn(opts.fadeIn, cb2);
        }
        else {
            if (opts.showOverlay)
                lyr2.show();
            if (msg)
                lyr3.show();
            if (opts.onBlock)
                opts.onBlock();
        }

        // bind key and mouse events
        bind(1, el, opts);

        if (full) {
            pageBlock = lyr3[0];
            pageBlockEls = $(':input:enabled:visible', pageBlock);
            if (opts.focusInput)
                setTimeout(focus, 20);
        }
        else
            center(lyr3[0], opts.centerX, opts.centerY);

        if (opts.timeout) {
            // auto-unblock
            var to = setTimeout(function () {
                full ? $.unblockUI(opts) : $(el).unblock(opts);
            }, opts.timeout);
            $(el).data('blockUI.timeout', to);
        }
    };

    // remove the block
    function remove(el, opts) {
        var full = (el == window);
        var $el = $(el);
        var data = $el.data('blockUI.history');
        var to = $el.data('blockUI.timeout');
        if (to) {
            clearTimeout(to);
            $el.removeData('blockUI.timeout');
        }
        opts = $.extend({}, $.blockUI.defaults, opts || {});
        bind(0, el, opts); // unbind events

        if (opts.onUnblock === null) {
            opts.onUnblock = $el.data('blockUI.onUnblock');
            $el.removeData('blockUI.onUnblock');
        }

        var els;
        if (full) // crazy selector to handle odd field errors in ie6/7
            els = $('body').children().filter('.blockUI').add('body > .blockUI');
        else
            els = $('.blockUI', el);

        if (full)
            pageBlock = pageBlockEls = null;

        if (opts.fadeOut) {
            els.fadeOut(opts.fadeOut);
            setTimeout(function () { reset(els, data, opts, el); }, opts.fadeOut);
        }
        else
            reset(els, data, opts, el);
    };

    // move blocking element back into the DOM where it started
    function reset(els, data, opts, el) {
        els.each(function (i, o) {
            // remove via DOM calls so we don't lose event handlers
            if (this.parentNode)
                this.parentNode.removeChild(this);
        });

        if (data && data.el) {
            data.el.style.display = data.display;
            data.el.style.position = data.position;
            if (data.parent)
                data.parent.appendChild(data.el);
            $(el).removeData('blockUI.history');
        }

        if (typeof opts.onUnblock == 'function')
            opts.onUnblock(el, opts);
    };

    // bind/unbind the handler
    function bind(b, el, opts) {
        var full = el == window, $el = $(el);

        // don't bother unbinding if there is nothing to unbind
        if (!b && (full && !pageBlock || !full && !$el.data('blockUI.isBlocked')))
            return;
        if (!full)
            $el.data('blockUI.isBlocked', b);

        // don't bind events when overlay is not in use or if bindEvents is false
        if (!opts.bindEvents || (b && !opts.showOverlay))
            return;

        // bind anchors and inputs for mouse and key events
        var events = 'mousedown mouseup keydown keypress';
        b ? $(document).bind(events, opts, handler) : $(document).unbind(events, handler);

        // former impl...
        //	   var $e = $('a,:input');
        //	   b ? $e.bind(events, opts, handler) : $e.unbind(events, handler);
    };

    // event handler to suppress keyboard/mouse events when blocking
    function handler(e) {
        // allow tab navigation (conditionally)
        if (e.keyCode && e.keyCode == 9) {
            if (pageBlock && e.data.constrainTabKey) {
                var els = pageBlockEls;
                var fwd = !e.shiftKey && e.target === els[els.length - 1];
                var back = e.shiftKey && e.target === els[0];
                if (fwd || back) {
                    setTimeout(function () { focus(back) }, 10);
                    return false;
                }
            }
        }
        var opts = e.data;
        // allow events within the message content
        if ($(e.target).parents('div.' + opts.blockMsgClass).length > 0)
            return true;

        // allow events for content that is not being blocked
        return $(e.target).parents().children().filter('div.blockUI').length == 0;
    };

    function focus(back) {
        if (!pageBlockEls)
            return;
        var e = pageBlockEls[back === true ? pageBlockEls.length - 1 : 0];
        if (e)
            e.focus();
    };

    function center(el, x, y) {
        var p = el.parentNode, s = el.style;
        var l = ((p.offsetWidth - el.offsetWidth) / 2) - sz(p, 'borderLeftWidth');
        var t = ((p.offsetHeight - el.offsetHeight) / 2) - sz(p, 'borderTopWidth');
        if (x) s.left = l > 0 ? (l + 'px') : '0';
        if (y) s.top = t > 0 ? (t + 'px') : '0';
    };

    function sz(el, p) {
        return parseInt($.css(el, p)) || 0;
    };

})(jQuery);

