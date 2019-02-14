---
layout: post.twig
title: Graceful degradation is a myth
subtitle: Case studies of progressive enhancement and graceful degradation
description: Case studies of progressive enhancement and graceful degradation
category: User experience
tags:
---

## What is progressive enhancement?

Progressive enhancement is often contrasted with graceful degradation. In the philosophy of progressive enhancement, baseline functionality is provided to every page visitor and extra's are available for visitors without disabilities, using more powerful devices, or allowing more access to personal data (e.g. location-sharing or allowing desktop notifications). 

Following an approach of graceful degradation, all desired functionality is implemented and matched against the most powerful devices, and functionality stripped off for lower-end devices, users with disabilities or users restricting the set of features available to a webpage (for example in incognito mode, client session storage cannot be relied upon).

Basically the former builds from bottom to top, and the latter from top to bottom.

## Pitfalls of graceful degradation

As it often might (and has in my experience), the approach of graceful degradation threatens to transform into _ungraceful degradation_ or just full-on _exclusion_. 

## On-page navigation

## Images enclosed in anchor tags

Images can be enclosed in anchor tags, when the image displayed is a thumbnail of the full-size image which can be expanded upon clicking the link. This is often done in image galleries, or for media permalinks on blogs. A minimal HTML-only implementation:

```html
<a href="/full-size-image.png" title="View full size" target="_blank">
  <img src="/resized-image.png" alt="An image">
</a>
```

This minimal implementation has some inconveniences: 

* Upon clicking the link, with `target="_blank`, a new tab will open, which interrupts the user experience flow. Without the attribute, the image will load in the current tab, but if the user wants to go back, (s)he now has to do a full reload of the webpage.
* No affordances of its own (like zoom/ next/ download buttons), all its affordances are tied to the knowledge users have about how to use their browsers (long-press, right-click, scroll).

But every user will be able to view, zoom or download the image provided that they know their browsers well-enough.
A CSS hover effect can be added for desktop users to let them know that clicking the image will lead them 

```html
<a href="/full-size-image.png" title="View full size" target="_blank">
  <img src="/resized-image.png" alt="An image">
</a>
```

**References**

* https://www.mavenecommerce.com/blog/progressive-enhancement-vs-graceful-degradation/