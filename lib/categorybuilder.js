//console.log(process.argv);
console.log("process.env.WINE_API_KEY");
console.log(process.env.WINE_API_KEY);

var qs = require("querystring");

var fs = require('fs');

var http = require("http");

var path = "/api/beta2/service.svc/json/categorymap";
var callback = function(err, res){
	if (err){
		console.log(err);
		return;
	}
	console.log(res);
	var data = {};
	for (var i in res.Categories){
		var category = res.Categories[i];
		data[category.Name] = {
			_category_id : category.Id
		};
		for (var j in category.Refinements){
			var refinement = category.Refinements[j];
			data[category.Name][refinement.Name] = refinement.Id;
		}
	}
	
	var strOut = "module.exports = categories;\n\nvar categories = function(){ return " + JSON.stringify(data,"", "\t") + "};";
	
	fs.writeFileSync("lib/categories.js", strOut);
};

var data = {};
var headers = {
	Connection: 'Keep-alive'
};

data.filter="categories(490)";





path += '?' + qs.stringify(data);
path += "&apikey=" + process.env.WINE_API_KEY;

var options = {
	host: "services.wine.com",
	headers: headers,
	path: path,
	method: 'GET'
};

var req = http.get(options, function (res) {
	if (!callback) {
	return;
	}
	
	if (res.statusCode < 200 || res.statusCode >= 300) {
		var err = new Error('HTTP error ' + res.statusCode);
		err.arguments = arguments;
		err.type = res.statusCode;
		err.options = options;
		return callback(err);
	}
	
	var json = '';
	res.setEncoding('utf8');
	
	res.on('data', function (chunk) {
		json += chunk;
	});
	
	res.on('end', function () {
		var err = null;
		var data = null;
		try {
			data = JSON.parse(json);
		} catch (err) {
		}
		callback(err, data);
	});
		
	res.on('close', function (err) {
		callback(err);
	});
});
console.log(req.path);
req.on('error', function (err) {
	callback && callback(err);
});


