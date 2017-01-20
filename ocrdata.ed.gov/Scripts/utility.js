var Util = function () {
}

var selectedEntities = [];

Util.prototype = {
    //#region new result implementation
    toggleRowColor: function (_this) {
        var tr = _this;
        var cb = $(tr).find('input');
        var cbchecked = $(cb).is(':checked');

        // row selected
        if ($(tr).hasClass('selectTR')) {
            $(tr).removeClass('selectTR');
            $(cb).removeAttr('checked');
            return;
        }
        // row not selected - select
        $(tr).addClass('selectTR');
        if (!cbchecked) {
            $(cb).attr('checked', 'checked');
        }
    },
    toggleAllCheck: function (_this, tbl) {
        var _thischecked = $(_this).is(':checked');
        var table = $("#" + tbl);
        // select visible rows to toggle
        var rows = $(table).find('tr').not('.noshow');
        $.each(rows, function (i, e) {
            var tr = e;
            var cb = $($(tr).find('td')[0]).find('input');
            var cbchecked = $(cb).is(':checked');
            // row not selected - select
            if (_thischecked && !cbchecked) {
                $(tr).addClass('selectTR');
                $(cb).attr('checked', 'checked');
            }
            // row selected
            if (!_thischecked && cbchecked) {
                if ($(tr).hasClass('selectTR')) {
                    $(tr).removeClass('selectTR');
                    $(cb).removeAttr('checked');
                }
            }

        });

    },
    populateSearchRows: function (source, ent) {
        var Total = $('#EntitiesTotal').val();
        var SchCounter = $('#SchoolEntitiesCounter').val();

        var d;
        var sid;
        var st;
        var syears = $("input[name='syears']:checked").val();      // get survey year key

        if (syears == undefined) {
            syears = LastSYK;           // it is defined in controller
        }
        var tr;
        var trs = [];
        $(source + ' tr.selectTR').each(function (i, el) {
            // schools
            if (!$(el).hasClass('noshow') && ent == "SCH") {
                if (!util.increaseCount('#SchoolSearchByNameResults', ent)) {
                    return;
                }

                tr = '<tr>';
                $.each(el.cells, function (j, e) {
                    // pull state
                    if (j == 1) {
                        st = $(e).html();
                        tr += ('<td class="DataSetResultCell">' + $(e).attr('statename') + '</td>');
                    } else {
                        // exclude checkbox
                        if (j != 0) {
                            tr += ('<td class="DataSetResultCell">' + $(e).html() + '</td>');
                        }
                    }
                    // pull school id
                    if (j == 5) {
                        sid = $(e).attr('sid');
                    }
                });
                d = "<td class='DataSetResultCell' style='text-align:center;'><button type='button' sid=" + sid + " sy=" + syears + " state='" + st + "' onclick=util.SchoolProfilePage(this); class='view'></button></td>";
                tr += (d);
                tr += ('<td class="DataSetResultInitCellLast" style="text-align:center;"><button type="button" entityType="' + ent + '" source="' + source + '" sid="' + sid + '" class="delete SCH" onclick=util.removeSearchRow(this);></button></td>');
                trs.push(tr);
                util.addSelectedEntity(ent, sid);
            }
            // districts
            if (!$(el).hasClass('noshow') && ent == "LEA") {
                if (!util.increaseCount('#tbodyDistrictByStateResult', ent)) {
                    return;
                }

                tr = '<tr>';
                $.each(el.cells, function (j, e) {
                    // pull state
                    if (j == 1) {
                        st = $(e).attr('lea_state');
                        tr += ('<td class="DataSetResultCell">' + $(e).attr('statename') + '</td>');
                    }
                    // pull district name
                    if (j == 2) {
                        tr += ('<td class="DataSetResultCell">' + $(e).attr('lea_name') + '</td>');
                    }
                    // pull district id
                    if (j == 3) {
                        lea_id = $(e).attr('lea_id');
                        tr += ('<td class="DataSetResultCell">' + $(e).attr('LEAID') + '</td>');
                    }
                });
                tr += ('<td class="DataSetResultCell" style="background-color:Grey;"></td><td class="DataSetResultCell" style="background-color:Grey;"></td>');
                d = "<td class='DataSetResultCell' style='text-align:center;'><button type='button' lea_id=" + lea_id + " sy=" + syears + " state='" + st + "' onclick=util.DistrictProfilePage(this); class='view'></button></td>";
                tr += (d);
                d = '<td class="DataSetResultInitCellLast" style="text-align:center;"><button type="button" entityType="' + ent + '" source="' + source + '" lea_id="' + lea_id + '" class="delete LEA" onclick=util.removeSearchRow(this);></button></td>';
                tr += d;
                trs.push(tr);
                util.addSelectedEntity(ent, lea_id);
            }
            // hide rows added to result table
            $(el).addClass('noshow');
        });
        $('#tbodyAddResultsHolder').append(trs.join());     // add result rows to result table
        util.setControls();         // setup button style
        return trs;
    },

    restoreSearchResultsCounters: function (source) {
        var s = source;
        var entitytype;
        var btn;
        $(source).each(function (i, e) {
            btn = $(e).find('.DataSetResultInitCellLast').find('button');
            entitytype = btn.attr('entitytype');
            util.increaseCount(entitytype, entitytype);
        });
    },

    removeSearchRow: function (el) {
        var Total = $('#EntitiesTotal').val();
        var SchCounter = $('#SchoolEntitiesCounter').val();
        var LEACounter = $('#LEAEntitiesCounter').val();
        var StCounter = $('#StateEntitiesCounter').val();
        // delete tr element, containing this button
        //var el = e.currentTarget;
        var source = $(el).attr('source');
        var entityType = $(el).attr('entityType');
        var source = $(el).attr('source');
        var td;
        var ent;
        if ($(el).hasClass('SCH') == true) {
            SchCounter--;
            $('#SchoolEntitiesCounter').val(SchCounter);
            ent = $(el).attr('sid');
            td = $(source + ' TD').filter('[sid="' + ent + '"]');
        }
        // district
        if ($(el).hasClass('LEA') == true) {
            LEACounter--;
            $('#LEAEntitiesCounter').val(LEACounter);
            ent = $(el).attr('lea_id');
            td = $(source + ' TD').filter('[lea_id="' + ent + '"]');
        }
        // state
        if ($(el).hasClass('STATE') == true) {
            StCounter--;
            $('#StateEntitiesCounter').val(StCounter);
            ent = $(el).attr('state');
            td = $(source + ' TD').filter('[state="' + ent + '"]');
        }
        util.removeSelectedEntity(entityType, ent);

        $(td).parent().removeClass('noshow');
        $(el.parentElement.parentElement).remove();
    },
    //#endregion

    tabClick: function (_this, e) {

        var target = $(e.target).closest(".dsTabs");

        var tabs = $('#dvTabs');


        if ($(target).hasClass('dvItem-Selected')) {
            var frag = $(target).attr('en');
            $('#' + frag).addClass('noshow');
            $('.dvItem-Selected').find('.ui-icon-circle-minus').removeClass('ui-icon-circle-minus').addClass('ui-icon-circle-plus');
            $('.dvItem-Selected').removeClass('dvItem-Selected');
            return false;
        }
        $('.dvItem-Selected').find('.ui-icon-circle-minus').removeClass('ui-icon-circle-minus').addClass('ui-icon-circle-plus');
        $('.dvItem-Selected').removeClass('dvItem-Selected');
        $(target).addClass('dvItem-Selected');
        $(target).find('.ui-icon-circle-plus').removeClass('ui-icon-circle-plus').addClass('ui-icon-circle-minus');
        // make all frag- invisible, then target frag visible
        $frags = $('[id^="frag-"]');
        $frags.addClass('noshow');
        var frag = $(target).attr('en');
        $('#' + frag).removeClass('noshow');
    },


    addSelectedEntity: function (entityType, entityId) { // this populates the global selectedEntities variable with the entities that are used in the searches
        var selectedEntitiy = {
            entityType: '',
            entityId: ''
        };
        selectedEntitiy.entityType = entityType;
        selectedEntitiy.entityId = entityId;
        selectedEntities.push(selectedEntitiy);
        //console.log(selectedEntities);
    },
    removeSelectedEntity: function (entityType, entityId) { // this removes an entity from the selectedEntities array that are used in the searches
        selectedEntities = jQuery.grep(selectedEntities, function (elem, i) {
            var thisEntityType = elem.entityType;
            var thisEntityId = elem.entityId;
            return !(thisEntityType === entityType && thisEntityId === entityId); // we keep everything in our selectedEntities array that does NOT have the same entity type and entity id as the ones in the params above.
        });
        //console.log(selectedEntities);
    },
    removeAllSelectedEntities: function () {
        selectedEntities = [];
    },
    selectedEntitiesToCsv: function () {
        var returnVal = '';
        var arr = [];
        $(selectedEntities).each(function (i, elem) {
            var thisEntityType = elem.entityType;
            var thisEntityId = elem.entityId;
            arr.push(thisEntityType + '|' + thisEntityId);
        });
        return arr.join(',');

    },
    // restore selectedEntities from array passed from controller
    parseEntities: function (entities) {
        $.each(entities, function (i, arr) {
            selectedEntities.push({ entityType: arr[0], entityId: arr[1] });
        });
    },
    toggleSearchCriteria: function (el) {
        var e = $("#hfadv" + el);
        if (e.val() == "show") {
            $('#adv' + el).hide();
            $('#hfadv' + el).val('hide');
            $('.' + el + 'down').show();
            $('.' + el + 'up').hide();
        } else {
            $('#hfadv' + el).val('show');
            $('#adv' + el).show();
            $('.' + el + 'down').hide();
            $('.' + el + 'up').show();
        }
    },
    increaseControlCounter: function (el) {
        var i = 0;
        i = parseInt($(el).val());
        i++;
        $(el).val(i);
        return i;
    },
    decreaseControlCounter: function (el) {
        var i = parseInt($(el).val());
        i--;
        if (i < 0) {
            i = 0;
        }
        $(el).val(i);
        return i;
    },
    trackControlChange: function (e, counterHash) {
        var tp;
        var en;
        var enArr;
        tp = e.currentTarget.type;
        switch (tp) {
            case "checkbox":
                if (e.currentTarget.checked == true) {
                    counterHash.add($(e.currentTarget).attr('id'));
                } else {
                    counterHash.remove($(e.currentTarget).attr('id'));
                }
                break;
            case "radio":
                if (e.currentTarget.value != '') {
                    counterHash.add($(e.currentTarget).attr('name'));
                } else {
                    counterHash.remove($(e.currentTarget).attr('name'));
                }
                break;
            default:
                // when we have group of controls, then need to make sure that each control in group has been selected or has value
                var sel;
                var GroupCounter = new JSHash();
                en = $(e.currentTarget).attr('en');
                enArr = $('[en="' + en + '"]');
                $(enArr).each(function (i, e) {
                    switch (e.type) {
                        case "select-one":
                            sel = $("#" + $(e).attr('id') + " option:selected").text();
                            break;
                        case "text":
                            sel = $(e).val();
                            break;
                    }
                    if (sel != '') {
                        GroupCounter.add($(e).attr('id'));
                    } else {
                        GroupCounter.remove($(e).attr('id'));
                    }
                });
                if (GroupCounter.Keys.length == enArr.length) {
                    counterHash.add($(e.currentTarget).attr('en'));
                } else {
                    counterHash.remove($(e.currentTarget).attr('en'));
                }
                break;
        }
    },

    toggleColor: function (el) {
        var entityclass;
        if ($(el).hasClass('selectTR')) {
            $(el).removeClass('selectTR');
            return;
        }

        if ($(el).hasClass('sch') == true) {
            entityclass = 'sch';
        }
        if ($(el).hasClass('dis') == true) {
            entityclass = 'dis';
        }
        if ($(el).hasClass('state') == true) {
            entityclass = 'state';
        }
        var parentId = $(el).parent().attr('id');

        var selectedvisible = $("#" + parentId + " tr." + entityclass + ".selectTR").not('.noshow');
        $(selectedvisible).removeClass('selectTR');

        if ($(el).hasClass('selectTR') == false) {
            //if (this.increaseCounter(el) == true) {
            $(el).addClass('selectTR');
            //}
        } else {
            $(el).removeClass('selectTR');
            //this.decreaseCounter(el);
        }
    },

    //#region increase/decrease entity counters
    increaseCount: function (el, elclass) {
        var msg = "You have exceeded the maximum amount of entities for this report. In order to add other entities, you will need to delete some from the selected data set first.";
        // encrease/descrease entity counters
        var Total = $('#EntitiesTotal').val();
        var SchCounter = $('#SchoolEntitiesCounter').val();
        var LEACounter = $('#LEAEntitiesCounter').val();
        var StCounter = $('#StateEntitiesCounter').val();
        var TotalCounter = parseInt(SchCounter) + parseInt(LEACounter) + parseInt(StCounter);
        // school
        if (elclass == 'SCH') {
            if (TotalCounter == Total) {
                app.ShowMessage(msg, 'Warning', true, 480, 160);
                return false;
            }
            SchCounter++;
            $('#SchoolEntitiesCounter').val(SchCounter);
            return true;
        }
        // district
        if (elclass == 'LEA') {
            if (TotalCounter == Total) {
                app.ShowMessage(msg, 'Warning', true, 480, 160);
                return false;
            }
            LEACounter++;
            $('#LEAEntitiesCounter').val(LEACounter);
            return true;
        }
        // state
        if (elclass == 'STATE') {
            if (TotalCounter == Total) {
                app.ShowMessage(msg, 'Warning', true, 480, 160);
                return false;
            }
            StCounter++;
            $('#StateEntitiesCounter').val(StCounter);
            return true;
        }
    },
    //#endregion

    //#region redirect to old pages implementation
    SpecialReportPage: function (options) {
        var tbodyAddResultsHolder = $('#tbodyAddResultsHolder');
        var lastcell = $('#tbodyAddResultsHolder td[class="DataSetResultInitCellLast"]');
        var entitytype = $(lastcell).find('button').attr('entitytype');
        var btn = $('#tbodyAddResultsHolder td[class="DataSetResultInitCellLast"]').prev().find('button');
        var eid = entitytype == "SCH" ? btn.attr('sid') : btn.attr('lea_id');
        var et = entitytype == "SCH" ? 's' : 'd';
        var sy = $('#tbodyAddResultsHolder td[class="DataSetResultInitCellLast"]').prev().find('button').attr('sy');
        var ReportId = options.report;

        var srconfig = $.grep(options.srconfig, function (d, i) {
            return parseInt(d.ReportId) == parseInt(ReportId) && parseInt(d.Survey_Year_Key) == parseInt(sy) && d.School_Or_District == et;
        });

        var Page_ID = srconfig[0].Page_Id;
        this.preserveResults();
        var url = '/Page?t=' + et + '&eid=' + eid + '&syk=' + sy + '&pid=' + Page_ID + '&sr=' + options.sr + "&Report=" + ReportId;
        window.location.href = url;
    },

    SchoolProfilePage: function (el) {
        var school_id = $(el).attr('sid');
        var survey_Year = $(el).attr('sy');
        var Page_ID = 732;
        this.preserveResults();
        var url = '/Page?t=s&eid=' + school_id + '&syk=' + survey_Year + '&pid=' + Page_ID + "&Report=" + $('#hfReport').val();
        window.location.href = url;
    },

    DistrictProfilePage: function (el) {
        var lea_id = $(el).attr('lea_id');
        var survey_Year = $(el).attr('sy');
        var Page_ID = 736;
        this.preserveResults();
        var url = '/Page?t=d&eid=' + lea_id + '&syk=' + survey_Year + '&pid=' + Page_ID + "&Report=" + $('#hfReport').val();
        window.location.href = url;
    },

    preserveResults: function () {
        var vs = $('#__VIEWSTATE').detach();
        var ev = $('#__EVENTVALIDATION').detach();
        var FormFieldValues = $("#form1").serialize();
        var res = $('#tbodyAddResultsHolder').html();
        var data;
        var tab;
        if (Report == 1 || Report == 3) {
            tab = $('[id^="frag-"]').not(".noshow").attr('fr');
        }
        if (Report == 2 || Report == 4) {
            tab = $('div[name="OneTab"]').not(".noshow").attr('en');
        }
        var entities = util.selectedEntitiesToCsv();

        data = "entities=" + entities + "&restore=1&tab=" + tab + "&" + "bodyresult=" + res + "&" + FormFieldValues;
        var sUrl = "../handler/AjaxHandler.ashx?cmd=PreserveResult";
        $.ajax({
            url: sUrl,
            type: "POST",
            async: false,
            data: data, //"&bodyresult=" + res,
            dataType: "json",
            success: function (Data) { },
            error: function (data) { },
            complete: function () {
                vs.appendTo($("#form1"));
                ev.appendTo($("#form1"));
            }
        });
    },

    //#endregion

    //#region validate selected
    validateSelected: function (source) {
        var count = 0;

        $(source + ' tr.selectTR').each(function (i, el) {
            if (!$(el).hasClass('noshow')) {
                count++;
            }
        });

        if (count == 0) {
            return false;
        }
        return true;
    },
    //#endregion

    //#region populate results
    populateResultRows: function (source, ent) {

        var d;
        var sid;
        var st;
        var syears = $("input[name='syears']:checked").val();      // get survey year key
        var tr;
        var trs = [];
        $(source + ' tr.selectTR').each(function (i, el) {
            // schools
            if (!$(el).hasClass('noshow') && ent == "SCH") {
                tr = '<tr>';
                $.each(el.cells, function (j, e) {
                    // pull state
                    if (j == 0) {
                        st = $(e).html();
                        tr += ('<td class="DataSetResultCell">' + $(e).attr('statename') + '</td>');
                    } else {
                        tr += ('<td class="DataSetResultCell">' + $(e).html() + '</td>');
                    }
                    // pull school id
                    if (j == 4) {
                        sid = $(e).attr('sid');
                    }
                });
                d = "<td class='DataSetResultCell' style='text-align:center;'><button type='button' sid=" + sid + " sy=" + syears + " state='" + st + "' onclick=util.SchoolProfilePage(this); class='view'></button></td>";
                tr += (d);
                tr += ('<td class="DataSetResultInitCellLast" style="text-align:center;"><button type="button" entityType="' + ent + '" source="' + source + '" sid="' + sid + '" class="delete SCH" onclick=util.removeResultRow(this);></button></td>');
                trs.push(tr);
                util.addSelectedEntity(ent, sid);
            }
            // districts
            if (!$(el).hasClass('noshow') && ent == "LEA") {
                tr = '<tr>';
                $.each(el.cells, function (j, e) {
                    // pull state
                    if (j == 0) {
                        st = $(e).attr('lea_state');
                        tr += ('<td class="DataSetResultCell">' + $(e).attr('statename') + '</td>');
                    }
                    // pull district name
                    if (j == 1) {
                        tr += ('<td class="DataSetResultCell">' + $(e).attr('lea_name') + '</td>');
                    }
                    // pull district id
                    if (j == 2) {
                        lea_id = $(e).attr('lea_id');
                        tr += ('<td class="DataSetResultCell">' + $(e).attr('LEAID') + '</td>');
                    }
                });
                tr += ('<td class="DataSetResultCell" style="background-color:Grey;"></td><td class="DataSetResultCell" style="background-color:Grey;"></td>');
                d = "<td class='DataSetResultCell' style='text-align:center;'><button type='button' lea_id=" + lea_id + " sy=" + syears + " state='" + st + "' onclick=util.DistrictProfilePage(this); class='view'></button></td>";
                tr += (d);
                d = '<td class="DataSetResultInitCellLast" style="text-align:center;"><button type="button" entityType="' + ent + '" source="' + source + '" lea_id="' + lea_id + '" class="delete LEA" onclick=util.removeResultRow(this);></button></td>';
                tr += d;
                trs.push(tr);
                util.addSelectedEntity(ent, lea_id);
            }
            if (!$(el).hasClass('noshow') && ent == "ST") {
                tr = '<tr>';
                $.each(el.cells, function (j, e) {
                    // pull state
                    if (j == 0) {
                        st = $(e).attr('state');
                        tr += ('<td state=\"' + st + '\" class="DataSetResultCell">' + $(e).attr('statename') + '</td>');
                    }
                });
                tr += ('<td class="DataSetResultCell" style="background-color:Grey;"></td><td class="DataSetResultCell" style="background-color:Grey;"></td>');
                tr += ('<td class="DataSetResultCell" style="background-color:Grey;"></td><td class="DataSetResultCell" style="background-color:Grey;"></td>');
                tr += ('<td class="DataSetResultCell" style="text-align:center; background-color:Grey;"></td><td class="DataSetResultInitCellLast" style="text-align:center;">');
                tr += ('<button type="button" entityType="' + ent + '" source="' + source + '" state=\"' + st + '\" class="delete STATE" onclick=util.removeResultRow(this);></button></td>');
                trs.push(tr);
                util.addSelectedEntity(ent, st);
            }
        });
        $('#tbodyAddResultsHolder').append(trs.join());     // add result rows to result table
        util.setControls();         // setup button style
        $(source + ' tr.selectTR').addClass('noshow');          // hide records added to the result table
        return trs;
    },

    parseSelect: function (el) {
        var ar = [];
        $(el).each(function (i, e) {
            ar.push($(e).val());
        });
        return ar;
    },

    removeResultRow: function (el) {
        var Total = $('#EntitiesTotal').val();
        var SchCounter = $('#SchoolEntitiesCounter').val();
        var LEACounter = $('#LEAEntitiesCounter').val();
        var StCounter = $('#StateEntitiesCounter').val();
        // delete tr element, containing this button
        //var el = e.currentTarget;
        var source = $(el).attr('source');
        var entityType = $(el).attr('entityType');
        var source = $(el).attr('source');
        var td;
        var ent;
        if ($(el).hasClass('SCH') == true) {
            SchCounter--;
            $('#SchoolEntitiesCounter').val(SchCounter);
            ent = $(el).attr('sid');
            td = $(source + ' TD').filter('[sid="' + ent + '"]');
        }
        // district
        if ($(el).hasClass('LEA') == true) {
            LEACounter--;
            $('#LEAEntitiesCounter').val(LEACounter);
            ent = $(el).attr('lea_id');
            td = $(source + ' TD').filter('[lea_id="' + ent + '"]');
        }
        // state
        if ($(el).hasClass('STATE') == true) {
            StCounter--;
            $('#StateEntitiesCounter').val(StCounter);
            ent = $(el).attr('state');
            td = $(source + ' TD').filter('[state="' + ent + '"]');
        }
        util.removeSelectedEntity(entityType, ent);

        $(td).parent().removeClass('noshow').removeClass('selectTR');
        $(el.parentElement.parentElement).remove();
    },

    setControls: function () {
        $('.view').button({
            icons: {
                primary: "ui-icon-zoomin"
            },
            text: false
        });
        $('.delete').button({
            icons: {
                primary: "ui-icon-circle-close"
            },
            text: false
        });
    },

    //#endregion

    findSchoolsByLEAId: function (el) {
        // we remove the viewstate and event validation fields before we submit this form because we don't need it for what we're doing with AJAX
        var vs = $('#__VIEWSTATE').detach();
        var ev = $('#__EVENTVALIDATION').detach();

        var en = $(el).parent().attr('en');             // target to place results
        var LEA_Id = $(el).children().eq(1).html();     // lea_id
        var syk = $("input[name='syears']:checked").val();      // get survey year key
        var sUrl = "../handler/AjaxHandler.ashx?cmd=SchoolsByLEASearch&syears=" + syk + "&LEAID=" + LEA_Id;
        var ns = "200";
        if (Report == 4) {
            ns = "250";
            sUrl += "&recordCount=" + ns;
        }
        $('#divPleaseWaitOnLoad').show();
        $.ajax({
            url: sUrl,
            type: "GET",
            processData: false,
            async: true,
            dataType: "text",
            success: function (Data) {
                var d = eval(Data);
                //$('#' + en + ' tr').remove();                             // clear results
                //$('#' + en).parent().removeClass("hoverTable").addClass('hoverTable');         // add hoverTable class to table for highlighting on hovering
                //$('#' + en).html(d[0]);
                if (d[1] >= ns) {
                    app.ShowMessage('Your search criteria returned more than ' + ns + ' schools. Below is a list of the top ' + ns + ' schools ordered by school name. If you do not see the school you are looking for on this list please revise your search criteria and try again', 'Over 200 results', true, 480, 170);
                }
                var returnedData = d[2];
                // add scroll functionality to the top table
                $.get('../Templates/schoolSearchByNameResults.tmpl.htm', function (template) {
                    // reset result table
                    $('#dvSchBottomSearchResults').show();
                    $('#tbodyschByNameBottomResult').empty();
                    $('#tbodyschByNameBottomResult').removeClass('scrollableSchoolTable');
                    // if number of records > 15 then show scroll bar
                    if (d[1] > 7) {
                        $('#tbodyschByNameBottomResult').addClass('scrollableSchoolTable');
                    }
                    // populate results
                    $.tmpl(template, returnedData).appendTo('#tbodyschByNameBottomResult');
                });

            },
            complete: function () {
                // we put the view state and event validation fields back into the form.
                vs.appendTo($("#form1"));
                ev.appendTo($("#form1"));
                $('#divPleaseWaitOnLoad').hide();
                $('#dvResetByName').show();
            }
        });
    },
    //#region fill in form values from session variable
    fillInForm: function (formFieldValues) {
        if (formFieldValues != '') {
            var arr = formFieldValues.split('&');
            for (ii = 0; ii < arr.length - 1; ii++) {
                if (!arr[ii] == '') {
                    var sp = arr[ii].split('=');
                    var k = sp[0];
                    var v = sp[1];
                    var e = $('[name="' + k + '"]');
                    if (!e.length) { }
                    var n = $(e).attr('name');
                    var type = $(e).prop("type");
                    if (type == "radio") {
                        $("[name=" + k + "]").filter("[value=" + v + "]").attr("checked", "checked");
                    }
                    else if (type == "checkbox") {
                        var vArray = v.split(',');
                        $(vArray).each(function (i, vv) {
                            $('[value="' + vv + '"]').attr('checked', true);
                        });
                    }
                    else if (type == "select-multiple" || type == "select-one") {
                        var vArray = v.split(',');
                        $("[name=" + k + "]").val(eval(vArray));
                    }
                    else {
                        $(e).val(v);
                    }
                }
            }
        }
    },
    //#endregion
    //#region estimations accordion
    toggleEstimations: function (el) {
        var en = $(el).attr('en');
        var id = $(el).attr('id');
        var container = $("#" + id + "container");
        var icon = $('.' + id + 'icon');
        var img;
        var title = $('#' + id + 'title').attr('title');
        if (en == 0) {
            $(container).show();
            $(el).attr('en', 1);
            //$('#' + id + 'title').html('');
            $(el).removeClass('titlecollapse').addClass('titleexpand');
            $(icon).removeClass('iconcollapse').addClass('iconexpand');
            img = $($(icon).html());
            img.attr('src', '../../images/arrow_button_up.png')
            img.css("margin-bottom", "1px");
            $(icon).html(img);
        } else {
            $(container).hide();
            $(el).attr('en', 0);
            //$('#' + id + 'title').html(title);
            $(el).removeClass('titleexpand').addClass('titlecollapse');
            $(icon).removeClass('iconexpand').addClass('iconcollapse');
            img = $($(icon).html());
            img.attr('src', '../../images/arrow_down-11-12.png');
            img.css("margin-bottom", "0px");
            $(icon).html(img);
        }
    }
    //#endregion
}

var util = new Util();

/* hash table implementation*/
var JSHash = function () {
    this.Keys = [];
}
JSHash.prototype = {
    add: function (key) {
        // Allow only strings or numbers as keys
        if (typeof (key) == "string") {
            if (key == null) {
                return "Key or Value cannot be null";
            }
            var keysLength = this.Keys.length;
            for (var i = 0; i < keysLength; i++) {
                if (this.Keys[i] == key) {
                    return "Duplicate keys not allowed!";
                }
            }
            this.Keys.push(key);
        }
        else {
            return "Only number or string can be key!";
        }
    },
    remove: function (key) {
        if (key == null) {
            return "Key cannot be null";
        }
        var keysLength = this.Keys.length;
        var flag = false;
        for (var i = 0; i < keysLength; i++) {
            if (this.Keys[i] == key) {
                this.Keys.splice(i, 1);
                flag = true;
                break;
            }
        }
        if (!flag) {
            return "Key does not exist";
        }
    }
}

function HashTable() {
    this.length = 0;
    this.items = new Array();
    for (var i = 0; i < arguments.length; i += 2) {
        if (typeof (arguments[i + 1]) != 'undefined') {
            this.items[arguments[i]] = arguments[i + 1];
            this.length++;
        }
    }

    this.removeItem = function (in_key) {
        var tmp_previous;
        if (typeof (this.items[in_key]) != 'undefined') {
            this.length--;
            var tmp_previous = this.items[in_key];
            delete this.items[in_key];
        }

        return tmp_previous;
    }

    this.getItem = function (in_key) {
        return this.items[in_key];
    }

    this.setItem = function (in_key, in_value) {
        var tmp_previous;
        if (typeof (in_value) != 'undefined') {
            if (typeof (this.items[in_key]) == 'undefined') {
                this.length++;
            } else {
                tmp_previous = this.items[in_key];
            }

            this.items[in_key] = in_value;
        }

        return tmp_previous;
    }

    this.hasItem = function (in_key) {
        return typeof (this.items[in_key]) != 'undefined';
    }

    this.clear = function () {
        for (var i in this.items) {
            delete this.items[i];
        }

        this.length = 0;
    }
}

