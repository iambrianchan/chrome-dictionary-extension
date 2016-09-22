var statistics = React.createClass({
	getInitialState: function() {
		return {
			languages: [],
			dictionaries: {},
			activeDictionary: [],
			filteredDictionary: [],
			activeLanguage: "",
			activeQuery: "",
			showInstructions: false,
			showOptions: false
		}
	},
    getDefaultProps: function() {
        return {
            items: []
        }
    },
    toggleInstructions: function() {
    	this.setState({ showInstructions: !this.state.showInstructions });
    },
    toggleOptions: function() {
    	this.setState({ showOptions: !this.state.showOptions });
    },
    setActiveDictionary: function(language) {
    	var activeDictionary = this.state.dictionaries[language];
    	activeDictionary.sort(function sortWordsAlphabetically(a, b) {
    		return a.term.localeCompare(b.term);
    	});
    	this.setState({ activeDictionary: activeDictionary, activeLanguage: language, filteredDictionary: activeDictionary }, function callback() {
    	});
    },
    deleteDictionaryEntry: function(word, language) {
    	chrome.storage.local.get('dictionaries', function callback(result) {
    		var languageDict = {dictionaries: result.dictionaries };
    		var words = result.dictionaries[language];
    		for (var i = words.length - 1; i >= 0; i--) {
    			if (words[i].term == word) {
    				words.splice(i, 1);
    			}
    		}
			languageDict.dictionaries[language] = words;
			chrome.storage.local.set(languageDict, function() {
				this.refreshDictionaries();			
			}.bind(this));
    	}.bind(this))
    },
    deleteDictionary: function(language) {
    	if (language == 'all') {
    		var dictionaries = {dictionaries: {}};
    		chrome.storage.local.set(dictionaries);
    		this.setState({activeLanguage: "", activeDictionary: [], filteredDictionary: [], languages: [], dictionaries: {}});
    	}
    	else if (language && this.state.showOptions) {
    		chrome.storage.local.get('dictionaries', function onSuccess(result) {
    			var dictionaries = result.dictionaries;
    			delete dictionaries[language];
    			var data = {};
    			data.dictionaries = dictionaries;
    			chrome.storage.local.set(data, function callback() {
    				if (this.state.activeLanguage == language) {
    					this.setState({activeDictionary: [], filteredDictionary: [], activeLanguage: ""});
    				}
    				this.refreshDictionaries();
    			}.bind(this));
    		}.bind(this));
    	}
    },
    filterDictionary: function(query, e) {
    		this.setState({ activeQuery: e.target.value }, function() {
    			var substring = this.state.activeQuery;
    			var activeDictionary = this.state.activeDictionary;
    			var filteredDictionary = [];
    			for (var i = 0; i < activeDictionary.length; i++) {
    				if (activeDictionary[i].term.indexOf(substring) != -1) {
    					filteredDictionary.push(activeDictionary[i]);
    				}
    			}
    			this.setState({ filteredDictionary: filteredDictionary });
    		})
    },
    componentDidMount: function() {
    	this.refreshDictionaries();
    },
    refreshDictionaries: function() {
    	var items = [];
        chrome.storage.local.get('dictionaries', function(result) {
            var keys = Object.keys(result.dictionaries).sort(function sortLanguagesAlphabetically(a, b) {
            	return a > b;
            })
            this.setState({ dictionaries: result.dictionaries });
            if (this.state.activeLanguage) {
            	this.setActiveDictionary(this.state.activeLanguage)
            }
            // get all the keys from chrome storage and add to array items
            for (var i = 0; i < keys.length; i++) {
                items.push(keys[i]);
            }

            this.setState({ languages: items });
        }.bind(this))
    },
    render: function() {
    	var displayedItems = this.state.filteredDictionary.sort();
    	var content;
    	if (displayedItems.length > 0) {
    		var items = displayedItems.map(function(item) {
    			return (
    				<div key={item.term} className="col-lg-3 col-md-3 col-sm-4">
    				<div className="word">
    				<h2>{item.term}</h2>
    				{item.partsOfSpeech.map(function loop(word, i) {
							return (
								<div key={item.term + "-" + i}>
									<p>
										{word.term && <b>{word.term + ' '}</b>}
										{word.phonetic && <i>{word.phonetic + ' '}</i>}
										{word.pos && <span>{'[' + word.pos + '] '}</span>}
										{word.gender && <span>{word.gender + '. '}</span>}
										{word.inflection && <span>{word.inflection + ' '}</span>}
									</p>
									<div>
										{word.meanings[0].meaning && <p><b>Meaning:</b> {word.meanings[0].meaning}</p>}
										{word.meanings[0].related && word.meanings[0].related.length > 0 && <p><b>Related:</b> {word.meanings[0].related.join(', ')}</p>}
										{word.meanings[0].expressions && word.meanings[0].expressions.length > 0 && <p><b>Example:</b><br></br>Source: {word.meanings[0].expressions[0].source}<br></br>Target: {word.meanings[0].expressions[0].target}</p>}
									</div>
									{item.partsOfSpeech.length > 1 && i != item.partsOfSpeech.length - 1 && <hr className="divider"></hr>}
								</div>
							)
    				})}
    				</div>
    				<button className="delete" onClick={this.deleteDictionaryEntry.bind(this, item.term, this.state.activeLanguage)}><span className="glyphicon glyphicon-remove"></span></button>
    				<hr></hr>
    				</div>
    			);
    		}.bind(this));
    		content = <div className="words row">{items}</div>;
    	}
    	var instructionsClass = this.state.showInstructions ? "instructions" : "instructions hide"
    	var instructions = function createInstructions() {
    		return (
    			<div className = {instructionsClass}>
    				<h2>Instructions:</h2>
    				<button className="delete" onClick={this.toggleInstructions}><span className="glyphicon glyphicon-remove"></span></button>
    				<p>
    					This extension allows users to lookup single word definitions on page. Users can find English translations to French, German, Italian and Spanish words.
    				</p>
    				<p>There are two ways to look up words:</p>
    				<p className="instruction-option">1 <i>Bring up the built in search bar by using "Command + Shift + U" on Mac or "Ctrl + Shift + U" on Windows.</i></p>
    				<p className="instruction-option">2 <i>Select the target word and right click, and select the target language to translate to in the drop down menu.</i></p>
    				<p>When words are looked up they will automatically be shown here on this page for later reference.</p>
					<p>In addition, the font of looked up words will change automatically on the page, and the definition will pop up when it is hovered over.</p>
    			</div>
    		)
    	}.bind(this)();
        return (
            <div className="content">
            <div className="instructions-clickable" onClick={this.toggleInstructions}><a>How to...</a></div>
            <div className="languages">
            {
            	this.state.languages.map(function loop(language, i) {
                	return (<span key={language} onClick={this.setActiveDictionary.bind(this, language)}><img src={"./../img/originals/" + language + ".png"}></img></span>)
            	}.bind(this))
            }
            {Object.keys(this.state.dictionaries).length > 0 && <div className="btn-group">
            	<button type="button" className="btn btn-danger"><span className="glyphicon glyphicon-cog"></span></button>
            	<button onClick={this.toggleOptions} type="button" className="btn btn-danger dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
  					<span className="caret"></span>
		  			{this.state.showOptions && <ul className="dropdown-menu open">
					    {this.state.languages.map(function loop(language, i) {
					    	return (
					    		<li onClick={this.deleteDictionary.bind(this, language)}>Remove {language.toUpperCase()} dictionary<hr></hr></li>
					    	)
					    }.bind(this))}
					    <li onClick={this.deleteDictionary.bind(this, 'all')}>All Dictionaries</li>
		  			</ul>}
  				</button>
  			</div>}
            </div>
            {this.state.activeDictionary.length > 0 && <div className="search"><input type="text" placeholder="Search for a word" value={this.activeQuery} onChange={this.filterDictionary.bind(this, this.activeQuery)}></input></div>}
            {instructions}
            {content}
            </div>
        )
    }
})
module.exports = statistics;