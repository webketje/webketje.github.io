(function(options) {
	function handleOptions(options) {
		var props = ['button','input','label','term','list'],
				defs = ['search-button','search-input','search-label','search-term','search-results'], obj = {};
		for (var i = 0; i < props.length; i++) {
			if (options && options[props[i]]) {
				if (typeof options[props[i]] === 'string')
					obj[props[i]] = document.getElementById(options[props[i]]);
				else 
					obj[props[i]] = options[props[i]];
			} else {
				obj[props[i]] = document.getElementById(defs[i]);
			}
		}
		return obj;
	}
	function filterTag(items, tag) {
		for (var i = 0; i < items.length; i++) {
			if (items[i].tags.indexOf(tag.toLowerCase()) === -1)
				items[i].element.parentNode.removeChild(items[i].element);
			else if (items[i].element.className.match('hidden'))
				items[i].element.className = items[i].element.className.replace('hidden', '');
		}
	}
	function filterCategory(items, cat) {
		for (var i = 0; i < items.length; i++) {
			if (cat.toLowerCase() !== items[i].category)
				items[i].element.parentNode.removeChild(items[i].element);
			else if (items[i].element.className.match('hidden'))
				items[i].element.className = items[i].element.className.replace('hidden', '');
		}
	}
	function filterPost(items, term) {
		var terms = term.split(' ');
		function evalTerms(item) {
			var count = 0;
			for (var i = 0; i < terms.length; i++) {
				if (item.match(terms[i]))
					count++;
			}
			return count;
		}
		for (var i = 0; i < items.length; i++) {
			if (!items[i].title.match(new RegExp(term.toLowerCase().trim(), 'gi')) &&	!evalTerms(items[i].title))
				items[i].element.parentNode.removeChild(items[i].element);
			else if (items[i].element.className.match('hidden'))				
				items[i].element.className = items[i].element.className.replace('hidden', '');
		}
	}
	function searchTerm() {
		if (searchInput.value.trim().replace(/\W/g,' ').length)
			location.href = location.href.slice(0, location.href.indexOf('?')) + '?search=' + encodeURIComponent(searchInput.value);
	}

	var options = handleOptions(options),
		labelElem = document.getElementById('search-label'),
		termElem = document.getElementById('search-term'),
		searchInput = document.getElementById('search-button'),
		list = document.getElementById('search-results'),
		url = window.location.href.split(/\/\?*|=/), term, searchFor, items;

	if (url.length) {
		term = decodeURIComponent(url[url.length-1]);
		searchFor = url[url.length-2];
		items = searchItems;
		switch(searchFor) {
			case 'category':
				filterCategory(items, term);
			break;
			case 'tag':
				filterTag(items, term);
			break;
			case 'search':
				filterPost(items, term);
				term = '"' + term + '"';
			break;
		}
		labelElem.textContent = searchFor;
		termElem.textContent = term;
	}
	searchInput.addEventListener('click', searchTerm, false);
	searchInput.addEventListener('keyup', function(e) {
		var key = e.keyCode || e.which, ENTER = 13;
		if (key === ENTER)
			searchTerm();
	}, false);
}());