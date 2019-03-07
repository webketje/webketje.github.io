# What no one will tell you about the virtual DOM

First, a recap of what everyone will tell you about the virtual DOM:

Using the DOM is hard. Manipulating the DOM is slow. The virtual DOM lets you focus on application logic. The virtual DOM allows you to write *declarative code*. The virtual DOM enables us to write reactive code. Yada yada yada. 

In every corner of the web front-end developers sing chants of praise for the virtual DOM.
Evangelists appear, they assemble the 10 commandments of virtual DOM into a religious doctrine, and before you know it the virtual DOM witnesses are at your doorstep trying to sell you the religion that is, of course, the ultimate answer to everything.

## Why the virtual DOM was born

The concept of virtual DOM implies the existence of a real DOM, but there is no real DOM. There is only a DOM specification (with *levels* added over time) by the WHATWG and W3C, and DOM implementations by browser vendors, such as Google, Mozilla, and Apple, commonly referred to as the 'real' DOM.  

The 'real' Document Object Model was born as an alternative to manipulating an HTML document as a giant string, parsing it with regex and such. Everyone knew that was a bad idea and someone dedicated a (now famous) long-form [StackOverflow answer](https://stackoverflow.com/questions/1732348/regex-match-open-tags-except-xhtml-self-contained-tags#1732454) to it. In essence the DOM is Yet Another Interface. In the browser, between Javascript code and an HTML document. Just like the browser is an interface between users and content served over internet.

The real DOM allows developers to modify webpages dynamically. That is, without reloading the page. This provides benefit to the user (speed, user experience) but most importantly it puts less strain on the website/app server. Thanks to the DOM, users enjoy the experience of advertisement, cookie consent, and subscription popups as well as easily removable paywalls. 


Under the hood, the virtual DOM uses techniques like . 

most popularly embodied in Facebook's React framework.

Ok admittedly I went too far there. And admittedly, the virtual DOM does have its merits. But so do the foundations on which religions are based, and it didn't stop their advocates from committing huge mistakes. The difference is that religion is based on belief, while web development is (I hope at your organisation) based on assertions, like tests.