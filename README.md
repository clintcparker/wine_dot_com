#wine_dot_com

A nodejs wrapper for the wine.com API.

##Installation
    npm install wine_dot_com

##Sample Usage

	var wine = require("wine_dot_com").WineDotCom("3scale-blahblah");
		
	var searchOpts = new wine.searchOptions("sextant");	
	searchOpts.callback = function(err, wines){
    	console.log(wines.Total);    
	}

	wine.search(searchOpts);
