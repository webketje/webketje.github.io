
	document.getElementById('chosen-cat-or-tag').innerHTML = window.location.href.split(/\?.*\=/)[1];
	console.log(window.location.href.match(/\?.*\=/));
	var text = window.location.href.match(/\?.*\=/)[0].replace('?','').replace('=','');
	if ( text === 'cat') text = 'category';
	document.getElementById('cat-or-tag').innerHTML = text;
	function filterKeywords() {
		var postList = document.getElementById('blog-roll'),
				setCat = document.getElementById('cat-or-tag'),
				chosenCat = document.getElementById('chosen-cat-or-tag'),
				postItems = postList.getElementsByTagName('li'),
				len = postItems.length;
		var arr = [];
		for (var i = 0; i < len; i++) {
			if (!postItems[i].getAttribute('data-categories').match(chosenCat.innerHTML)) {
				arr.push(postItems[i]);
			}
		}
		for ( var i = 0; i < arr.length; i++ ) arr[i].parentNode.removeChild(arr[i]);
	}
	filterKeywords();