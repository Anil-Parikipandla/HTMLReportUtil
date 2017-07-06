var pubXMLDoc;
var moduleNode = "";
var scenNode = "";
var strAppName = "";
var strModuleName = "";
var strScenID = "";
var strScenCount = "";
var strReload = "";
var ScenariopassedCount = 0;
var ScenariofailedCount = 0;
var ScenarioUnexecutedCount = 0;

function applydate() {
    var reportdate = document.getElementById("dt").value
    document.getElementById("testsum").innerHTML = "TEST EXECUTION SUMMARY - " + reportdate
}

function CycleSummary(app) {
    toggleMe(app);
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

function createReport(xmlDoc) {
    //xmlDoc.setProperty("SelectionLanguage", "XPath");
    //strAppName=xmlDoc.getElementsByTagName("TestScript")[0].childNodes[0].nodeValue;
    //document.getElementById("appName").innerText=strAppName;
    document.getElementById("appType").innerText = 'SampleType';
    document.getElementById("testEnv").innerText = '6X';
    document.getElementById("testType").innerText = 'Regression';
    strAppName = xmlDoc.getElementsByTagName("TestScript")[0].getAttribute('name');
    document.getElementById("appName").innerText = strAppName;
    document.getElementById("execDate").innerText = xmlDoc.getElementsByTagName("StartTime")[0].childNodes[0].nodeValue;
    document.getElementById("execTime").innerText = xmlDoc.getElementsByTagName("EndTime")[0].childNodes[0].nodeValue;
    hideAllDivs();
}

function hideAllDivs() {
    var allDivs = document.getElementsByTagName('DIV');
    for (i = 0; i < allDivs.length; i++) {
        allDivs[i].style.display = 'none'
    }
    return;
}

// function generateModuleList() {
//     var allModules = pubXMLDoc.getElementsByTagName('Reports');
//
//     strModuleList = "";
//     strModuleList += "<TABLE CLASS=Summary WIDTH=100%><TR CLASS=header><TH COLSPAN=100% ALIGN=CENTER>";
//     strModuleList += "<B> " + strAppName + " PROJECT - MODULE LEVEL REPORT</B></TH></TR>";
//     strModuleList += "<TR ALIGN=CENTER CLASS=subheader><TD WIDTH=5%><B>S.NO.</B></TD>";
//     strModuleList += "<TD WIDTH=30%><B>MODULE ID</B></TD>";
//     strModuleList += "<TD WIDTH=30%><B>MODULE NAME</B></TD>";
//
//     strModuleList += "<TD WIDTH=15%><B>TOTAL SCENARIOS</B></TD>";
//     strModuleList += "<TD WIDTH=15%><B>STATUS</B></TD>	</TR>";
//
//
//     strModID = pubXMLDoc.getElementsByTagName('Reporter')[0].getAttribute('name');
//     strModStatus = pubXMLDoc.getElementsByTagName('Reporter')[0].getAttribute('status');
//     strModName = pubXMLDoc.getElementsByTagName('Reporter')[0].getAttribute('name');
//     strScenCount = 19;
//     //#############################################################################################################################
//     //strScenCount=pubXMLDoc.getElementsByTagName('Iterations')[0].childNodes[0].nodeValue;
//     strModNameInQuotes = '"' + strModID + '"';
//     if (strModStatus.toLowerCase() == "failed") {
//         strBgColor = "FFCECE";
//     } else {
//         strBgColor = "CEFFCE";
//     }
//     strModuleList += "<TR ALIGN=CENTER>	<TD>" + 1 + "</TD><TD><A HREF='#' onclick='generateModuleReport(" + strModNameInQuotes + ")" + "'> " + strModID + "</A></TD>";
//     strModuleList += "<TD>" + strModName + "</TD><TD>" + strScenCount + "</TD><TD BGCOLOR=" + strBgColor + ">" + strModStatus + "</TD></TR>";
//     strModuleList += "</TABLE>";
//     document.getElementById("moduleList").innerHTML = strModuleList;
//     toggleMe("moduleList");
// }
//-------------------------------------------------------------
function generateModuleList(){
  var allModules=pubXMLDoc.getElementsByTagName('Reporter');

  strModuleList="";
  strModuleList+="<TABLE CLASS=Summary WIDTH=100%><TR CLASS=header><TH COLSPAN=100% ALIGN=CENTER>";
  strModuleList+="<B> "+ strAppName + " PROJECT - MODULE LEVEL REPORT</B></TH></TR>";
  strModuleList+="<TR ALIGN=CENTER CLASS=subheader><TD WIDTH=5%><B>S.NO.</B></TD>";
  strModuleList+="<TD WIDTH=30%><B>MODULE ID</B></TD>";
  strModuleList+="<TD WIDTH=30%><B>MODULE NAME</B></TD>";
  strModuleList+="<TD WIDTH=15%><B>TOTAL SCENARIOS</B></TD>";
  strModuleList+="<TD WIDTH=15%><B>STATUS</B></TD>	</TR>";


  for(i=0;i<allModules.length;i++){
    var parentTag = pubXMLDoc.getElementsByTagName('Report')[i];
    strModID = allModules[i].getAttribute('name');
    strModStatus = allModules[i].getAttribute('status');
    strModName = allModules[i].getAttribute('name');
    strScenCount = parseInt(allModules[i].getElementsByTagName('Iterations')[0].childNodes[0].nodeValue);
    strModNameInQuotes='"'+strModID+'"';
    if(strModStatus.toLowerCase()=="failed"){
    strBgColor="FFCECE";
    }else{
    strBgColor="CEFFCE";
    }
    strModuleList+="<TR ALIGN=CENTER>	<TD>" + (i+1) + "</TD><TD><A HREF='#' onclick='generateModuleReport("+ strModNameInQuotes +")"+ "'> "+ strModID + "</A></TD>";
    strModuleList+="<TD>" + strModName + "</TD><TD>" + strScenCount + "</TD><TD BGCOLOR="+strBgColor+">" + strModStatus + "</TD></TR>";

    //Creating Node for Module
    var newNode = pubXMLDoc.createElement('Module');
    var textNode = pubXMLDoc.createTextNode("This is a custom Module Node");
    newNode.appendChild(textNode);
    var statusAttribute = (pubXMLDoc.createAttribute('Status'));
    var iterationNameAttribute = (pubXMLDoc.createAttribute('Name'));
    var noOfScenarios = (pubXMLDoc.createAttribute('NoOfScenarios'));
    statusAttribute.value = strModStatus;
    iterationNameAttribute.value = strModName;
    noOfScenarios.value = strScenCount;
    newNode.innerHTML = strModName;
    newNode.setAttributeNode(statusAttribute);
    newNode.setAttributeNode(iterationNameAttribute);
    newNode.setAttributeNode(noOfScenarios);
    parentTag.appendChild(newNode);
    console.log(strModName + ' module Node appended');

  }
  strModuleList+="</TABLE>";
  document.getElementById("moduleList").innerHTML=strModuleList;
  toggleMe("moduleList");
  }



//-----------------------------------------------------------------

function getModuleWithName(givemoduleName){
      var All = pubXMLDoc.getElementsByTagName('Module');
      for (var a = 0; a < All.length; a++) {
          if (All[a].getAttribute('Name') == givemoduleName) {
              return All[a];
          }
      }
}


function getChildNodeValue(parent, child) {
    try {
        if (parent.getElementsByTagName(child)[0].childNodes[0] == null) {
            return (null);
        } else {
            return (parent.getElementsByTagName(child)[0].childNodes[0].nodeValue);
        }
    } catch (err) {
        alert(child);
    }
}

// function countNumberOfPassIterations(){
// 	var passedIterationsobj = findByAttributeValue((pubXMLDoc.getElementsByTagName('TestScript')[0]), 'Status','Pass');
// 	return passedIterationsobj.length;
// }

function getScenarioPassCount() {
    var Scenarios = pubXMLDoc.getElementsByTagName("Scenario");
    for (i = 0; i < Scenarios.length; i++) {
        var NoOfComments = findByAttributeValue(Scenarios[i], 'result', 'COMMENT');
        if ((Scenarios[i].getAttribute('Status')).toLowerCase() == 'pass') {
            ScenariopassedCount = ScenariopassedCount + 1;
        } else if ((Scenarios[i].getAttribute('Status')).toLowerCase() == 'fail') {
            ScenariofailedCount = ScenariofailedCount + 1;
        } else if ((NoOfComments.length) < 2) {
            ScenarioUnexecutedCount = ScenarioUnexecutedCount + 1;
        }
    }

}

function generateModuleSummary(moduleNode) {
    strModuleName = pubXMLDoc.getElementsByTagName('Reporter')[0].getAttribute('name');
    strBrowser = (findByAttributeValue(pubXMLDoc, 'result', 'ITERATION 1')).getElementsByTagName('ExpectedResult')[0].childNodes[0].nodeValue;
    getScenarioPassCount();
    // console.log('ScenariopassedCount:' + ScenariopassedCount);
    document.getElementById("modSumHeader").innerHTML = strModuleName + " MODULE - EXECUTION SUMMARY ";
    document.getElementById("buildID").innerHTML = 'NA';
    document.getElementById("os").innerHTML = 'NA';
    document.getElementById("machineName").innerHTML = 'NA';
    document.getElementById("browser").innerHTML = strBrowser.substring(10, 27);
    document.getElementById("execBy").innerHTML = 'NA';
    document.getElementById("autTool").innerHTML = 'Test Automation Center';
    document.getElementById("modExecStartTime").innerHTML = pubXMLDoc.getElementsByTagName("StartTime")[0].childNodes[0].nodeValue;
    document.getElementById("modExecEndTime").innerHTML = pubXMLDoc.getElementsByTagName("EndTime")[0].childNodes[0].nodeValue;
    document.getElementById("totalScen").innerHTML = pubXMLDoc.getElementsByTagName('Iterations')[0].childNodes[0].nodeValue;
    document.getElementById("passedScen").innerHTML = ScenariopassedCount;
    document.getElementById("failedScen").innerHTML = ScenariofailedCount;
    document.getElementById("IncompleteScen").innerHTML = ScenarioUnexecutedCount;
}

function convertTwelveToTewntyFour(InputTime){
  var StartDateObjects = InputTime.split(" ");
  var date = StartDateObjects[0];
  var time = StartDateObjects[1];
  var timeObjects = time.split(":");
  var hoursInInteger = parseInt(timeObjects[0]);
  if((StartDateObjects[2] === "AM") && (hoursInInteger === 12)){
    hoursInInteger = 00;
  } else if((StartDateObjects[2] === "PM") && (hoursInInteger === 12 )){
    hoursInInteger = 01;
  } else if ((StartDateObjects[2] === "PM") && (hoursInInteger < 12 )){
    hoursInInteger = hoursInInteger+12;
  }
  var dateObjects = date.split('/');
  //DateTime Format is mm,dd,yyyy,hh,mm,ss
  var TwentyFourTime = [parseInt(dateObjects[0]),parseInt(dateObjects[1]),parseInt(dateObjects[2]),hoursInInteger,parseInt(timeObjects[1]), parseInt(timeObjects[2])];
  console.log('24:'+TwentyFourTime);
  return TwentyFourTime;
}

function getTimeDifference(InputStartTime, InputEndTime){
  var d1 = convertTwelveToTewntyFour(InputStartTime);
  var d2 = convertTwelveToTewntyFour(InputEndTime);
  //
  var StartDate = new Date(d1[2],d1[0],d1[1],d1[3],d1[4],d1[5]);
  var EndDate = new Date(d2[2],d2[0],d2[1],d2[3],d2[4],d2[5]);
  var diffInMillis =  EndDate.getTime() - StartDate.getTime();
  var diffInHours = Math.floor(diffInMillis/1000/60/60);
  var diffInMinutes = ('0' + Math.floor((diffInMillis/1000/60)%60) ).substr(-2);
  var diffInSeconds = ('0' + Math.floor((diffInMillis/1000)%60) ).substr(-2);
  var DateDifference = diffInHours+"hr "+diffInMinutes+"min "+diffInSeconds+"sec";
  //console.log('Time Difference is: '+diffInHours+":"+diffInMinutes+":"+diffInSeconds);
  return DateDifference;
}

function generateScenariosList(moduleNode) {
    strScenList = "";
    strScenList += "<TR CLASS=header><TH COLSPAN=100% ALIGN=CENTER>";
    strScenList += "<B>" + strModuleName + " MODULE - SCENARIO LEVEL REPORT </B></TH></TR>";
    strScenList += "<TR CLASS=subheader><TD WIDTH=20%><B>SCENARIO ID</B></TD>";
    strScenList += "<TD WIDTH=15%><B>ITERATION</B></TD>";
    strScenList += "<TD WIDTH=15%><B>POLICY NUMBER</B></TD>";
    strScenList += "<TD WIDTH=15%><B>EXECUTION DURATION</B></TD>";
    strScenList += "<TD WIDTH=10%><B>STATUS</B></TD>";
    var allScenarios = pubXMLDoc.getElementsByTagName("Scenario");
    for (i = 0; i < allScenarios.length; i++) {
        strScenId = allScenarios[i].getAttribute("TCID");
        strScenIteration = "ITERATION " + allScenarios[i].getElementsByTagName('Iteration')[0].childNodes[0].nodeValue;
        //ScenarioDuration;
        var ele = allScenarios[i].getElementsByTagName('ActualResult');
        var eleArr = (ele[0].childNodes[0].nodeValue).split("-");
        InputStartTime = eleArr[1].trim();
      //   var InputStartTime = (ele[0].childNodes[0].nodeValue).substring(12);
      //  console.log('##:'+InputStartTime);

        var InputEndTime;
        if(i === allScenarios.length-1){
          var modName = moduleNode.getAttribute('Name');
        var  elem = findByAttributeValueInModules(pubXMLDoc, 'name', modName);
        var endTimeObj = findByAttributeValue(elem, 'result', 'COMPLETED');
        var EndTimeObjValue = endTimeObj.getElementsByTagName('ConsoleOutput')[0].childNodes[0].nodeValue;
        var TimeStart =  EndTimeObjValue.search("End Time:");
        var TimeEnd = EndTimeObjValue.search("Total Time:")
        // console.log("Difference of the TimeStart and End:"+TimeStart-TimeEnd);
        InputEndTime = EndTimeObjValue.substring(TimeStart+10,TimeEnd-1);
      //  console.log("@@: "+InputEndTime);
        } else {
          var eleEnd = allScenarios[i+1].getElementsByTagName('ActualResult');
          var eleEndArr = (eleEnd[0].childNodes[0].nodeValue).split("-");
          InputEndTime = eleEndArr[1].trim();
      //    console.log("@#: "+InputEndTime);
        }

        strScenDuration = getTimeDifference(InputStartTime, InputEndTime);
        console.log(strScenDuration +'for '+ strScenIteration);


        //strScenDesc=allScenarios[i].getElementsByTagName('ConsoleOutput')[0].childNodes[0].nodeValue;
        function getPolicyFormNumber(sampledoc, attribute, value) {
            var allitems = sampledoc.getElementsByTagName('ReportItem');
            var policyNumber = '';
            for (var a = 0; a < allitems.length; a++) {
                if (allitems[a].getAttribute(attribute) == value) {
                    policyNumber = allitems[a].getElementsByTagName('ActualResult')[0].childNodes[0].nodeValue;
                    break;
                } else {
                    policyNumber = 'NA';
                }
            }
            return policyNumber;
        }

        strPolicyNumber = getPolicyFormNumber(allScenarios[i], 'caption', 'Generated Policy Number ');
        //	strPolicyNumber=findByAttributeValue(allScenarios[i],'caption','Generated Policy Number ').getElementsByTagName('ActualResult')[0].childNodes[0].nodeValue;
        //strScenDuration = 'SampleDuration';
        strScenStatus = allScenarios[i].getAttribute("Status");
        strScenIdInQuotes = '"' + strScenId + '"';
        if (strScenStatus.toLowerCase() == "fail") {
            strBgColor = "FFCECE";
        } else {
            strBgColor = "CEFFCE";
        }
        strScenList += "<TR><TD><A HREF='#' onclick='generateScenariosReport(" + strScenIdInQuotes + ")" + "'> " + strScenId + "</A></TD>";
        //strScenList+="<TD>"+strScenIteration+"</TD><TD>" + strScenDuration + "</TD><TD BGCOLOR="+strBgColor+">" + strScenStatus + "</TD></TR>";
        strScenList += "<TD>" + strScenIteration + "</TD><TD>" + strPolicyNumber + "</TD><TD>" + strScenDuration + "</TD><TD BGCOLOR=" + strBgColor + ">" + strScenStatus + "</TD></TR>";
    }

    document.getElementById("scenList").innerHTML = strScenList;
    toggleMe("moduleSum");
}

function findByAttributeValue(sourceDocument, attribute, value) {
    var All = sourceDocument.getElementsByTagName('ReportItem');
    for (var a = 0; a < All.length; a++) {
        if (All[a].getAttribute(attribute) == value) {
            return All[a];
        }
    }
}

function findByAttributeValueInModules(sourceDocument, attribute, value){
  var All = sourceDocument.getElementsByTagName('Reporter');
  for (var a = 0; a < All.length; a++) {
      if (All[a].getAttribute(attribute) == value) {
          return All[a];
      }
  }
}

// function getIteration(modName) {
//     var strScenCount = parseInt(findByAttributeValueInModules(pubXMLDoc, 'name', modName).getElementsByTagName('Iterations')[0].childNodes[0].nodeValue);
//     var iterationStart;
//     var iterationEnd;
//     var iterationStartEventId;
//     var iterationEndEventId;
//     var currentModuleNode = ((findByAttributeValueInModules(pubXMLDoc, 'name', modName)).parentNode).parentNode;
//     for (NoOfIterations = 1; NoOfIterations <= strScenCount; NoOfIterations++) {
//         //console.log('IterationCount: '+strScenCount);
//
//         iterationStart = findByAttributeValue(pubXMLDoc, 'result', 'ITERATION ' + NoOfIterations);
//         iterationStartEventId = iterationStart.getAttribute('eventId');
//         if (NoOfIterations === strScenCount) {
//             iterationEnd = findByAttributeValue(pubXMLDoc, 'result', 'COMPLETED');
//             iterationEndEventId = (iterationEnd.getAttribute('eventId') - 1);
//         } else {
//             iterationEnd = findByAttributeValue(pubXMLDoc, 'result', 'ITERATION ' + (NoOfIterations + 1));
//             iterationEndEventId = (iterationEnd.getAttribute('eventId') - 1);
//         }
//
//         var IterationNode = createNode(NoOfIterations, iterationStartEventId, iterationEndEventId);
//         //return IterationNode;
//     }
//
// }

function getIteration(modName) {
    var strScenCount = parseInt(findByAttributeValueInModules(pubXMLDoc, 'name', modName).getElementsByTagName('Iterations')[0].childNodes[0].nodeValue);
    var iterationStart;
    var iterationEnd;
    var iterationStartEventId;
    var iterationEndEventId;
    var currentModuleNode = ((findByAttributeValueInModules(pubXMLDoc, 'name', modName)).parentNode).parentNode;
    for (NoOfIterations = 1; NoOfIterations <= strScenCount; NoOfIterations++) {
        //console.log('IterationCount: '+strScenCount);

        iterationStart = findByAttributeValue(currentModuleNode, 'result', 'ITERATION ' + NoOfIterations);
        iterationStartEventId = iterationStart.getAttribute('eventId');
        if (NoOfIterations === strScenCount) {
            iterationEnd = findByAttributeValue(currentModuleNode, 'result', 'COMPLETED');
            iterationEndEventId = (iterationEnd.getAttribute('eventId') - 1);
        } else {
            iterationEnd = findByAttributeValue(currentModuleNode, 'result', 'ITERATION ' + (NoOfIterations + 1));
            iterationEndEventId = (iterationEnd.getAttribute('eventId') - 1);
        }

        var IterationNode = createNode(currentModuleNode,modName, NoOfIterations, iterationStartEventId, iterationEndEventId);
        //return IterationNode;
    }
    return getModuleWithName(modName);

}

function getScenarioStartTime(currentModuleNode,iterationStartEventId){
  var ele = findByAttributeValue(currentModuleNode, 'eventId',iterationStartEventId).getElementsByTagName('ActualResult');
  // console.log(((ele)[0].getElementsByTagName('ActualResult')[0].childNodes[0]).nodeValue);
  return (ele[0].childNodes[0].nodeValue);

}

function createNode(currentModuleNode,modName, NoOfIterations, iterationStartEventId, iterationEndEventId) {
    var iterationStatus = getIterationStatus(currentModuleNode, iterationStartEventId, iterationEndEventId);
    var parentTag = getModuleWithName(modName);
    var newNode = pubXMLDoc.createElement('Scenario');
    //newNode.id = "Anil";
    var textNode = pubXMLDoc.createTextNode("This is a custom Node");
    newNode.appendChild(textNode);
    var statusAttribute = (pubXMLDoc.createAttribute('Status'));
    var startTimeAttribute = (pubXMLDoc.createAttribute('ScenarioStartTime'));
    var iterationName = getTCID(currentModuleNode, iterationStartEventId, iterationEndEventId);
    var iterationNameAttribute = (pubXMLDoc.createAttribute('TCID'));

    // var iterationName = iterationNameobj[0].childNodes[0].nodeValue;

    statusAttribute.value = iterationStatus;
    iterationNameAttribute.value = iterationName;
    startTimeAttribute.value = getScenarioStartTime(currentModuleNode, iterationStartEventId).substring(13);
    newNode.innerHTML = "NodeIteration" + NoOfIterations;
    newNode.setAttributeNode(statusAttribute);
    newNode.setAttributeNode(iterationNameAttribute);
    newNode.setAttributeNode(startTimeAttribute);
    parentTag.appendChild(newNode);
    console.log('node appended to parentTag');
    // console.log('Iteration Status: '+iterationStatus);

    for (i = iterationStartEventId; i <= iterationEndEventId; i++) {
        var ele = findByAttributeValue(currentModuleNode, 'eventId', i);
        newNode.appendChild(ele);
        // console.log('node added');
    }
    strReload = 'Nodes already created!';
    console.log('node appended');
    return newNode;
}


// function createNode(NoOfIterations, iterationStartEventId, iterationEndEventId) {
//     var iterationStatus = getIterationStatus(iterationStartEventId, iterationEndEventId);
//     var parentTag = pubXMLDoc.getElementsByTagName('TestScript')[0];
//     var newNode = pubXMLDoc.createElement('Scenario');
//     //newNode.id = "Anil";
//     var textNode = pubXMLDoc.createTextNode("This is a custom Node");
//     newNode.appendChild(textNode);
//     var statusAttribute = (pubXMLDoc.createAttribute('Status'));
//     var iterationName = getTCID(iterationStartEventId, iterationEndEventId);
//     var iterationNameAttribute = (pubXMLDoc.createAttribute('TCID'));
//     // var iterationName = iterationNameobj[0].childNodes[0].nodeValue;
//
//     statusAttribute.value = iterationStatus;
//     iterationNameAttribute.value = iterationName;
//     newNode.innerHTML = "NodeIteration" + NoOfIterations;
//     newNode.setAttributeNode(statusAttribute);
//     newNode.setAttributeNode(iterationNameAttribute);
//     parentTag.appendChild(newNode);
//     console.log('node appended to parentTag');
//     // console.log('Iteration Status: '+iterationStatus);
//
//     for (i = iterationStartEventId; i <= iterationEndEventId; i++) {
//         var ele = findByAttributeValue(pubXMLDoc, 'eventId', i);
//         newNode.appendChild(ele);
//         // console.log('node added');
//     }
//     strReload = 'Nodes already created!';
//     console.log('node appended');
//     return newNode;
// }

function getIterationStatus(currentModuleNode, start, end) {
    var IterationStatus = 'PASS';
    for (i = start; i <= end; i++) {
        var ResultItem = findByAttributeValue(currentModuleNode, 'eventId', i);
        if (((ResultItem.getAttribute('result')) === 'EXCEPTION')||(ResultItem.getAttribute('result')) === 'FAILED') {
            IterationStatus = 'FAIL';
        }
    }
    return IterationStatus;
}

function getTCID(currentModuleNode, start, end) {
    var TCIDe = '';
    var step = '';
    var arrayIndex = 0;
    for (var i = start; i <= end; i++) {
        step = findByAttributeValue(currentModuleNode, 'eventId', i);
        if (step.getAttribute('caption') == 'StartOfTestCase') {
            return TCIDe = (step.getElementsByTagName('ActualResult'))[0].childNodes[0].nodeValue;
        }
    }
}


//#############################################################################################################

function generateModuleReport(modName) {
		ScenariopassedCount = 0;
		ScenariofailedCount = 0;
		ScenarioUnexecutedCount = 0;
    var moduleNode = getIteration(modName);
    generateScenariosList(moduleNode);
    generateModuleSummary(moduleNode);

}


// function generateModuleReport(modName) {
// 		ScenariopassedCount = 0;
// 		ScenariofailedCount = 0;
// 		ScenarioUnexecutedCount = 0;
//     if (strReload != "") {
//         console.log('No Reload');
//     } else {
//         var moduleNode = getIteration(modName);
//     }
//     generateScenariosList(moduleNode);
//     generateModuleSummary(moduleNode);
//
// }


function generateScenariosReport(scenID) {
    var allScenarios = pubXMLDoc.getElementsByTagName("Scenario");
    for (i = 0; i < allScenarios.length; i++) {
        var NodeId = allScenarios[i].getAttribute("TCID");
        if (NodeId == scenID) {
            scenNode = allScenarios[i];
            break;
        }
    }
    GenerateScenarioSummary(scenNode);
    generateStepList(scenNode);
}

function GenerateScenarioSummary(scenNode) {
    strScenID = scenNode.getAttribute("TCID");
    document.getElementById("scenSumHeader").innerHTML = strScenID + " SCENARIO - EXECUTION SUMMARY";
    //document.getElementById("scenModName").innerHTML=strModuleName;
    strModNameInQuotes = '"' + strModuleName + '"';
    document.getElementById("scenModName").innerHTML = "<A HREF='#' onclick='generateModuleReport(" + strModNameInQuotes + ")" + "'> " + strModuleName + "</A>"
    document.getElementById("scenID").innerHTML = strScenID;
    document.getElementById("scenDesc").innerHTML = 'SampleDescription';
		strBrowser = (findByAttributeValue(pubXMLDoc, 'result', 'ITERATION 1')).getElementsByTagName('ExpectedResult')[0].childNodes[0].nodeValue;
    document.getElementById("scenBrowser").innerHTML = strBrowser;
    document.getElementById("scenExecStartTime").innerHTML = 'SampleStartTime';
    document.getElementById("scenExecEndTime").innerHTML = 'SampleEndTime';

    // document.getElementById("scenDesc").innerHTML=getChildNodeValue(moduleNode,"Description");
    // document.getElementById("scenBrowser").innerHTML=getChildNodeValue(moduleNode,"Browser");
    // document.getElementById("scenExecStartTime").innerHTML=getChildNodeValue(scenNode,"StartTime");
    // document.getElementById("scenExecEndTime").innerHTML=getChildNodeValue(scenNode,"EndTime");
}


function getStepStatus(element) {
    var stepStatus = element.getAttribute('result');
    if (stepStatus.toLowerCase() == 'exception' || stepStatus.toLowerCase() == 'failed') {
        stepStatus = 'FAIL';
    } else if (stepStatus.toLowerCase() == 'warning') {
        stepStatus = 'WARNING';
    } else {
        stepStatus = 'PASS';
    }
    console.log('stepStatus: ' + stepStatus);
    return stepStatus;
}



function generateStepList(scenNode) {
    strStepList = "";
    strStepList += "<TR CLASS=header><TH COLSPAN=100% ALIGN=CENTER>";
    strStepList += "<B>" + strScenID + " SCENARIO - STEP LEVEL REPORT </B></TH></TR>";
    strStepList += "<TR CLASS=subheader><TD WIDTH=5%><B>STEP ID</B></TD>";
    strStepList += "<TD WIDTH=35%><B>STEP DESCRIPTION</B></TD>";
    strStepList += "<TD WIDTH=45%><B>ACTION(S) PERFORMED</B></TD>";
    strStepList += "<TD align=center WIDTH=5%><B>STATUS</B></TD>";
    var allSteps = scenNode.getElementsByTagName("ReportItem");
    for (i = 0; i < allSteps.length; i++) {
        strStepId = allSteps[i].getAttribute("stepNumber");
        strStepDesc = allSteps[i].getAttribute('caption');
        // strStepDesc=getChildNodeValue(allSteps[i],"Description");
        strStepKeyword = allSteps[i].getElementsByTagName('ConsoleOutput')[0].childNodes[0].nodeValue;

        strStepStatus = getStepStatus(allSteps[i]);
        // strStepStatus=getChildNodeValue(allSteps[i],"Status");
        screenPath = '';
        // screenPath=getChildNodeValue(allSteps[i],"ScreenLink");
        strStepStatusInQuotes = '"' + strStepStatus + '"';

        if (strStepStatus.toLowerCase() == "fail") {
            //strBgColor="EF2C2C";
            strBgColor = "FFCECE";
        } else if (strStepStatus.toLowerCase() == "pass") {
            //strBgColor="4CAF50";
            strBgColor = "CEFFCE";
        } else if (strStepStatus.toLowerCase() == "warning") {
            strBgColor = "FFFF7F";
        }

        if (screenPath == null) {
            strlink = strStepStatus;
        } else {
            strlink = "<A target=_blank HREF=" + screenPath + " > " + strStepStatus + "</A>";
        }
        strStepList += "<TR><TD>" + strStepId + "</TD>";
        strStepList += "<TD>" + strStepDesc + "</TD>";
        strStepList += "<TD> " + strStepKeyword + "</A> </TD>";
        strStepList += "<TD align=center BGCOLOR=" + strBgColor + ">" + strlink + "</TD></TR>";
    }
    document.getElementById("stepList").innerHTML = strStepList;
    toggleMe("scenSum");
}
