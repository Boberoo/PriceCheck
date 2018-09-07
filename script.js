var host = "omnidemo.eastus.cloudapp.azure.com";//"10.0.0.101";
var port = "55683";// "8081";
var companyName = "SA Example Company [Demo]";
var debug = false; //show more info, useful for debugging


function formatLevel(level) {
  var htmlLevel = '<div class="level" ';
  if (level < 1) {
    htmlLevel += "style='color:red'>Out of Stock";
    //$(".level").css("color", "red");
  } else if (level < 5) {
    htmlLevel += "style='color:orange'>In Stock";
    //$(".level").css("color", "orange");
  } else {
    htmlLevel += "style='color:green'>In Stock";
    //$(".level").css("color", "green");
  }

  htmlLevel += "</div>";
  return htmlLevel;
}

function formatStockInfo(stockInfo) {
  // return '<div class="stock-desc" >'+stockInfo.stock_description+'</div><div class="price" >'+stockInfo.selling_price_incl.toFixed(2)+'</div>'+formatLevel(stockInfo.level);
  return (
    "<h3>" +
    stockInfo.stock_description +
    "</h3><h2>" +
    stockInfo.selling_price_incl.toFixed(2) +
    "</h2>" +
    formatLevel(stockInfo.level)
  );
}

  

function showStockInfo() {
  $("#results").html("...");
  $("#message").html("Please wait..");
  
  
  var url = "http://"+host+":"+port+"/Report/Stock Export?IBarCode=" +
      encodeURIComponent($("#barcode").val()) +
      "&CompanyName="+encodeURIComponent(companyName);
  

  if (debug) {
    $("#results").html(url);
  }

    
  function showResults (response) {
      $("#message").html("....");
      try {
       // var response = JSON.parse(responseText);
        $("#message").html(response.stock_export.length + " records found");
      } catch (err) {
        $("#message").html("Error: " + response);
        $("#message").css("color", "red");
         return false;
      }
      $("#message").css("color", "");
      var resultHTML = "<ul>";

      for (var i = 0; i < response.stock_export.length; i++) {
        resultHTML +=
          "<li>" + formatStockInfo(response.stock_export[i]) + "</li>";
       }
       resultHTML += "</ul>";
       $("#results").html(resultHTML);
       
  };

  
$.ajax({
    type: 'GET',
    url: url,
    headers: { 'Authorization': "Basic " + btoa($("#username").val()+':'+$("#pwd").val()) }, //needs 7.17.64.3353 which returns Access-Control-Allow-Headers: Authorization now. NB works in Chrome, in and outside a web server, still not working in CodePen though?! >> looking at exception in Chrome developer tools, it says codepen is https, so all ajax calls must ALSO use https
    crossDomain: true,
    //data: '{"some":"json"}',
    dataType: 'json', //NB. jsonp can be used for GET only, no POST
    success: function(responseData, textStatus, jqXHR) {
        $("#message").html("Loaded");
        showResults (responseData);
    },
    error: function (err) {
      //console.log(err);
        $("#message").html(err.statusText+" "+err.status);
        $("#message").css("color", "red");  
    }
});  
  
    //xhttp.open("GET", url, true /*, $("#username").val(), $("#pwd").val()*/);
    //xhttp.setRequestHeader("Authorization",
     // "Basic " + btoa($("#username").val() + ":" + $("#pwd").val()));
    //xhttp.send(); would have worked too, web service just didn't have correct headers, and was calling http from inside https
 // } catch (err) {
 //   $("#message").html("Error: " + err);
 //   $("#message").css("color", "red");
 // }

 /* $.getJSON(url+'&callback=?').done( //might work, didn't have http in front of IP address
    function(data) {
      alert(data);
     
      $("#message").html(data.stock_export.length+" records found");
      //$("#level").html(data.stock_level);
      //$("#price").html(data.selling_price);
      //$("#description").html(data.stock_description);
      
         
      }
  ).fail(function(jqXHR, textStatus, errorThrown) { 
      $("#message").html(textStatus+" "+errorThrown+" "+jqXHR.responseText);
      $("#message").css("color", "pink");  });*/
  
}

$(document).ready(function() {
  $("#scanner").hide();

  $("#logonForm").submit(function(event) {
    event.preventDefault(); // cancel default submit behavior
    $("#logon").hide();
    $("#scanner").show();
    $("#barcode").focus();
    return false; //stop rest of submitting
  });
  $("#scanForm").submit(function(event) {
    event.preventDefault(); // cancel default submit behavior
    showStockInfo();
    $("#barcode").focus();
    $("#barcode").select();
    return false;
  });
});
