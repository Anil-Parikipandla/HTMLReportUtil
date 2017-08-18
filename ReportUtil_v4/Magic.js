var pubXMLDoc;
var moduleNode = "";
var strAppName = "";
var strScenCount = "";
var ScenariopassedCount = 0;
var ScenariofailedCount = 0;
var ScenarioUnexecutedCount = 0;
var XmlDataInJson = {};
var testCaseIdComment = "StartOfTestCase";
var policyNumberComment = "Policy Number";

function xmlToJson(xml) {
    // Create the return object
    var obj = {};
    if (xml.nodeType == 1) { // element
        // do attributes
        if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType == 3) { // text
        obj = xml.nodeValue;
    }
    // do children
    // If just one text node inside
    if (xml.hasChildNodes() && xml.childNodes.length === 1 && xml.childNodes[0].nodeType === 3) {
        obj = xml.childNodes[0].nodeValue;
    }
    else if (xml.hasChildNodes()) {
        for (var i = 0; i < xml.childNodes.length; i++) {
            var item = xml.childNodes.item(i);
            var nodeName = item.nodeName;
            if (typeof (obj[nodeName]) == "undefined") {
                obj[nodeName] = xmlToJson(item);
            } else {
                if (typeof (obj[nodeName].push) == "undefined") {
                    var old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(xmlToJson(item));
            }
        }
    }
    return obj;
}

function toggleMe(a) {
    var allDivs = document.getElementsByTagName('DIV');
    var e = document.getElementById(a);
    if (!e) return true;
    if (e.style.display == 'none') {
        for (i = 0; i < allDivs.length; i++) {
            allDivs[i].style.display = 'none'
        }
        e.style.display = 'block'
    } else {
        e.style.display = 'none'
    }
    return;
}

function handleFiles(files) {
    // Check for the various File API support.
    if (window.FileReader) {
        // FileReader are supported.
        getAsText(files[0]);
    } else {
        alert('FileReader are not supported in this browser.');
    }
    showtable('projectSummary');
    // toggleMe('projectsummary');
}

function showtable(tableid){
    var projectSummTable = document.getElementById('projectSummary');
    projectSummTable.style.display = 'table';
}

function getAsText(fileToRead) {
    var reader = new FileReader();
    // Handle errors load
    reader.onload = loadHandler;
    reader.onerror = errorHandler;
    // Read file into memory as UTF-8
    reader.readAsText(fileToRead);
}

function loadHandler(event) {
    var xml = event.target.result;
    //alert(xml);
    doc = stringtoXML(xml);
    pubXMLDoc = doc;
    XmlDataInJson = xmlToJson(doc);
    createReport(doc);
}

function errorHandler(evt) {
    if (evt.target.error.name == "NotReadableError") {
        alert("Canno't read file !");
    }
}

function stringtoXML(text) {
    if (window.ActiveXObject) {
        //var doc=new ActiveXObject('Microsoft.XMLDOM');
        var xmlDoc = new ActiveXObject("Msxml2.DOMDocument.6.0");
        doc.async = 'false';
        doc.loadXML(text);
    } else {
        var parser = new DOMParser();
        var doc = parser.parseFromString(text, 'text/xml');
    }
    return doc;
}

function createReport() {
    //xmlDoc.setProperty("SelectionLanguage", "XPath");
    //strAppName=xmlDoc.getElementsByTagName("TestScript")[0].childNodes[0].nodeValue;
    //document.getElementById("appName").innerText=strAppName;
    document.getElementById("appType").innerText = 'Web Application';
    document.getElementById("testEnv").innerText = '6X';
    document.getElementById("testType").innerText = 'Regression';
    strAppName = XmlDataInJson.Reports["@attributes"].name;
    document.getElementById("appName").innerText = XmlDataInJson.Reports["@attributes"].name
    document.getElementById("execDate").innerText = XmlDataInJson.Reports["@attributes"].startTime;
    document.getElementById("execTime").innerText = XmlDataInJson.Reports["@attributes"].endTime;
    // hideAllDivs();
}

function hideAllDivs() {
    var allDivs = document.getElementsByTagName('DIV');
    for (i = 0; i < allDivs.length; i++) {
        allDivs[i].style.display = 'none'
    }
    return;
}

function modifyJsonArchitecture() {
    for (index = 0; index < XmlDataInJson.Reports.Report.length; index++) {
        var report = XmlDataInJson.Reports.Report[index];
        var scenarios = [], iterations = [];
        var scenariostatus = "PASS";
        var commentCounter = 0;
        var scenarioName = "SampleScenario";
        for (var i = 0; i < XmlDataInJson.Reports.Report[index].TestScript.Reporter.ReportItems.ReportItem.length; i++) {
            var item = XmlDataInJson.Reports.Report[index].TestScript.Reporter.ReportItems.ReportItem[i];
            var result = item["@attributes"].result;
            var caption = item["@attributes"].caption;
            if (result.toLowerCase() === "failed" || result.toLowerCase() === "exception") {
                scenariostatus = "FAIL";
            }
            if (result.toLowerCase() === "comment") {
                commentCounter++;
            }
            if ((caption === testCaseIdComment) && (result.toLowerCase() === "comment")) {
                scenarioName = item.ActualResult;
            }
            if ((result.indexOf("ITERATION") > -1) || (result.indexOf("COMPLETED") > -1)) {
                if (iterations.length > 0) {
                    if (commentCounter < 6) {
                        scenariostatus = "SKIPPED";
                    }
                    iterations[0].tcid = scenarioName;
                    iterations[0].status = scenariostatus;
                    scenarios.push(iterations);
                    scenariostatus = "PASS";
                    commentCounter = 0;
                }
                iterations = [];
                iterations.push(item);
            } else {
                iterations.push(item);
            }
        }
        XmlDataInJson.Reports.Report[index].TestScript.Reporter.scenarioList = scenarios
        // XmlDataInJson.Reports.Report[index] = scenarios;
    }
}


function generateModuleList() {
    modifyJsonArchitecture();
    strModuleList = "";
    strModuleList += "<TABLE cellpadding=5px CLASS=Summary WIDTH=100%><TR CLASS=header><TH COLSPAN=100% ALIGN=CENTER>";
    strModuleList += "<B> " + strAppName + " PROJECT - MODULE LEVEL REPORT</B></TH></TR>";
    strModuleList += "<TR ALIGN=CENTER CLASS=subheader><TD style='padding-top: 10px; padding-bottom: 10px;' WIDTH=5%><B>S.NO.</B></TD>";
    strModuleList += "<TD WIDTH=25% style='padding-top: 10px; padding-bottom: 10px;' ><B>MODULE ID</B></TD>";
    strModuleList += "<TD WIDTH=25% style='padding-top: 10px; padding-bottom: 10px;' ><B>MODULE NAME</B></TD>";
    strModuleList += "<TD WIDTH=25% style='padding-top: 10px; padding-bottom: 10px;' ><B>TOTAL SCENARIOS</B></TD>";
    strModuleList += "<TD WIDTH=15% style='padding-top: 10px; padding-bottom: 10px;' ><B>STATUS</B></TD>	</TR>";

    for (i = 0; i < XmlDataInJson.Reports.Report.length; i++) {
        var parentTag = pubXMLDoc.getElementsByTagName('Report')[i];
        strModID = XmlDataInJson.Reports.Report[i].TestScript.Reporter["@attributes"].name;
        strModStatus = XmlDataInJson.Reports.Report[i].TestScript.Reporter["@attributes"].status;
        strModName = XmlDataInJson.Reports.Report[i].TestScript.Reporter["@attributes"].name;
        strScenCount = XmlDataInJson.Reports.Report[i].TestScript.Reporter.Iterations;
        strModNameInQuotes = '"' + XmlDataInJson.Reports.Report[i].TestScript.Reporter["@attributes"].name + '"';
        if (strModStatus.toLowerCase() == "failed") {
            strBgColor = "B22746 ";
        } else {
            strBgColor = "A3C644 ";
        }
        strModuleList += "<TR ALIGN=CENTER>	<TD>" + (i + 1) + "</TD><TD><A HREF='#' onclick='generateModuleReport(" + i + ")" + "'> " + strModID + "</A></TD>";
        strModuleList += "<TD>" + strModName + "</TD><TD>" + strScenCount + "</TD><TD BGCOLOR=" + strBgColor + ">" + strModStatus + "</TD></TR>";
        console.log(strModName + ' module Node appended');
    }

    strModuleList += "</TABLE>";
    document.getElementById("moduleList").innerHTML = strModuleList;
    toggleMe("moduleList");
}


function generateModuleReport(index) {
    generateModuleSummary(index);
    generateScenariosList(index);
    // toggleMe('projectsummary');
}


function getScenarioStatusСount(index) {
    ScenariopassedCount = 0, ScenariofailedCount = 0, ScenarioUnexecutedCount = 0;
    var scenario = XmlDataInJson.Reports.Report[index].TestScript.Reporter.scenarioList;
    for (i = 0; i < scenario.length; i++) {
        if ((scenario[i][0].status).toLowerCase() === "pass") {
            ScenariopassedCount++;
        } else if ((scenario[i][0].status).toLowerCase() === "fail") {
            ScenariofailedCount++;
        } else if ((scenario[i][0].status).toLowerCase() === "skipped") {
            ScenarioUnexecutedCount++;
        }
    }

}

function generateModuleSummary(index) {
    strModuleName = XmlDataInJson.Reports.Report[index].TestScript.Reporter["@attributes"].name;
    strBrowser = XmlDataInJson.Reports.Report[index].TestScript.Reporter.scenarioList[0][0].ExpectedResult;
    getScenarioStatusСount(index);
    // console.log('ScenariopassedCount:' + ScenariopassedCount);
    document.getElementById("modSumHeader").innerHTML = strModuleName + " MODULE - EXECUTION SUMMARY ";
    // document.getElementById("buildID").innerHTML = 'NA';
    // document.getElementById("os").innerHTML = 'NA';
    // document.getElementById("machineName").innerHTML = 'NA';
    document.getElementById("browser").innerHTML = strBrowser.substring(10, 27);
    // document.getElementById("execBy").innerHTML = 'NA';
    document.getElementById("autTool").innerHTML = 'Test Automation Center';
    document.getElementById("modExecStartTime").innerHTML = XmlDataInJson.Reports.Report[index].TestScript.Reporter.scenarioList[0][0].ActualResult;
    document.getElementById("modExecEndTime").innerHTML = "End Time";
    document.getElementById("totalScen").innerHTML = XmlDataInJson.Reports.Report[index].TestScript.Reporter.scenarioList.length;
    document.getElementById("passedScen").innerHTML = ScenariopassedCount;
    document.getElementById("failedScen").innerHTML = ScenariofailedCount;
    document.getElementById("IncompleteScen").innerHTML = ScenarioUnexecutedCount;
}

function generateScenariosList(index) {
    strModuleName = XmlDataInJson.Reports.Report[index].TestScript.Reporter["@attributes"].name;
    strScenList = "";
    strScenList += "<TR CLASS=header><TH COLSPAN=100% ALIGN=CENTER>";
    strScenList += "<B>" + strModuleName + " MODULE - SCENARIO LEVEL REPORT </B></TH></TR>";
    strScenList += "<TR CLASS=subheader><TD WIDTH=20% style='padding-top: 10px; padding-bottom: 10px;'><B>SCENARIO ID</B></TD>";
    strScenList += "<TD WIDTH=15%><B>ITERATION</B></TD>";
    strScenList += "<TD WIDTH=15%><B>POLICY NUMBER</B></TD>";
    strScenList += "<TD WIDTH=15%><B>EXECUTION DURATION</B></TD>";
    strScenList += "<TD WIDTH=10% align='center'><B>STATUS</B></TD>";
    var allScenarios = XmlDataInJson.Reports.Report[index].TestScript.Reporter.scenarioList;
    for (i = 0; i < allScenarios.length; i++) {
        //getting scenario Id
        strScenId = allScenarios[i][0].tcid;
        //getting scenario iteration
        strScenIteration = "ITERATION " + allScenarios[i][0].Iteration;
        //getting policy Number
        strPolicyNumber = getPolicyFormNumber(index, i);
        
        //getting scenario duration
        strScenDuration = "To be calculated";

        //getting scenario status
        strScenStatus = allScenarios[i][0].status;
        
        //Apply color to the status column
        if (strScenStatus.toLowerCase() == "fail") {
            strBgColor = "B22746 ";
        } else if (strScenStatus.toLowerCase() == "pass") {
            strBgColor = "A3C644 ";
        } else {
            strBgColor = "D2B4DE";
        }
        strScenList += "<TR><TD><A HREF='#' onclick='generateScenariosReport(" +index + "," + i + ")" + "'> " + strScenId + "</A></TD>";
        strScenList += "<TD>" + strScenIteration + "</TD><TD>" + strPolicyNumber + "</TD><TD>" + strScenDuration + "</TD><TD align='center' BGCOLOR=" + strBgColor + ">" + strScenStatus + "</TD></TR>";
    }
    document.getElementById("scenList").innerHTML = strScenList;
    toggleMe("moduleSum");
}

function getPolicyFormNumber(index, iteration) {
    var allitems = XmlDataInJson.Reports.Report[index].TestScript.Reporter.scenarioList[iteration];
    var policyNumber = '';
    for (var a = 0; a < allitems.length; a++) {
        if ((allitems[a]["@attributes"].result === "COMMENT")&&(allitems[a]["@attributes"].caption === policyNumberComment)) {
            policyNumber = allitems[a].ActualResult;
            break;
        } else {
            policyNumber = 'NA';
        }
    }
    return policyNumber;
}

function generateScenariosReport(index, iteration){
    generateScenarioSummary(index, iteration);
    generateStepList(index, iteration);
}

function generateScenarioSummary(index, iteration){
    //getting scenario id
    strScenID = XmlDataInJson.Reports.Report[index].TestScript.Reporter.scenarioList[iteration][0].tcid;

    //getting module name
    strModuleName = XmlDataInJson.Reports.Report[index].TestScript.Reporter["@attributes"].name;
    
    //getting browser name
    strBrowser = XmlDataInJson.Reports.Report[index].TestScript.Reporter.scenarioList[0][0].ExpectedResult;

    document.getElementById("scenSumHeader").innerHTML = strScenID + " SCENARIO - EXECUTION SUMMARY";
    document.getElementById("scenModName").innerHTML = "<A HREF='#' onclick='generateModuleReport("+index+")" + "'> " + strModuleName + "</A>"
    document.getElementById("scenID").innerHTML = strScenID;
    // document.getElementById("scenDesc").innerHTML = 'SampleDescription';
    // document.getElementById("scenBrowser").innerHTML = strBrowser;
    document.getElementById("scenExecStartTime").innerHTML = 'SampleStartTime';
    document.getElementById("scenExecEndTime").innerHTML = 'SampleEndTime';
}

function generateStepList(index, iteration){
    strStepList = "";
    strStepList += "<TR CLASS=header><TH COLSPAN=100% ALIGN=CENTER>";
    strStepList += "<B>" + strScenID + " SCENARIO - STEP LEVEL REPORT </B></TH></TR>";
    strStepList += "<TR CLASS=subheader><TD WIDTH=10% style='padding-top: 10px; padding-bottom: 10px;' ><B>STEP ID</B></TD>";
    strStepList += "<TD WIDTH=20%><B>STEP DESCRIPTION</B></TD>";
    strStepList += "<TD style='max-width: 45ch' WIDTH=60%><B>ACTION(S) PERFORMED</B></TD>";
    strStepList += "<TD align=center WIDTH=10%><B>STATUS</B></TD>";

    var allSteps = XmlDataInJson.Reports.Report[index].TestScript.Reporter.scenarioList[iteration];
    for (i = 0; i < allSteps.length; i++) {
        //getting step Id
        strStepId = allSteps[i]["@attributes"].stepNumber;
        //getting step description
        strStepDesc = allSteps[i]["@attributes"].caption;
        //getting stepdescription
        strStepKeyword = allSteps[i].ConsoleOutput;
        //getting step status
        strStepStatus = getStepStatus(allSteps[i]);
        strStepStatusInQuotes = '"' + strStepStatus + '"';

        //getting screenshot path
        screenPath = '';
        
        if (strStepStatus.toLowerCase() == "fail") {
            strBgColor = "B22746 ";
        } else if (strStepStatus.toLowerCase() == "pass") {
            strBgColor = "A3C644 ";
        } else if (strStepStatus.toLowerCase() == "warning") {
            strBgColor = "FFFF7F";
        }

        if (screenPath == null) {
            strlink = strStepStatus;
        } else {
            strlink = "<A target=_blank HREF=" + screenPath + " > " + strStepStatus + "</A>";
        }
        strStepList += "<TR><TD align='center'>" + strStepId + "</TD>";
        strStepList += "<TD>" + strStepDesc + "</TD>";
        strStepList += "<TD> " + strStepKeyword + "</A> </TD>";
        strStepList += "<TD align=center BGCOLOR=" + strBgColor + ">" + strlink + "</TD></TR>";
    }
    document.getElementById("stepList").innerHTML = strStepList;
    toggleMe("scenSum");
}

function getStepStatus(step){
    var stepStatus = step["@attributes"].result;
    if((stepStatus.toLowerCase() === "execption") || (stepStatus.toLowerCase() === "failed")){
       stepStatus = 'FAIL';
    } else if (stepStatus.toLowerCase() == 'warning') {
        stepStatus = 'WARNING';
    } else {
        stepStatus = 'PASS';
    }
    return stepStatus;
}
