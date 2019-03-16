---
title: Scrolling to an element (smoothly) with HTML/CSS/Javascript  
date: 2019-03-10
---

In the early 2010's the only solid options for smooth scrolling were jQuery's `animate` or rolling your own Javascript algorythm. Back then I [answered a Stackoverflow question](https://stackoverflow.com/questions/24739126/scroll-to-a-specific-element-using-html/24739518#24739518). but the topic deserves its own little guide. 

The simplest way to implement a scroll-to are page anchors. Use the `<a>` tag with a `href` matching an element id prefixed with a hash, like so:

```
<a href="#page-2">Tab 2</a>

<div id="page-1">
  Content...
</div>
<div id="page-2">
  Content...
</div>
``` 

With the CSS `:target` selector you can do quite advanced things, like tab navigation and tabs with nothing more than some HTML and CSS. Have a look at the example below:

```
<nav>
  <a href="#tab-1">Tab 1</a>
  <a href="#tab-2">Tab 2</a>
</nav>

<div class="tabs">
  <div id="tab-1">
    Content...
  </div>
  <div id="tab-2">
    Content...
  </div>
</div>

```

All good, but there are some drawbacks to this basic scrolling method:

* You are limited to using element id's for scrolling targets. By some id's are seen as an anti-pattern as every element with an ID is registered in the Javascript window object as `window.id`.
* Hash scroll navigation may interfere with modern client-side fallback routings, such as implemented by frameworks like vue-router or react-router.
* 


Thanks to the (relatively) new CSSOM `scroll-behavior` property (which is, at the time of writing only supported in the latest Firefox & Chrome), you can easily get a smooth scroll. To enable automatic smooth scrolling for all anchor links, you can simply do:


```
html { scroll-behavior: smooth; }
```





