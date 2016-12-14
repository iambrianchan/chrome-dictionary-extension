// contentscript.js

var selectedText = "";

function createDictionaryPopup(word) {
	var popup = document.createElement("div");
	popup.className += "custom-dictionary dictionarypopup";

	for (var i = 0; i < word.partsOfSpeech.length; i++) {

		var partOfSpeech = word.partsOfSpeech[i];
		var container, info;
		// container holds info and meanings
		container = document.createElement("div");

		// info will contain quick info about a word
		info = document.createElement("div");
		info.className += "custom-dictionary dictionarypopupinfo";

		// set the term name element
		var term = document.createElement("span");
		term.className = "dictionarypopupterm";
		term.textContent = partOfSpeech.term + ' | ';

		// create and set the part of speech element
		var pos = document.createElement("span");
		pos.textContent = partOfSpeech.pos + ' | ';

		// append the items to the info (quick info)
		// inflection whether it has a plural value or not
		info.appendChild(term);
		if (partOfSpeech.inflection) {
			var inflection = document.createElement("span");
			inflection.textContent = partOfSpeech.inflection + " | ";
			inflection.className += " inflection";
			info.appendChild(inflection);
		}

		// create and set the phonetic spelling of a word
		if (partOfSpeech.phonetic) {
			var phonetic = document.createElement("span");
			phonetic.textContent = partOfSpeech.phonetic + ' | ';
			info.appendChild(phonetic);
		}

		info.appendChild(pos);

		// create and set a words gender value
		if (partOfSpeech.gender) {
			var gender = document.createElement("span");
			gender.textContent = partOfSpeech.gender;
			info.appendChild(gender);
		}

		// create the meaning elements
		var meaning = document.createElement("div");
		meaning.className = "custom-dictionary dictionarypopupmeaning";

		// create and set the meaning of the particular part of speech
		if (partOfSpeech.meanings[0].meaning) {
			var meaningContent = document.createElement("p");
			var number = document.createElement("span");
			number.className = "enumerable";
			var meaningText = document.createElement("span");
			number.textContent = i + 1 + " ";
			meaningContent.appendChild(number);
			meaningText.textContent = "Meaning: " + partOfSpeech.meanings[0].meaning;
			meaningContent.appendChild(meaningText);
			meaning.appendChild(meaningContent);
		}
		// create and set an associated expression.
		if (partOfSpeech.meanings[0].expressions[0]) {
			var expression = document.createElement("p");
			var target = document.createElement("span");
			var source = document.createElement("span");
			target.className = "example";
			source.className = "example";
			var linebreak = document.createElement("br");
			target.textContent = partOfSpeech.meanings[0].expressions[0].target;
			source.textContent = partOfSpeech.meanings[0].expressions[0].source;
			expression.appendChild(source);
			expression.appendChild(linebreak);
			expression.appendChild(target);
			meaning.appendChild(expression);
		}	
		// create and set related words.
		if (partOfSpeech.meanings[0].related) {
			var relatedWords = partOfSpeech.meanings[0].related.join(', ');
			var related = document.createElement("p");
			related.textContent = "Related words: " + relatedWords;
			meaning.appendChild(related);
		}
		// append info and meaning to container, then append container to popup
		container.appendChild(info);
		container.appendChild(meaning);
		popup.appendChild(container);
	}
	return popup;
}

function createSearchBarDefinition(word) {
	var searchbar = document.body.getElementsByClassName("globalsearchcontainer")[0];

	var childDefinitions = searchbar.getElementsByClassName("definitions");

	if (childDefinitions.length > 0) {
		searchbar.removeChild(childDefinitions[0]);
	}

	var container = document.createElement("div");
	container.className = "definitions";

	for (var i = 0; i < word[0].partsOfSpeech.length; i++) {
		var definition = document.createElement("div");
		var term, phonetic, pos, inflection, meaning, related, example;

		var heading = document.createElement("p");
		var content = document.createElement("div");
		var number = document.createElement("span");
		number.className = "enumerable";
		heading.appendChild(number);
		number.textContent = i + 1 + " ";

		if (word[0].partsOfSpeech[i].term) {
			term = document.createElement("span");
			term.textContent = word[0].partsOfSpeech[i].term + ' | ';
			heading.appendChild(term);
		}
		if (word[0].partsOfSpeech[i].phonetic) {
			phonetic = document.createElement("span");
			phonetic.textContent = word[0].partsOfSpeech[i].phonetic + ' | ';
			heading.appendChild(phonetic);
		}
		if (word[0].partsOfSpeech[i].pos) {
			pos = document.createElement("span");
			pos.textContent = word[0].partsOfSpeech[i].pos + ' | ';
			heading.appendChild(pos);
		}
		if (word[0].partsOfSpeech[i].inflection) {
			inflection = document.createElement("span");
			inflection.textContent = word[0].partsOfSpeech[i].inflection;
			heading.appendChild(inflection);
		}
		if (word[0].partsOfSpeech[i].meanings.length > 0) {
			meaning = document.createElement("p");
			meaning.textContent = "Meaning: " + word[0].partsOfSpeech[i].meanings[0].meaning;
			content.appendChild(meaning);
		}
		if (word[0].partsOfSpeech[i].related) {
			related = document.createElement("p");
			related.textContent = "Thesaurus: " + word[0].partsOfSpeech[i].related.join(', ');
			content.appendChild(related);
		}
		if (word[0].partsOfSpeech[i].expressions) {
			example = document.createElement("p");
			var target = document.createElement("span");
			target.textContent = word[0].partsOfSpeech[i].expressions[0].target;
			var source = document.createElement("span");
			source.textContent = word[0].partsOfSpeech[i].expressions[0].source;
			var linebreak = document.createElement("br");
			example.appendChild(source)
			example.appendChild(linebreak)
			example.appendChild(target);
			content.appendChild(example)
		}
		content.className = "definition";
		definition.appendChild(heading);
		definition.appendChild(content);
		if (i != word[0].partsOfSpeech.length - 1) {
			definition.appendChild(document.createElement("hr"));			
		}
		container.appendChild(definition);
	}
	searchbar.appendChild(container);
}
function toggleSearchBar() {
	// create the searchbar
	if (document.body.getElementsByClassName("globalsearchcontainer").length == 0) {
		var content = document.createElement("div");
		var container = document.createElement("div");
		container.className = "searchbar";
		content.className = "globalsearchcontainer";

		// create the input searchbar
		var searchbar = document.createElement("input");
		searchbar.setAttribute("type", "text");
		searchbar.value = selectedText;

		// create the magnifying glass icon
		var glass = document.createElement("span");
		var glassicon = document.createElement("img");
		glassicon.src = chrome.extension.getURL("public/src/img/glassGRAY.png");
		glass.appendChild(glassicon);
		glass.className += " glass"


		container.appendChild(glass);
		container.appendChild(searchbar);

		// create the flag buttons
		var languages = [chrome.extension.getURL("public/src/img/originals/de.png"), chrome.extension.getURL("public/src/img/originals/es.png"), chrome.extension.getURL("public/src/img/originals/fr.png"), chrome.extension.getURL("public/src/img/originals/it.png")];
		var languagescontainer = document.createElement("div");
		for (var i = 0; i < languages.length; i++) {
			var btn = document.createElement("button");
			var img = document.createElement("img");
			img.className += " searchlanguage";
			img.src = languages[i];
			var language = languages[i].substr(languages[i].length - 6, 2);
			img.setAttribute("language", language)

			// add click listener on flag buttons
			img.addEventListener("click", function() {
				this.parentNode.parentNode.setAttribute("language", this.getAttribute("language"));
				var buttons = this.parentNode.parentNode.childNodes;
				for (var j = 0; j < buttons.length; j++) {
					buttons[j].className = "";
				}
				this.parentNode.className += " active";
			})
			btn.appendChild(img);
			languagescontainer.appendChild(btn);
		}
		container.appendChild(languagescontainer);

		// add listener for when the user hits return to search
		container.addEventListener("keydown", function onKey(event) {
			if (event.keyCode == 13) {
				chrome.runtime.sendMessage({search: container.childNodes[1].value, language: container.childNodes[2].getAttribute("language")});			
			}
		})
		content.appendChild(container);
		document.body.appendChild(content);
	}

	// toggle the hot key search on or off
	else {
		var globalsearch = document.body.getElementsByClassName("globalsearchcontainer")[0];
		if (globalsearch.className.indexOf('hide') == -1) {
			globalsearch.className += " hide";
		}
		else {
			globalsearch.className = "globalsearchcontainer";
		}
		var input = globalsearch.childNodes[0].childNodes[1];
		input.value = selectedText;
	}
	// focus the new input element
	var input = document.body.getElementsByClassName("globalsearchcontainer")[0].childNodes[0];
	input = input.getElementsByTagName("input")[0];
	input.focus();
}

function traverse(item, words) {
	if (item.childNodes.length > 0) {
		for (var i = 0; i < item.childNodes.length; i++) {
				traverse(item.childNodes[i], words);			
		}
	}
	else {
		createElement(item, words);
	}
}

function createElement(item, words) {
	try {
		if (item.parentNode.className.indexOf("custom-dictionary") == -1 && item.parentNode.parentNode.className.indexOf("custom-dictionary") == -1 && item.parentNode.className.indexOf("definition") == -1  && item.parentNode.parentNode.className.indexOf("definition") == -1 && item.parentNode.tagName == "P") {
			var replace = false;

			var content = item.textContent.split(' ').map(function transformation(word) {
				for (var i = 0; i < words.length; i++) {

					//create page element
					if (word.toLowerCase() == words[i].term) {
						var popup = createDictionaryPopup(words[i]);
						replace = true;
						var replacewith = document.createElement("span");
						replacewith.textContent = word + ' ';
						replacewith.appendChild(popup);
						replacewith.className = 'dictionary-' + words[i].term;
						replacewith.className += ' custom-dictionary';
						return replacewith;
					}
					// create page element if word has trailing comma
					else if (word.toLowerCase() == words[i].term + ',') {
						var popup = createDictionaryPopup(words[i]);
						replace = true;
						var replacewith = document.createElement("span");
						replacewith.textContent = word + ' ';
						replacewith.appendChild(popup);
						replacewith.className = 'dictionary-' + words[i].term;
						replacewith.className += ' custom-dictionary';
						return replacewith;
					}
				}
				return word;
			});
			
			// if the p element has a newly created element
			if (replace) {
				var start = 0,
				end = 0;
				resultElements = [];
				for (var i = 0; i < content.length; i++) {
					// push the item we created.
					if (typeof content[i] == "object") {
						resultElements.push(content[i]);
					}
					else if (i == content.length - 1) {
						// if the last word is a regular text push it without space.
						var textNode = document.createTextNode(content[i]);
						resultElements.push(textNode);
					}
					else {
						// else push the word with a space.
						var textNode = document.createTextNode(content[i] + " ");
						resultElements.push(textNode);
					}
				}
				for (var i = resultElements.length - 1; i >= 0; i--) {
					if (typeof resultElements[i] == "string") {
						item.parentNode.insertBefore(document.createTextNode(resultElements[i] + ' '), item.nextSibling);							
					}
					else {
						item.parentNode.insertBefore(resultElements[i], item.nextSibling);
					}
				}
				item.parentNode.removeChild(item);			
			}
		}
	}
	catch (e) {
		// console.log('an error ocurred adding a definition element to the page', e);
	}
}

// Add event listeners for the new elements.
var addEventListeners = function() {
	return {
		addListeners: function(words, language) {
			for (var i = 0; i < words.length; i++) {
				var elements = document.getElementsByClassName('dictionary-' + words[i].term);
				for (var j = 0; j < elements.length; j++) {
					var element = elements[j];
					if (element.className.indexOf("dictionary-language-" + language) == -1) {
						element.className += " dictionary-language-" + language;
					}
					element.addEventListener("mouseenter", function (event) {
						var theElement = this.getElementsByClassName('custom-dictionary')[0];
						theElement.style.display = "block";
						theElement.addEventListener("mouseleave", function (event) {
							this.style.display = "none";
						});
					});
				}
			}
		}
	}
}();

// add event listener for when DOM loads.
document.addEventListener('DOMContentLoaded', fireContentLoadedEvent(), false);

// function that adds content for saved words, then calls addEventListeners.addListeners to add event listeners for new elements.
function fireContentLoadedEvent (items) {

	// grab currently selected text when mouse moves
	document.addEventListener("mouseup", function callback() {

		selectedText = window.getSelection().toString();
	})

	if (items) {
		updateDOMContent(items);
	}

	// get all dictionaries from local storage
	else {
		chrome.storage.local.get('dictionaries', function callback(result) {
			updateDOMContent(result)
		})
	}

	function updateDOMContent(items) {

		// use stored dictionaries to alter page content
		var languages, divs, lang;
		if (items.dictionaries) {

			languages = ['fr', 'es', 'de', 'it'];
			divs = document.body.getElementsByTagName("DIV");
			lang = document.getElementsByTagName('html')[0].lang;

			if (items.dictionaries[lang]) {

				for (var i = 0; i < divs.length; i++) {

					traverse(divs[i], items.dictionaries[lang]);
					addEventListeners.addListeners(items.dictionaries[lang], lang);

				}
			}
		}
	}
};

// add event listener for page change without new DOM.
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {

		// if the request contains words object, then it is a one off lookup and this word should then be found in page and event listeners attached.
		if (request.type == "lookup") {

			createSearchBarDefinition(request.words);
			var divs = document.body.getElementsByTagName("DIV");

			for (var i = 0; i < divs.length; i++) {
				traverse(divs[i], request.words);				
			}
			addEventListeners.addListeners(request.words, request.language);		
		}

		// if the message is the result of shortcut keys
		else if ( request.type == "toggleSearch" ) {
			toggleSearchBar();
		}

		// else the DOM may not have reloaded, but page location changed and all words should be found/listeners attached
		else if ( request.type == "historyStateUpdated" ) {
			fireContentLoadedEvent(request.dictionaries)
		}
	}
);