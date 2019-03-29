function bankingPOC()
{
	this.bankingAPI_Url = "https://vast-shore-74260.herokuapp.com/banks?city=";
	this.bankCities = ["MUMBAI","Pune","COIMBATORE","BANGALORE","Delhi","CHENNAI","Kerala"];
	this.bankDetailsObj = {};
	this.currDataObj = "";
}

bankingPOC.prototype.renderBranchHtml = function()
{
	var _self = this;
	
	let bankingHtml = "";
	
	bankingHtml += "<div class='bankContainerDiv'>";
		bankingHtml += "<div class='bankHeaderDiv'>BANK POC</div>";
		bankingHtml += "<div class='bankCitiesSearchContainerDiv'>";
			bankingHtml += "<div class='bankCitiesSearchDiv'>";
				bankingHtml += "<div class='bankCitiesContainerDiv'>";
					bankingHtml += "<span class='bankCitiesSpan'>Cities:</span>";
					bankingHtml += "<select id='bankCitiesSelector'>";
						bankingHtml += "<option value='-1'>Select the City</option>";
						for(let i = 0; i < _self.bankCities.length; i++)
						{
							let bankCity = _self.bankCities[i].toUpperCase();
							bankingHtml += "<option value='"+ bankCity +"'>"+ bankCity +"</option>";
						}
					bankingHtml += "</select>";
				bankingHtml += "</div>";
				bankingHtml += "<div class='bankSearchContainerDiv'>";
					bankingHtml += "<input type='search' id='bankSearch' placeholder='Search Here'>";
				bankingHtml += "</div>";		
			bankingHtml += "</div>";			
		bankingHtml += "</div>";
	bankingHtml += "</div>";
	
	$('#bankingContainerDiv').html(bankingHtml).promise().done(function(){
        _self.renderBranchDetailsHeaderHtml();
    });
};

bankingPOC.prototype.renderBranchDetailsHeaderHtml = function()
{
	var _self = this;
	
	let bankingDetailsHeaderHtml = "";
	
	bankingDetailsHeaderHtml += "<div class='branchDetailsHeaderContainerDiv'>";
		bankingDetailsHeaderHtml += "<div class='branchDetailsHeaderContDiv'>";
			bankingDetailsHeaderHtml += "<div class='branchDetailsHeaderTextDiv width50'>";
				bankingDetailsHeaderHtml += "S.No";
			bankingDetailsHeaderHtml += "</div>";
			bankingDetailsHeaderHtml += "<div class='branchDetailsHeaderTextDiv'>";
				bankingDetailsHeaderHtml += "Bank Name";
			bankingDetailsHeaderHtml += "</div>";
			bankingDetailsHeaderHtml += "<div class='branchDetailsHeaderTextDiv'>";
				bankingDetailsHeaderHtml += "Branch Name";
			bankingDetailsHeaderHtml += "</div>";
			bankingDetailsHeaderHtml += "<div class='branchDetailsHeaderTextDiv'>";
				bankingDetailsHeaderHtml += "Branch Ifsc";
			bankingDetailsHeaderHtml += "</div>";
			bankingDetailsHeaderHtml += "<div class='branchDetailsHeaderTextDiv width75'>";
				bankingDetailsHeaderHtml += "Bank Id";
			bankingDetailsHeaderHtml += "</div>";
			bankingDetailsHeaderHtml += "<div class='branchDetailsHeaderTextDiv'>";
				bankingDetailsHeaderHtml += "Address";
			bankingDetailsHeaderHtml += "</div>";
			bankingDetailsHeaderHtml += "<div class='branchDetailsHeaderTextDiv'>";
				bankingDetailsHeaderHtml += "City";
			bankingDetailsHeaderHtml += "</div>";
			bankingDetailsHeaderHtml += "<div class='branchDetailsHeaderTextDiv'>";
				bankingDetailsHeaderHtml += "District";
			bankingDetailsHeaderHtml += "</div>";
			bankingDetailsHeaderHtml += "<div class='branchDetailsHeaderTextDiv'>";
				bankingDetailsHeaderHtml += "State";
			bankingDetailsHeaderHtml += "</div>";
		bankingDetailsHeaderHtml += "</div>";
	bankingDetailsHeaderHtml += "</div>";
	bankingDetailsHeaderHtml += "<div class='branchDetailsContainerDiv'>";
		bankingDetailsHeaderHtml += "<div class='branchDetailsContInnerDiv'>";
		bankingDetailsHeaderHtml += "</div>";
	bankingDetailsHeaderHtml += "</div>";
	
	$('#bankingContainerDiv').append(bankingDetailsHeaderHtml).promise().done(function()
	{
        _self.FetchBankDetails();
        
        $("#bankCitiesSelector").on("change", function()
		{
        	_self.FetchBankDetails();
		});
        
        $("#bankSearch").on("change", function()
		{
        	let searchKey = $(this).val();
        	_self.FetchSearchDetails(searchKey);
		});        
    });
};

bankingPOC.prototype.FetchBankDetails = function()
{
	var _self = this;
	
	let selectedCity = $("#bankCitiesSelector").val();
	
	if(selectedCity != "-1")
	{
		let succCbk = function(response)
		{
			let responseData = "";
			
			if(!_self.isLimitData)
			{
				responseData = response;
			}
			else
			{
				if(response && response.length)
				{
					let limitedDataObj = [];
					
					for(let i = 0; i < _self.limitCount; i++)
					{
						limitedDataObj.push(response[i]);
					}
					
					responseData = limitedDataObj;
				}
			}		
			
			_self.bankDetailsObj[selectedCity] = responseData;
			_self.renderBankDetails(responseData);
		};
		
		if(_self.bankDetailsObj[selectedCity])
		{
			_self.renderBankDetails(_self.bankDetailsObj[selectedCity]);
		}
		else
		{
			$('#loadingGuage, #pageMask').show();
			
			$.ajax(
			{
				"url" : _self.bankingAPI_Url + selectedCity,
				"success" : function(resp){succCbk(resp);},
				"error" : function(resp){_self.renderBankDetails(resp);}
			});
		}
	}
	else if(_self.isTestDataAvail)
	{
		$("#bankCitiesSelector").prop('disabled', true);
		_self.renderBankDetails(testDataObj);
	}
	else
	{
		_self.renderBankDetails();
	}
};

bankingPOC.prototype.FetchSearchDetails = function(searchKey)
{
	var _self = this;
	
	let searchResultData = [];
	
	if(_self.currDataObj && _self.currDataObj.length)
	{		
		$.each(_self.currDataObj, function (i)
		{
		    $.each(_self.currDataObj[i], function (key, val)
    		{
		        if((val.toString().toLowerCase()).indexOf((searchKey.toLowerCase())) != -1)
	        	{
		        	searchResultData.push(_self.currDataObj[i]);		        	
		        	return false;
	        	}
		    });
		});
		
		_self.renderBankDetails(searchResultData, searchKey);
	}
};

bankingPOC.prototype.renderBankDetails = function(respData, srchKey)
{
	var _self = this;

	let branchDetailsHtml = "";
	
	if(respData && respData.length)
	{
		if(!srchKey)
			_self.currDataObj = respData;
		
		for(let i = 0; i < respData.length; i++)
		{
			branchDetailsHtml += "<div class='branchDetailsContDiv'>";
				branchDetailsHtml += "<div class='branchDetailsContTextDiv width50'>";
					branchDetailsHtml += i + 1;
				branchDetailsHtml += "</div>";
				branchDetailsHtml += "<div class='branchDetailsContTextDiv'>";
					branchDetailsHtml += respData[i]["bank_name"];
				branchDetailsHtml += "</div>";
				branchDetailsHtml += "<div class='branchDetailsContTextDiv'>";
					branchDetailsHtml += respData[i]["branch"];
				branchDetailsHtml += "</div>";
				branchDetailsHtml += "<div class='branchDetailsContTextDiv'>";
					branchDetailsHtml += respData[i]["ifsc"];
				branchDetailsHtml += "</div>";
				branchDetailsHtml += "<div class='branchDetailsContTextDiv width75'>";
					branchDetailsHtml += respData[i]["bank_id"];
				branchDetailsHtml += "</div>";
				branchDetailsHtml += "<div class='branchDetailsContTextDiv'>";
					branchDetailsHtml += respData[i]["address"];
				branchDetailsHtml += "</div>";
				branchDetailsHtml += "<div class='branchDetailsContTextDiv'>";
					branchDetailsHtml += respData[i]["city"];
				branchDetailsHtml += "</div>";
				branchDetailsHtml += "<div class='branchDetailsContTextDiv'>";
					branchDetailsHtml += respData[i]["district"];
				branchDetailsHtml += "</div>";
				branchDetailsHtml += "<div class='branchDetailsContTextDiv'>";
					branchDetailsHtml += respData[i]["state"];
				branchDetailsHtml += "</div>";
			branchDetailsHtml += "</div>";
		}
		
		//console.log(respData);
	}
	else if(srchKey)
	{
		branchDetailsHtml = "<div class='errorTextDiv'>Sorry, we couldn\'t find \""+ srchKey +"\". Kindly check your search term.</div>";
	}
	else
	{
		branchDetailsHtml = "<div class='errorTextDiv'>Please select the city</div>";
	}
	
	$('.branchDetailsContInnerDiv').html(branchDetailsHtml).promise().done(function()
	{
		let maxHeight = 0;

		$(".branchDetailsContTextDiv").each(function(){
		   if ($(this).height() > maxHeight) { maxHeight = $(this).height(); }
		});

		$(".branchDetailsContTextDiv").height(maxHeight);
		
		$('#loadingGuage, #pageMask').hide();
	});
};

function initBanking()
{
	let bank_OBJ = new bankingPOC();	
	bank_OBJ.isTestDataAvail = false;
	bank_OBJ.isLimitData = false;
	
	let currUrlPath = window.location.toString();
	let paramsString = currUrlPath.split('?')[1];
	let searchParams = new URLSearchParams(paramsString);

	if((searchParams.has("testdata") === true) && (searchParams.get("testdata") === "1"))
	{
		bank_OBJ.isTestDataAvail = true;
	}
	
	if((searchParams.has("limitdata") === true) && (searchParams.get("limitdata") === "1"))
	{
		bank_OBJ.isLimitData = true;
		bank_OBJ.limitCount = searchParams.get("limitcount");
	}
	
	bank_OBJ.renderBranchHtml();
}