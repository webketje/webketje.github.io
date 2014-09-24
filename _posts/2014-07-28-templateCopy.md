---
title: A test post
description: wahahahahahaahha
intro: Lorem Ipsum stuff
author: Kevin Van Lierde
tags: template
categories: testhah
published: true
layout: blog-post
custom_css: false
---

**Strong**
*Em*
`code`
<div class="uk-badge">NOTE</div>
<div class="uk-badge uk-badge-danger">NOTE</div>
<div class="uk-badge uk-badge-success">SUCCESS</div>
<div class="uk-badge uk-badge-warning">WARNING</div>
<mark>marked</mark>
<kbd>Delete</kbd>
{% highlight javascript %}
document.getElementById('chosen-cat-or-tag').innerHTML = window.location.href.split(/\?.*\=/)[1];
	console.log(window.location.href.match(/\?.*\=/));
	document.getElementById('cat-or-tag').innerHTML = window.location.href.match(/\?.*\=/)[0].replace('?','').replace('=','');
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
{% endhighlight %}
