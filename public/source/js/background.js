var server_key = "41d8e95b-6dd4-4db6-a87d-37bb5af6b4fc";
var toggleSearch = false;

var systranApi = function() {

	function handleSystranResponse(response, word, language) {
		var data = {};
		var result = JSON.parse(response);
		data.term = word;
		var partsOfSpeech = parseDictionaryResult(result);
		data.partsOfSpeech = partsOfSpeech;

		chrome.storage.local.get('dictionaries', function callback(items) {
			if (!items.dictionaries) {
				var dictionaries = {dictionaries: {}};
				dictionaries.dictionaries[language] = [data];

				chrome.storage.local.set(dictionaries, function callback() {
					var json = { words: [data], language: language };
					sendMessage(json);
				});
			}
			if (items.dictionaries[language] == undefined) {
				var words = [];
				words.push(data);
				var languageDict = { dictionaries: items.dictionaries };
				languageDict.dictionaries[language] = words;
				chrome.storage.local.set(languageDict, function callback() {
					var json = { words: words, language: language};
					sendMessage(json);
				});
			}
			else {
				var languageDict = { dictionaries: items.dictionaries };
				var words = items.dictionaries[language];
				for (var i = 0; i < words.length; i++) {
					if (words[i].term == data.term) {
						return;
					}
				};
				words.push(data);
				languageDict.dictionaries[language] = words;
				chrome.storage.local.set(languageDict, function callback() {
					var json = { words: [data], language: language };
					sendMessage(json);
				});
			}
		});
	}
	function parseDictionaryResult(json) {
		var results = json.outputs[0].output.matches;
		results = results.map(function convertToPartOfSpeechObject(result) {
			return new partOfSpeech(result);
		});
		return results;
	}

	function parseAccents (word) {
		return word.split('').map(function(character) {
			return encodeCharacter(character);
		}).join('');
		function encodeCharacter(character) {
			switch (character) {
				case 'à':
					return "%C3%A0";
				case 'â':
					return "%C3%A2";
				case 'æ':
					return "%C3%A6";
				case 'ç':
					return "%C3%A7";
				case 'è':
					return "%C3%A8";
				case 'é':
					return "%C3%A9";
				case 'ê':
					return "%C3%AA";
				case 'ë':
					return "%C3%AB";
				case 'î':
					return "%C3%AE";
				case 'ï':
					return "%C3%AF";
				case 'ô':
					return "%C3%B4";
				case 'œ':
					return "%C5%93";
				case 'ù':
					return "%C3%B9";
				case 'û':
					return "%C3%BB";
				case 'ü':
					return "%C3%BC";
				case 'ÿ':
					return "%C3%BF";
				default:
					return character;
			}
		}
	}
	return {
		lookup: function(word, language) {
			var data = {};
			// data.term = word;
			// word = parseAccents(word);
			var options = {
				method: "POST",
				url: "https://api-platform.systran.net/resources/dictionary/lookup?key="+server_key+ "&source=" + language + "&target=en&autocomplete=false&input="+word,
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json"
				}
			};
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function() {
				if ( xhr.readyState == XMLHttpRequest.DONE ) {
					if (xhr.status == 200) {
						handleSystranResponse(xhr.responseText, word, language);
					}
					else if (xhr.status == 400) {
						alert('There was an error');
					}
				}
			}
			xhr.open("POST", options.url);
			xhr.setRequestHeader("Content-Type", "application/json");
			xhr.setRequestHeader("Accept", "application/json");
			xhr.send();
		}
	}
}();

// part of speech object
var partOfSpeech = function(partOfSpeechData) {
	this.meanings = [];
	if (partOfSpeechData.source.pos) {
		this.pos = partOfSpeechData.source.pos;
	}
	if (partOfSpeechData.source.phonetic) {
		this.phonetic = partOfSpeechData.source.phonetic;
	}
	if (partOfSpeechData.source.inflection) {
		this.inflection = partOfSpeechData.source.inflection;
	}
	if (partOfSpeechData.source.term) {
		this.term = partOfSpeechData.source.lemma;
	}
	if (partOfSpeechData.source.info) {
		this.gender = partOfSpeechData.source.info;
	}
	if (partOfSpeechData.other_expressions) {
		this.expressions = partOfSpeechData.other_expressions;
	}
	for (let i = 0; i < partOfSpeechData.targets.length; i++) {
		let newMeaning = new meaning(partOfSpeechData.targets[i]);
		this.meanings.push(newMeaning);
	}
}

// meaning object
var meaning = function(meaningData) {
	if (meaningData.expressions) {
		this.expressions = meaningData.expressions; 
	}
	if (meaningData.lemma) {
		this.meaning = meaningData.lemma;
	}
	if (meaningData.invmeanings != "") {
		this.related = meaningData.invmeanings;
	}
	if (meaningData.rank) {
		this.rank = meaningData.rank;
	}
}

function getword(info, tab, language, globalSearch) {
	if (!info && !tab) {
		systranApi.lookup(globalSearch, language);
	}
	else {
		var word = info.selectionText.toLowerCase();
		systranApi.lookup(word, language); 
	}   
}

chrome.contextMenus.create({
  	title: "Lookup French word: %s", 
  	contexts:["selection"], 
  	onclick: function (info, tab) {
		getword(info, tab, 'fr');
	}
});

chrome.contextMenus.create({
	title: "Lookup Spanish word: %s",
	contexts: ["selection"],
	onclick: function (info, tab) {
		getword(info, tab, 'es');
	}
});

chrome.contextMenus.create({
	title: "Lookup German word: %s",
	contexts: ["selection"],
	onclick: function (info, tab) {
		getword(info, tab, 'de');
	}
});

chrome.contextMenus.create({
	title: "Lookup Italian word: %s",
	contexts: ["selection"],
	onclick: function (info, tab) {
		getword(info, tab, 'it');
	}
});

function sendMessage (json) {
	chrome.tabs.query({active: true, currentWindow: true},
		function callback(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, json, function (response) {
			})
		}
	);
}

chrome.webNavigation.onHistoryStateUpdated.addListener(function (details) {
    chrome.storage.local.get('dictionaries', function (items) {
    	sendMessage(items);
    })
});
chrome.browserAction.onClicked.addListener(function(tab) { 
	chrome.tabs.create({
		url: 'public/source/views/home.html'
	})
});

chrome.commands.onCommand.addListener(function(command) {
	chrome.tabs.query({active: true, currentWindow: true},
		function callback(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {"toggleSearch": !toggleSearch}, function (response) {
				toggleSearch = !toggleSearch;
			})
		}
	);
});

chrome.runtime.onMessage.addListener(function callback(request, sender, sendResponse) {
	getword(null, null, request.language, request.search);
})