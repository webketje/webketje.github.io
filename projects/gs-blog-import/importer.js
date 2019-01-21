/** GS Posts import - Import Wordpress (& in the future other CMS'es) blog posts easily to GetSimple CMS. 
 *  Version 0.1 - 4th of June 2015
 *  By Kevin Van Lierde (tyblitz) - webketje.com
 *  Contact me via kevin.van.lierde@gmail.com or via Twitter [@]Tyblitz
 *  Copyright 2015
 *  
 * The MIT License (MIT)
 * Copyright (c) 2015 Kevin Van Lierde
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 *  A quick roundup of the functions inside the anonymous closure
 *  -------------------------------------------------------------
 *  XML preps:
 *    - app.readXml | reads the file input, updates file properties, & sets app.cache.xml
 *    - app.defineXmlns | retrieves the xmlns attributes from the XML root & sets it to app.cache.xmlns
 *    - app.getElementsByNameNS | retrieves a (name-spaced) element from the XML doc; uses app.cache.xmlns
 *  XML processing:
 *    - app.extractSiteProps | sets all properties in app.cache.cms to app.cache._site; launched in app.readXml
 *    - app.extractPosts | sets app.cache.__posts & app.cache.filePosts; launched in app.readXml
 *    - app.extractPostProps | maps individual post properties; called in app.extractPosts or its callback
 *  Display:
 *    - app.view.updateFileInfo | updates file info in step 1000
 *    - app.previewPosts | previews the post from app.cache.posts with index app.view.previewIndex
 *  Output:
 *    - app.generatePostXml | returns the GS page XML for 1 post passed to it (after having been mapped with app.cache.cms.map)
 *    - app.generatePostsOutput | generates a JSON GS tree & corresponding XML string (using app.generatePostXml) & returns an array of all posts
 *    - app.processPost | processes a post with the current options for export (returns it); used in CMS-specific convertPosts function
 *  
 *  Except for these, every CMS requires a name.convertPosts function for final export, and may optionally add a function:
 *  - name.processPostContent (hook in app.processPost)
 *  - name.extractPostProps (hook as callback in app.extractPosts, as passed in app.readXml)
 *  
 */


(function() {

	"use strict";
	
	// IE8 polyfill
	
	function addEvent(element, event, listener) {
	  if (element.attachEvent)
	    element.attachEvent('on' + event, listener);
	  else if (element.addEventListener)
			element.addEventListener(event, listener, false);
	}
	
	// The WP object holds all properties to be saved from a WP export file
	// props.site holds site-wide properties, direct children of the root <rss> element.
	// props.posts holds properties to be used in app.extractPosts
	// from.posts holds a map for mapping post properties to a GS xml page file
	
	// function getOption retrieves options from the WP form
	// @param {string} id - ID (or name for option inputs) of the element whose value to retrieve
	
	var WP = {
		name: 'Wordpress',
		root: 'rss',
		item: 'item',
		props: {
			site: ['title','link','description','pubDate','language','wp:wxr_version','wp:base_site_url','wp:base_blog_url','wp:author_email','wp:author_display_name','wp:author_first_name','wp:author_last_name','generator'],
			posts: ['title','link','pubDate','dc:creator','content:encoded','wp:post_date','wp:post_date_gmt','wp:post_name','wp:status']
		},
		map: {
						'title': {mapTo: 'title',   cdata: true },
					'pubDate': {mapTo: 'pubDate', cdata: false},
			 'dc:creator': {mapTo: 'user',    cdata: true },
  'content:encoded': {mapTo: 'content', cdata: true },
  'content:excerpt': {mapTo: 'metad',   cdata: true },
// 'wp:post_date_gmt': {mapTo: 'creDate', cdata: false},
		 'wp:post_name': {mapTo: 'url',     cdata: true },
		   'categories': {mapTo: 'meta',    cdata: true },
		    'wp:status': {mapTo: 'private' }
		},
		mapNM: {
						'title': {mapTo: 'title',   cdata: true },
					'pubDate': {mapTo: 'date',    cdata: false},
			 'dc:creator': {mapTo: 'user',    cdata: true },
  'content:encoded': {mapTo: 'content', cdata: true },
  'content:excerpt': {mapTo: 'metad',   cdata: true },
// 'wp:post_date_gmt': {mapTo: 'creDate', cdata: false},
		 'wp:post_name': {mapTo: 'url',     cdata: true },
		   'categories': {mapTo: 'tags',    cdata: true }
		},
	},
	app = {};
	
	app.getOption = function(id) {
		var option = document.getElementById(id) ? document.getElementById(id) : document.getElementsByName(id), 
			result;
		if (option.type === 'text')
			result = option.value;
		else if (option.type === 'checkbox')
			result = option.checked;
		else if (option.type === 'select')
			result = option.options[option.selectedIndex].value;
		else if (!option.id) {
			for (var i = 0; i < option.length; i++) {
				if (option[i].checked === true)
					result = option[i].value;
			}					
		}
		return result;
	};
	app.gsXML = function() {
	  this.data = { node: 'item', children: [
			{node: 'title', cdata: true},
			{node: 'url', cdata: true},
			{node: 'pubDate', cdata: false},
			{node: 'author', cdata: true},
			{node: 'meta', cdata: true},
			{node: 'metad', cdata: true},
			{node: 'menu', cdata: true},
			{node: 'menuOrder', cdata: true},
			{node: 'menuStatus', cdata: true},
			{node: 'template', cdata: true},
			{node: 'parent', cdata: true},
			{node: 'content', cdata: true}
		]};
	};
	app.gsXML.prototype.set = function(item, prop, value) {
		for (var i = 0; i < this.data.children.length; i++) {
			if (this.data.children[i].node === item) {
				this.data.children[i][prop] = value;
			}
		}		
	};
	
	// app.cache is dynamically populated with the following sub-objects/ properties
	// Meta-data related to the file: fileSize, fileType, fileName, filePosts
	// __posts & _site: objects with original XML tags as keys & original content as values
	// _posts: objects with converted xml tags as keys & converted content as values
	// posts: objects containing both xml & json nodes with the latter having a structure like app.gsXML
	
	app.cache = {
		get: function(item, subitem) {	
			if (subitem)
				return app.cache[item][subitem] || false;
			else
				return app.cache[item] || false; 
		},
		set: function(item, value) { 
			if (typeof item === 'string')
				app.cache[item] = value; 
			else {
				for (var key in item) 
					app.cache[key] = item[key];
			}
		}
	};
	
	// only WP at the moment
	app.cache.set('cms', WP);
	
	// app.view holds some state properties concerning the app's view
	
	app.view = {
		previewIndex: 0,
		previewMode: 'table'
	};
	
	// update file info in the UI
	
	app.view.updateFileInfo = function() {
		var props = [
			{el: 'file-name', data: app.cache.get('fileName'), prefix: 'File name:', warn: function(item) { return item.indexOf('.xml') === -1}}, 
			{el: 'file-size', data: app.cache.get('fileSize'), prefix: 'File size:'}, 
			{el: 'file-posts',data: app.cache.get('filePosts'),prefix: 'Posts:',     warn: function(item) { return item > 1000 || item === 'Error' }}, 
			{el: 'file-type', data: app.cache.get('fileType'), prefix: 'File type:', warn: function(item) { return item !== 'text/xml'}}
		];
		for (var i = 0; i < props.length; i++) {
			document.getElementById(props[i].el).textContent = props[i].prefix + ' ' + props[i].data;
			if (props[i].warn && props[i].warn(props[i].data)) {
				document.getElementById(props[i].el).className = 'uk-alert-danger';
				document.getElementById(props[i].el).innerHTML = '<i class="uk-icon-close"></i>&nbsp;&nbsp;' + document.getElementById(props[i].el).innerHTML;
			} else if (props[i].el !== 'file-size') {
				document.getElementById(props[i].el).className = 'uk-alert-success';
				document.getElementById(props[i].el).innerHTML = '<i class="uk-icon-check"></i>&nbsp;&nbsp;' + document.getElementById(props[i].el).innerHTML;
			}
		}
	};
	
	// processes input from the file input, making use of FileReader & DOMParser API
	// @param file - data as gotten from the file input
	// @param callback - a function to execute after file read has completed
	// sets app.cache.xml
	
	app.readXml = function (file, callback) { 
    var reader = new FileReader();
    reader.onload = success;  
    
    function success(e) { 
     
			var target = e.target || e.srcElement,
					parser = new DOMParser(),
					result = parser.parseFromString(target.result, 'application/xml'),
					cms = app.cache.get('cms');
					
			app.cache.set({
				xml: result,
				fileSize: Math.floor(file.size/1024, 2) + ' KB',
				fileName: file.name,
				fileType: file.type ? file.type : file.name.slice(file.name.lastIndexOf('.') + 1)
			});
			
			app.defineXmlns();
			app.extractSiteProps(cms.props.site);
			app.extractPosts(cms.item, cms.props.posts, cms.extractPostProps);
			app.view.updateFileInfo();
    }   
    
    reader.readAsText(file);                                              
	} 
	
	// defines the namespaces used by the getElementsByTagNameNS function
	// I: raw XML as gotten from app.cache.xml
	// O: an object with namespace names as keys & namespace URI's as value
	// sets app.cache.xmlns
	
	app.defineXmlns = function() {
		var root = app.cache.get('xml').getElementsByTagName(app.cache.get('cms','root'))[0],
				attrs = {}, nName, nValue;
		if (root) {
			for (var i = 0; i < root.attributes.length; i++) {
				nName = root.attributes[i].nodeName;
				nValue = root.attributes[i].nodeValue;
				if (nName.indexOf('xmlns') > -1) {
					attrs[nName.split(':')[1]] = nValue;
				}
			}
			app.cache.set('xmlns', attrs);
		}
	};
	
	// retrieves elements in an XML document, both with & without namespace.
	// @param {XMLElement|XMLDocument} doc - the root from which to search for the element
	// @param {string} tagName - the name of the element to search for
	
	app.getElementsByNameNS = function(doc, tagName) {
		var tagName = tagName;
		if (tagName.indexOf(':') > -1) {
			tagName = tagName.split(':');
			return doc.getElementsByTagNameNS(app.cache.get('xmlns')[tagName[0]], tagName[1])[0];
		} else {
			return doc.getElementsByTagName(tagName)[0];
		}
	};
	
	// sets app.cache._site
	
	app.extractSiteProps = function(props) {
		var result = {};
		for (var i = 0; i < props.length; i++) {
			if (app.getElementsByNameNS(app.cache.xml, props[i]))
			result[props[i]] = app.getElementsByNameNS(app.cache.xml, props[i]).textContent.trim();
		}
		app.cache.set('_site', result);
		return result;
	};
	
	// sets app.cache.__posts & app.cache.filePosts
	// @param {string} tag - the container tag for one post item 
	// @param {array} props - properties to pass to callback for processing
	// @param {function} callback - a function to process post items & their properties
	// the callback function should first include a call to app.extractPostProps.call()
	
	app.extractPosts = function(tag, props, callback) {
		var posts = app.cache.xml.getElementsByTagName(tag),
				result = [], post;
		for (var i = 0; i < posts.length; i++) {
			result.push(callback(posts[i], props));
		}
		app.cache.set('__posts', result);
		app.cache.set('filePosts', posts.length ? posts.length : 'Error');
	};
	
	// extractPostProps called as (part of) callback in app.extractPosts
	// @param {object} postXml - xml of an individual post item
	
	app.extractPostProps = function(postXml, props) {
		var result = {};
		for (var i = 0; i < props.length; i++) {
			if (app.getElementsByNameNS(postXml, props[i]))
				result[props[i]] = app.getElementsByNameNS(postXml, props[i]).textContent.trim();
		}
		return result;
	};
		
	// generates a preview in the preview window
	// @param {object} jsPost - a post item to preview
	// @param {number} i - the index of the post to preview
	// TODO: pass the post directly
	
	app.previewPosts = function() {
		
		var tag, value, row, vCol, tCol, 
			appendTo = document.getElementById('preview'),
			output = document.createElement('table'), 
			jsPost = app.cache.get('_posts')[app.view.previewIndex];
		if (app.getOption('view-mode') === 'view-table') {
			output.className = 'uk-table uk-table-condensed';
			for (var prop in jsPost) {
				tag = document.createElement('code');
				tag.appendChild(document.createTextNode('<' + prop + '>'));
				value = document.createTextNode(jsPost[prop]);
				row = document.createElement('tr');
				tCol = document.createElement('td');
				vCol = document.createElement('td');
				tCol.appendChild(tag);
				vCol.appendChild(value);
				row.appendChild(tCol);
				row.appendChild(vCol);
				output.appendChild(row);
			}
		} else {
			output = document.createElement('pre');
			output.appendChild(document.createTextNode(app.cache.get('posts')[app.view.previewIndex].xml));
		}
		appendTo.innerHTML = output.outerHTML;
	}
	
	// builds a GS XML page, used in function app.generatePostXml
	
	app.generatePostXml = function(node) {
		var output = '<?xml version="1.0" encoding="UTF-8"?>',
				pretty = app.getOption('pretty-print');
		if (pretty) output += '\n';
		output += '<' + node.node + '>';
		for (var i = 0; i < node.children.length; i++) {
			if (pretty) 
				output += '\n\t';
			output += '<' + node.children[i].node + '>' + (node.children[i].cdata ? '<![CDATA[' + (node.children[i].content ? node.children[i].content : '' ) + ']]>' : node.children[i].content ?  node.children[i].content : '') + '</' + node.children[i].node + '>';
		}
		if (pretty) output += '\n';
		output += '</' + node.node + '>';
		return output;
	}
		
	// function WP.processPost(content), handles output options
	// @param content {string} - String XML content to customize
	// @param url {string} - the object to make content & metad properties of
	// returns object { content: stringOutput, metad: stringOutput }
	
	app.processPost = function(post, url) {
	
		var content = post.content, metad = '', regex = {
			htmlSectioning: /<\/*(section|main|header|footer|aside|nav).*?>/g,
			htmlDiv: /<\/*div.*?>/g,
			htmlAll: /<\/*.*?>/g,
			htmlAttrClass: /\s*class=".*?"/g,
			htmlAttrId: /\s*id=".*?"/g,
			htmlEmpty: /<[^\/>][^>]*[^\/]><\/[^>]+>/,
			htmlLonely: /s/g,
			spaceEntity: /&nbsp;/g,
			spaceCharsPlus: /\s+/g
		};
		
		// make sure we don't forget to remove unnecessary &nbsp; spaces, convert them first
		post.content = content.replace(regex.spaceEntity, ' ');
		if (app.getOption('trim-whitespace'))
			post.content = content.replace(regex.spaceCharsPlus, ' ');
		
		// hook for CMS-specific functions
		if (typeof app.cache.cms.processPost === 'function')
			post = app.cache.cms.processPost(post);
		content = post.content;
		// handle options
		if (app.getOption('link-handler') !== 'none') {
			if (app.getOption('link-handler') === 'root-rel')
				content = content.replace(new RegExp(url, ''));
			else if (app.getOption('link-handler') === 'new-link')
				content = content.replace(new RegExp(url, app.getOption('new-link-url')));
		}
		if (app.getOption('strip-sections'))
			content = content.replace(regex.htmlSectioning, '');
		if (app.getOption('strip-divs'))
			content = content.replace(regex.htmlDiv, '');
		if (app.getOption('strip-id'))
			content = content.replace(regex.htmlAttrId, '');
		if (app.getOption('strip-class'))
			content = content.replace(regex.htmlAttrClass, '');
		if (app.getOption('strip-empty'))
			content = content.replace(regex.htmlEmpty, '');
		
		post.content = content;
		return post;
	};
	
	// generates output in json tree + xml, both for display in app.previewPosts
	// as well as for export (the xml array) & download
	
	app.generatePostsOutput = function(posts) {
		app.cache.set('_posts', app.cache.get('cms').convertPosts(posts));
		var output = '', tree, arr = [], posts = posts || app.cache.get('_posts');
		for (var i = 0; i < posts.length; i++) {
			tree = new app.gsXML();
			console.log(posts[i].metad);
			for (var prop in posts[i]) {
				tree.set(prop, 'content', posts[i][prop]);
			}
			arr.push({json: tree.data, xml: app.generatePostXml(tree.data)});
		}
		app.cache.set('posts', arr);
		return arr;
	};
	
	// app.processPost hook for WP-specific options
	
	WP.processPost = function(post) {
		var content = post.content, metad = post.metad, regex = {
			htmlAll: /<\/*.*?>/g,
			wpShorts: /\[.*?\[\/.*?\]/g,
			wpMoreTag: '<!--more-->'
		};
		if (app.getOption('strip-shortcodes')) 
			content = content.replace(regex.wpShorts, '');
		if (content.indexOf(regex.wpMoreTag) > 0) {
			content = content.split(regex.wpMoreTag);
			if (app.getOption('set-more-metad'))
				metad = content[0].replace(regex.htmlAll, '');
			if (app.getOption('strip-more-text'))
				content = content[1];
			else
				content = content.join('');
			if (app.getOption('strip-more-tag'))
				content = content.replace(regex.wpMoreTag, '');
		}
		post.content = content;
		post.metad = metad || '';
		return post;
	};
	
	// basically the same as generic postprop extractor,
	// except we map individual category fields to one property
	
	WP.extractPostProps = function(postXml, props) {
		// result holds an object with all defined tags as children
		// so we can add a new property to it without problem
		var result = app.extractPostProps.call(null, postXml, props),
				categories = postXml.getElementsByTagName('category');
		result.categories = [];
		
		for (var i = 0; i < categories.length; i++) {
			result.categories.push(categories[i].textContent);
		}
		result.categories = result.categories.join(', ');
		return result;
	};
	
	WP['convertPosts'] = function(jsPosts) {
		var jsPosts = app.cache.get('__posts');
		var map = WP.map, result = [], processedContent;
		for (var i = 0; i < jsPosts.length; i++) {
			result[i] = {};
			for (var prop in jsPosts[i]) {
				if (map.hasOwnProperty(prop))
					result[i][map[prop].mapTo] = jsPosts[i][prop];
			}
			processedContent = app.processPost(result[i], app.cache.get('_site')['wp:base_site_url']);
			result[i].metad = processedContent.metad;
			result[i].author = result[i].user;
			result[i].content = processedContent.content;
			result[i].template = app.getOption('set-tmpl');
			result[i].parent = app.getOption('set-parent');
		}
		return result;
	};
	app.bindClick = function(e) {
		var target = e.target || e.srcElement;
		if (target.id === 'convert-xml') {
			app.generatePostsOutput();
	    app.previewPosts();
		} else if (target.id === 'preview-prev' || target.parentNode.id === 'preview-prev') {
			app.view.previewIndex = app.view.previewIndex - 1 > 0 ? app.view.previewIndex - 1 : 0;
		  app.previewPosts();
		} else if (target.id === 'preview-next' || target.parentNode.id === 'preview-next') {
			app.view.previewIndex = app.view.previewIndex + 1 < app.cache.get('posts').length ? app.view.previewIndex + 1 : app.view.previewIndex;
		  app.previewPosts();
		} else if (target.id === 'download-zip') {
			var posts = app.cache.get('posts'),
		      zip = new JSZip(), fileName;
			for (var i = 0; i < posts.length; i++) {
				fileName = posts[i].json.children[1].content + '.xml';
				zip.file(fileName, posts[i].xml);
				console.log(zip);
			}
			var content = zip.generate({type:"blob"});
			saveAs(content, "posts.zip");
		}
	}
	addEvent(document.getElementById('upload-xml'), 'change', function(e) {
		var target = e.target || e.srcElement;
	  app.readXml(target.files[0]);
	});
	addEvent(document.body, 'click', app.bindClick);
	document.getElementsByName('view-mode')[0].onchange = app.previewPosts;
	document.getElementsByName('view-mode')[1].onchange = app.previewPosts;
	
	document.getElementById('other-settings').innerHTML = '<tr><th colspan="2">' + app.cache.get('cms','name') + '</th></tr>' + document.getElementById(app.cache.get('cms').name.toLowerCase() + '-settings').innerHTML;
}());

		/*
		// this part might be useful for unmapping unknown tags
		function iter(node, obj) {
			var result = obj || {};
			if (node.nodeType === 1 && node.childNodes.length) {
				result[node.nodeName.toLowerCase()] = {};
			for (var i = 0; i < node.childNodes.length; i++) {
				iter(node.childNodes[i], result[node.nodeName.toLowerCase()]);
			}
			} else if (node.nodeType === 3 ||node.nodeType === 8  ) {
				result[node.nodeName.toLowerCase()] = node.textContent;
			} 
			return result;
		} */