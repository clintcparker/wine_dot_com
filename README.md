#wine_dot_com

A nodejs wrapper for the wine.com API.

##Installation
    npm install wine_dot_com

##Sample Usage

###Build Options

	var searchOptions = new wineDotCom.searchOptions("Sextant+Wheelhouse+Paso+Robles+Zinfandel");
	searchOptions.filter.categories.push(wineDotCom.categories["Wine Type"]["Red Wine"]);
	searchOptions.filter.categories.push(wineDotCom.categories["Appellation"]["Central Coast"]);
	searchOptions.size = 5;

###Console

	var wine = require("wine_dot_com").WineDotCom("3scale-blahblah");
		
	var searchOpts = new wine.searchOptions("sextant");	
	searchOpts.callback = function(err, wines){
    	console.log(wines.Total);    
	}

	wine.search(searchOpts);

###Web

	app.get('/', function(req, exres){
		wineDotCom.search(searchOptions, function(err, wines){
			var message = "found " + wines.Total + " wines\n";
			exres.send(message);
		});
	});

##Testing

	npm test
	
