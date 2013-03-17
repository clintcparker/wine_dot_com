var assert = require("assert");
var WineDotCom = require('./../index').WineDotCom;


var wineDotCom;
var wineDotComC;
var tmpKey = process.env.WINE_API_KEY;
delete process.env.WINE_API_KEY;

suite('WineAPIConstructor', function(){
    setup(function(){
      
    });
  
    suite("constructor", function(){
        test("Key Required", function(){
            delete process.env.WINE_API_KEY;
            assert.throws(function(){ wineDotComC = new WineDotCom();},"Missing API key");
            process.env.WINE_API_KEY = tmpKey;
        });
        test("Falls back to enviroment variable", function(){
            var fakeKeyFromProcess = "fakeKeyFromProcess";
            process.env.WINE_API_KEY = fakeKeyFromProcess;
            assert.doesNotThrow(function(){ wineDotComC = new WineDotCom();},"Missing API key");
            assert.equal(wineDotComC._api_key, fakeKeyFromProcess, "Fell back to environment variable");
            process.env.WINE_API_KEY = tmpKey;
        });
        test("Uses key if passed", function(){
            var fakeKeyFromProcess = "fakeKeyFromProcess";
            var fakeKeyParameter = "fakeKeyParameter";
            process.env.WINE_API_KEY = fakeKeyFromProcess;
            assert.doesNotThrow(function(){ wineDotComC = new WineDotCom(fakeKeyParameter);},"Missing API key");
            assert.equal(wineDotComC._api_key, fakeKeyParameter, "used provided key");
            process.env.WINE_API_KEY = tmpKey;
        });
    });
});