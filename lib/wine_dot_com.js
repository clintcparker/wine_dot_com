var qs = require("querystring");
var _ = require("underscore");
module.exports = WineDotCom;

function WineDotCom(api_key) {
	// Make sure we instantiate this object
	if (!(this instanceof WineDotCom)) {
		return new WineDotCom(api_key);
	}
    if (api_key){
        this._api_key = api_key;
    } else {
        if (process.env.WINE_API_KEY){
            this._api_key = process.env.WINE_API_KEY;
        } else {
            throw "No API key provided. Please pass the API key inthe constructor or set process.env.WINE_API_KEY";
        }
    }
	this.categories = require("./categories.js").categories;

	this.searchOptions = function(params) {
		//Parameter	Description	Example
		
		//search	The term(s) to search for.	search=mondavi+merlot
		this.search =[];
		
		if (params){
			if (_.isArray(params)){
				this.search = params;
			} else {
				if (_.isString(params)){
					this.search.push(params);
				}
			}
		}
		
		//offset	The record to start from.	offset=10
		this.offset = 0;
		
		//size	The number of records to return in a list. Max is 100, default is 5.	size=50
		this.size = 100;
		
		
		
		//filter	Filters to apply to the product list.	filter=categories(7155+124)+rating(85|100)
		this.filter = {
			categories : [],//	The category attributes to filter on. Examples would be the red wine attribute, or the cabernet attribute.
			rating:{min:null,max:null},//	The range of rating scores to filter on.
			price:{min:null,max:null},	//The range of price to filter on. Only supported when the state parameter is provided.
			product:null//	The specific products to return. When this is specified, full product details are provided.
		};
		
		//state	The desired ship to state. This is optional. If it is not present, retail information will not be displayed.	state=CA
		this.state = null;
		
		//sort	What sort key should be used when sorting the list.	sort=rating|ascending
		this.sort = {
			key : "rating",
			order : "descending"
		};
		
		//instock	Limit the results to in stock products only (should be coupled with the state parameter).	instock=true
		this.instock = null;
		
		this.callback = function(){
			throw "cellr: callback has not been defined";
		};
	};
}


WineDotCom.prototype = {
    _api_protocol   : require("http"),
    _api_host       : "services.wine.com",
    
    search : function(options){
        catalogSearch.call(this, options);
    }
    
};

function catalogSearch(searchOptions) {
	var path = "/api/beta2/service.svc/json/catalog";
	var callback = searchOptions.callback;
	var data = {};
	var headers = {
		Connection: 'Keep-alive'
	};
	
	//build query
	if (_.isArray(searchOptions.search)){
		data.search = searchOptions.search;
	}
	if (searchOptions.sort && searchOptions.sort.key && _.isString(searchOptions.sort.key)){
		var sortKey = searchOptions.sort.key;
		var order = searchOptions.sort.order && _.isString(searchOptions.sort.order) ? searchOptions.sort.order : "descending";
		data.sort = sortKey + "|" + order;
	}
	data.offset = parseInt(searchOptions.offset, 10);
	data.size = parseInt(searchOptions.size, 10);

	var filters = [];
	
	if (searchOptions.filter.categories.length){
		var categoryStr = "categories(" + searchOptions.filter.categories.join("+") + ")";
		filters.push(categoryStr);
	}
	if (searchOptions.filter.rating.min && searchOptions.filter.rating.max){
		var ratingStr = "ratings(" + searchOptions.filter.rating.min + "|" + searchOptions.filter.rating.max + ")";
		filters.push(ratingStr);
	}
	if (searchOptions.filter.price.min && searchOptions.filter.price.max){
		var priceStr = "price(" + searchOptions.filter.price.min + "|" + searchOptions.filter.price.max + ")";
		filters.push(priceStr);
	}
	if (searchOptions.filter.product){
		var productStr = "product("+searchOptions.filter.product+")";
		filters.push(productStr);
	}
	data.filter = filters.join("+");
	
	
	
	path += '?' + qs.stringify(data);
	path += "&apikey=" + this._api_key;
	
	var options = {
		host: this._api_host,
		headers: headers,
		path: path,
		method: 'GET'
	};
	
	var req = this._api_protocol.get(options, function (res) {
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
			if (data.Status && data.Status.Messages.length > 0){
				for (var i in data.Status.Messages){
					console.log(data.Status.Messages[i]);
				}
			}
			if (data.Products && data.Products.List.length === 0){
				console.log("Search returned empty product list");
			}
			callback(err, data.Products);
		});
			
		res.on('close', function (err) {
			callback(err);
		});
	});
	if(searchOptions.debug){
		console.log(req.path);
	}
	req.on('error', function (err) {
		callback && callback(err);
	});
}
