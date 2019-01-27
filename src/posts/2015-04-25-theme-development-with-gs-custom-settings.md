---
title: Theme development with GS Custom Settings
category: getsimplecms
img: /assets/posts/gscs_advanced_theming_ft.png
tags: GetSimple PHP plugin theme
lastmod: 2015-04-25
layout: post.twig
description: This article gives tips about how to use GS Custom Settings to its full extent for theme development. 
intro: |
  This article gives tips about how to use GS Custom Settings to its full extent for theme development, and includes advice, 
  tips, and multiple use cases for augmenting your theme and offering customization to your theme users, thereby also augmenting your theme's value.
---
This tutorial will focus on how to integrate GS Custom Settings in theme development, if you need to get familiar with regular GetSimple theming, read [the tutorial](http://get-simple.info/wiki/themes:creation) in the wiki. It's also handy to keep a browser tab open on the [complete template tags reference](http://get-simple.info/wiki/themes:template_tags).

### Contents

<ol>
<li>
<a href="#preface">Preface</a>
<ol>
<li><a href="#best-practices">Best practices</a></li>
<li><a href="#php-you-should-know">Some PHP you should know</a></li>
<li><a href="#considering-theme-variables">Considering the theme variables</a></li>
</ol>
</li>
<li>
<a href="#basic">Basic</a>
<ol>
<li><a href="#outputting-text-and-html-content">Output: text and HTML content</a></li>
<li><a href="#show-hiding-content">Output: Show-/hiding content</a></li>
<li><a href="#allowing-custom-css">Styling: Allowing custom CSS</a></li>
<li><a href="#tweak-fonts-and-colors">Styling: Tweakable fonts and colors</a></li>
<li><a href="#multiple-options">Styling: Multiple options</a></li>
<li><a href="#theme-and-author-data">Meta: Setting theme &amp; author data</a></li>
</ol>
</li>
<li>
<a href="#intermediate">Intermediate</a>
<ol>
<li><a href="#google-web-fonts">Styling: Google web fonts</a></li>
<li><a href="#third-party-embeds">Output: third party embeds</a></li>
<li><a href="#third-party-services">Data: Enabling third party services</a></li>
<li><a href="#social-media-links">Output: social media icon links collection</a></li>
<li><a href="#key-value-pairs">Meta: date format - hidden settings/ custom properties for key-value pairing</a></li>
</ol>
</li>
</ol>
<a name="preface"></a>

### Preface

<a name="best-practices"></a>

#### Best practices

##### Themes with GS Custom Settings

If you use GS Custom Settings for a theme, make sure to mention in the theme description in the [GS Extend repo](http://get-simple.info/extend/") that your theme _requires_ installing the Custom settings plugin first, or wrap the entire HTML in an `if` clause, and output a message _'This theme requires GS Custom Settings to work'_, else you will get a lot of _undefined function_ errors. Here's a sample snippet that you can directly copy paste in your theme's Extend description:

```plaintext
This theme requires [GS Custom Settings](http://get-simple.info/extend/plugin/gs-custom-settings/913/).
```
and one for in the forum threads:

```plaintext
This theme requires [url=http://get-simple.info/extend/plugin/gs-custom-settings/913/]GS Custom Settings[/url].
```
##### Empty text settings

Often you need to check whether a setting is valid. When the only check you need is whether a text setting is empty, you can avoid creating a checkbox to 'enable' the setting (eg. a social media link) by  checking the string length of the setting's value. When it is an empty string, its length is 0, so PHP will evaluate to `false` when you call `return_setting('theme', 'myTextSetting')`. In the setting's description, simply write something like <em>&quot;Leave empty to disable&quot;</em>. For example, the `text` setting `social_fb` could be outputted as follows:

```php
<?php if (return_setting('theme', 'social_fb'))
   echo '<a href="' . return_setting('theme', 'social_fb') . '><i class="fa fa-facebook'></i></a>; ?>
```
##### Using `for` loops

If you're using setting output in PHP `for` or `foreach` loops, it is wisest to put them in a PHP variable before the loop. Although calls to `return/get_setting` are not very expensive, it does save some performance.

```php
<?php $show_img = return_setting('theme', 'blog_show_img'); 
 foreach ($items as $item) {
 echo '<div class="post">' . ($show_img ? '<img src="">' : '') . '</div>'; ?>
```

##### Easily accessing a group of settings

If you need to access many settings (more than 5) in one particular place in your theme, _from v0.4 onwards_ you can use `return_setting_group` to return an entire group of settings as a PHP array. For the function to work, you should prefix the setting lookups with a common name, followed by an underscore (`_`); eg. for all profile-related settings, you could have: `profile_h` for the headline, `profile_desc` for the description and `profile_name` for the name. You can then access the returned settings _without the prefix_. In PHP you could simply do:

```php
<?php $profile = return_setting_group('theme', 'profile'); 
 echo '<h1>' . $profile['name'] . '<h1>';
 echo '<h3>' . $profile['h'] . '</h3>';
 echo '<p>' . $profile['desc'] . '</p>'; ?>
```

#### Some PHP you should know

As soon as you need to do some more advanced stuff (like in the section Intermediate), you will sometimes need to pre-process the output of a setting. In that case, some of the most useful PHP functions to know are:

* `echo($string)` - Outputs the given string.
* `strip_tags($string)` - Removes HTML tags from the string.Handy for example if you want to use HTML in the profile description on the page, and use the same setting for social media/ meta descriptions but without HTML.
* `explode($delimiter, $string)` - Splits a string into an array on `$delimiter`. Useful if you want to re-use and pre-process settings with options or fixed formats.
* `str_replace($search, $replacement, $string)`
* `strlen($string)` - Returns the length of a string. Useful for checking purposes.
* `date($format[, $timestamp])` - Returns a date in the specified `$format`. Useful for blog posts/ footer copyright/ event dates.
* `substr($string, $start, $length)` - Subtracts a part of a string starting at `$start` and ending at `$start + $length`. Useful for eg. post excerpts

<a name="considering-theme-variables"></a>

#### Considering the theme *variables*

<p>First we need to consider which settings will be adjustable in the template. For inspiration, you could have a look at <a href="http://scaffold.tumblr.com/options/">Tumblr theme options</a>, ThemeForest Wordpress' <a href="http://i.imgur.com/1kEkKAu.png">Select options</a>, or even <a href="http://2.bp.blogspot.com/-5o8ExgEBbVk/TzYiXNXleDI/AAAAAAAAFig/38Mcn18TVog/s1600/Change%2Bpost%2Btitle%2Bcolor%2Bin%2BBlogger%2Btemplates.png">Blogger template options</a>. Generally, you will want to provide settings in three/ four different sections: </p>

1. **Styling**: Providing users the ability to modify theme colors, fonts and other styles without having to dig into your template, and with the option to change them over time.
2. **Output**: Providing users the ability to place content in fixed theme positions   (like footer content, contact details, etc.) without having to dig into your template.
3. **Data**: Providing users the ability to include/ turn off certain parts of the template, like a social media widget, or whether or not to show the author name under blog posts.
4. **Meta-settings**: Primarily meant for you, the developer, and usually set to `locked`/`hidden` in the interface, to facilitate version checking, include credits and links, and fixed information.


<a name="basic"></a>

### Basic

<a name="outputting-text-and-html-content"></a>

#### Outputting text and HTML content

##### SETTINGS

<table style="border-collapse: collapse;">
 <thead>
  <tr>
    <th>Label</th>
    <th>Lookup</th>
    <th>Type</th>
  </tr>
 </thead>
 <tbody>
  <tr>
    <td>Name</td>
    <td><code>contact_name</code></td>
    <td><code>text</code></td>
  </tr>
  <tr>
    <td>Email</td>
    <td><code>contact_email</code></td>
    <td><code>text</code></td>
  </tr>
  <tr>
    <td>Address</td>
    <td><code>contact_address</code></td>
    <td><code>textarea</code></td>
  </tr>
  <tr>
    <td>Fax/ Phone</td>
    <td><code>contact_phone</code></td>
    <td><code>textarea</code></td>
  </tr>
 </tbody>
</table>

##### DISCUSSION

Outputting content is the most basic functionality of GS Custom Settings. In the example below we output the values of the settings `email`, `phone` and `address` to the `contact.php` template. The settings are preceded by a FontAwesome icon. Note that if you want `textarea` settings to preserve multiple lines, you will have to set the CSS `white-space` property to `pre/ pre-wrap/ pre-line`.

```php
<address>
  <div><p style="white-space: pre;">
    <i class="fa fa-fw fa-lg fa-map-marker"></i><?php get_setting('theme', 'contact_address'); ?>
  </p></div>
  <div><p>
    <i class="fa fa-fw fa-lg fa-at"></i><?php get_setting('theme', 'contact_email'); ?>
  </p></div>
  <div><p style="white-space: pre;">
    <i class="fa fa-fw fa-lg fa-phone"></i><?php get_setting('theme', 'contact_phone'); ?>
  </p></div>
</address>
```

Another popular example is outputting a copyright notice in the theme footer:

```php
<footer id="site-footer">&copy;
  <?php echo date('Y');?> <?php get_setting('theme', 'contact_name'); ?>
</footer>
```

You may also want to let the user decide which HTML content should be outputted, for example to **highlight** a part of the phrase, or to customize, eg sidebar widget content. The `textarea` or `text` settings may contain HTML. As such, if you had a  `textarea` setting `sidebar_html`, you could do the following:


<a name="show-hiding-content"></a>

#### Show-/hiding content

##### SETTINGS

<table style="border-collapse: collapse;">
 <thead>
  <tr>
    <th>Label</th>
    <th>Lookup</th>
    <th>Type</th>
  </tr>
 </thead>
 <tbody>
  <tr>
    <td>Show title on blog page?</td>
    <td><code>blog_show_title</code></td>
    <td><code>checkbox</code></td>
  </tr>
  <tr>
    <td>Profile image</td>
    <td><code>profile_img</code></td>
    <td><code>image</code></td>
  </tr>
  <tr>
    <td>Lead paragraph</td>
    <td><code>profile_desc</code></td>
    <td><code>textarea</code></td>
  </tr>
 </tbody>
</table>

##### DISCUSSION

Conditionally showing content is pretty easy, the checkbox setting will either return `true` or `false`. The snippet below shows/hides the title of pages using a blog template, that can both be set as home or distinct blog page. Useful as you would usually not display the title when the blog is also the homepage.

```php
<?php if (return_setting('theme', 'blog_show_title')) { ?>
  <h1><?php get_page_title(); ?></h1>
<?php } ?>
```

You may also want to hide output when a `textarea/text/image` setting is <em>not set</em> (when the value is an empty string). 
If the setting has no container element, you can simply call `get_setting` and an empty string will be outputted (<em>note: with v0.3 the image setting will return an image with a broken link if you do this</em>).

```php
<?php get_setting('theme', 'profile_desc'); ?>
<?php get_setting('theme', 'profile_img'); ?>
```

If the setting output does have a container element, you need to check whether it is non-empty with `return_setting`:

```php
<?php if (return_setting('theme', 'profile_img')) { ?>
  <div id="profile-img"><?php get_setting('theme', 'profile_img'); ?><div>
<?php } ?>
```

<a name="allowing-custom-css"></a>

#### Styling: allowing custom CSS

##### SETTINGS

<table style="border-collapse: collapse;">
 <thead>
  <tr>
    <th>Label</th>
    <th>Lookup</th>
    <th>Type</th>
  </tr>
 </thead>
 <tbody>
  <tr>
    <td>Custom CSS</td>
    <td><code>css_custom</code></td>
    <td><code>textarea</code></td>
  </tr>
 </tbody>
</table>

##### DISCUSSION

Custom CSS is the easiest way to provide users a way to change the visual style without touching the template, but of course it requires them to go look for classes and id's in the browser, and at least have a basic understanding of CSS, so not very user-friendly. You should output this setting <em>at the end of your dynamic CSS</em>, so that if the user makes a syntax error nothing else gets lost.

```php
<style>
 /* other style rules */
 <?php get_setting('theme', 'custom_css'); ?>
</style>
```

<a name="tweak-fonts-and-colors"></a>

#### Styling: Tweakable fonts and colors

##### SETTINGS

<table style="border-collapse: collapse;">
 <thead>
  <tr>
    <th>Label</th>
    <th>Lookup</th>
    <th>Type</th>
  </tr>
 </thead>
 <tbody>
  <tr>
    <td>Theme color 1</td>
    <td><code>css_pri_color</code></td>
    <td><code>color</code></td>
  </tr>
  <tr>
    <td>Theme color 2</td>
    <td><code>css_sec_color</code></td>
    <td><code>color</code></td>
  </tr>
  <tr>
    <td>Headings font</td>
    <td><code>css_hfont</code></td>
    <td><code>select</code></td>
  </tr>
  <tr>
    <td>Headings text color</td>
    <td><code>css_hcolor</code></td>
    <td><code>color</code></td>
  </tr>
  <tr>
    <td>Body font</td>
    <td><code>css_pfont</code></td>
    <td><code>select</code></td>
  </tr>
  <tr>
    <td>Body text color</td>
    <td><code>css_pcolor</code></td>
    <td><code>color</code></td>
  </tr>
 </tbody>
</table>

##### DISCUSSION

The color settings take any valid CSS colors (color name, HEX, RGB, HSL or RGBA). You would keep all fixed CSS in a separate stylesheet `style.css`, and include the changeable CSS in your `header.inc.php` or `dynamic_css.inc.php` or something alike in a `<style>` tag. Below is an example of how you would output dynamic styling options into your theme: 

```php
<style>
  h1,h2,h3,h4,h5,h6, #site-nav a {
    color: <?php get_setting('theme', 'css_hcolor'); ?>; 
    font-family: <?php get_setting('theme', 'css_hfont'); ?>; 
  }
  body, body p, body ul, body ol, body blockquote { 
    color: <?php get_setting('theme', 'css_pcolor'); ?>; 
    font-family: <?php get_setting('theme', 'css_pfont'); ?>; 
  }
  #profile-social a, #blog-roll .tags li a, .tags li div {
    background-color:  <?php get_setting('theme', 'css_pri_color'); ?>;
  }
  #profile-social a:hover, #profile-social a:active { 
    background-color:  <?php get_setting('theme', 'css_sec_color'); ?>; 
  }
  a, a:link, a:visited, #site-nav a, #site-nav a:visited, #blog-roll h3 a  { 
    color: <?php get_setting('theme', 'css_pri_color'); ?>;  
  }
  a:active, a:hover, #site-nav a:hover, #site-nav a:active, 
  #blog-roll h3 a:hover, #blog-roll h3 a:active { 
    color: <?php get_setting('theme', 'css_sec_color'); ?>; 
  }
  <?php get_setting('theme', 'custom_css'); ?>
</style>
```

<a name="multiple-options"></a>

#### Styling: multiple options

##### SETTINGS

<table style="border-collapse: collapse;">
 <thead>
  <tr>
    <th>Label</th>
    <th>Lookup</th>
    <th>Type</th>
  </tr>
 </thead>
 <tbody>
  <tr>
    <td>Theme style</td>
    <td><code>css_theme</code></td>
    <td><code>radio</code></td>
  </tr>
 </tbody>
</table>

##### DISCUSSION

You can provide customization through a fixed range of options, with the `radio` or `select` type.
The `radio` setting `css_theme` has 3 options: square, rounded or circle. In our `style.css` stylesheet, the following rules could be defined (none for square, that is default):

```css
.circle #profile-image img, .circle #profile-social a { 
  -moz-border-radius: 50%;
  -o-border-radius: 50%;
  -webkit-border-radius: 50%;
  -ms-border-radius: 50%;
  border-radius: 50%;
  overflow: hidden;
}
.rounded #profile-image img, .rounded #profile-social a, .rounded .post-meta img, #main img { 
  -moz-border-radius: 5px;
  -o-border-radius: 5px;
  -webkit-border-radius: 5px;
  -ms-border-radius: 5px;
  border-radius: 5px;
  overflow: hidden;
}
```

In the theme we set a variable class on the `<body>` tag:

```php
<body class="<?php get_setting('theme', 'css_theme');?>">
```

Similarly, if you had a setting `profile_img_size` with 3 options: small, normal, big; you could set the size of the profile image only:

```php
<style>
  #profile-image.big img { height: 160px;}
  #profile-image.normal img, #profile-image img { height: 128px;}
  #profile-image.small img { height: 96px; }
</style>
<div class="<?php get_setting('theme', 'profile_img_size');?>"><img src="/my/image.jpeg"></div>
```

The theme will allow users to `<select>` one of +- 20 different fonts, including a couple from Google fonts.

<img src="/assets/posts/gscs_advanced_theming/themetut_font_options.png">

If you limit your font options to the [websafe fonts](http://www.cssfontstack.com/), adding 2 extra `font-family` lines to the dynamic CSS like below will suffice. Generally this should also be fine if you included custom fonts in your CSS with `@font-face`. However, <a href="#google-web-fonts">read on for Google webfonts</a>.

```php
h1,h2,h3,h4,h5,h6, #site-nav a {
  color: <?php get_setting('theme', 'css_hcolor'); ?>; 
  font-family: <?php get_setting('theme', 'css_hfont'); ?>; 
}
body, body p, body ul, body ol, body blockquote { 
  color: <?php get_setting('theme', 'css_pcolor'); ?>; 
  font-family: <?php get_setting('theme', 'css_pfont'); ?>; 
}
```
### Meta: Setting theme &amp; author data

##### SETTINGS

<table style="border-collapse: collapse;">
 <thead>
  <tr>
    <th>Label</th>
    <th>Lookup</th>
    <th>Type</th>
    <th>Access</th>
  </tr>
 </thead>
 <tbody>
  <tr>
    <td>Theme version</td>
    <td><code>version</code></td>
    <td><code>text</code></td>
    <td>Locked</td>
  </tr>
  <tr>
    <td>Theme link</td>
    <td><code>url</code></td>
    <td><code>text</code></td>
    <td>Locked</td>
  </tr>
  <tr>
    <td>Extend ID</td>
    <td><code>extend_id</code></td>
    <td><code>text</code></td>
    <td>Locked</td>
  </tr>
  <tr>
    <td>Author</td>
    <td><code>author</code></td>
    <td><code>text</code></td>
    <td>Locked</td>
  </tr>
  <tr>
    <td>Author URL</td>
    <td><code>author_url</code></td>
    <td><code>text</code></td>
    <td>Locked</td>
  </tr>
 </tbody>
</table>

##### DISCUSSION

Theme and author info typically are not customizable and with GS Custom Settings you can (if you wish) easily keep track of them by creating some settings. If you wish to display them for users, set the settings' access to <em>Locked</em>. If you rather hide them, set them to <em>Hidden</em>. The `extend_id` setting **might become important in the future for automatic theme update notifications in the UI**.

You might also want to output some of these settings, for example in the site footer:

```php
<footer id="site-footer">&copy;
  <?php echo date('Y');?> <?php get_setting('theme', 'contact_name'); ?>
  Theme <a href="<?php get_setting('theme','url'); ?>">My theme</a> 
  v.<?php get_setting('theme','version'); ?>by 
  <a href="<?php get_setting('theme', 'author_url');?>"><?php get_setting('theme', 'author'); ?></a>
</footer>
```

**Note:** With GS Custom Settings v0.4+ you might want to add a `version` property in the `tab` object in your `settings.json` file. GS Custom Settings will automatically update your settings (if there are any changes) when a user installs an updated version of your theme.

<a name="intermediate"></a>

### Intermediate

<a name="google-web-fonts"></a>

#### Styling: Enabling Google Webfonts

##### SETTINGS

<table style="border-collapse: collapse;">
 <thead>
  <tr>
    <th>Label</th>
    <th>Lookup</th>
    <th>Type</th>
  </tr>
 </thead>
 <tbody>
  <tr>
    <td>Headings font</td>
    <td><code>css_hfont</code></td>
    <td><code>select</code></td>
  </tr>
  <tr>
    <td>Body font</td>
    <td><code>css_pfont</code></td>
    <td><code>select</code></td>
  </tr>
 </tbody>
</table>

##### DISCUSSION

But you could also give your users some more options by providing <em>Google Webfonts</em>, and we need to add a couple of extra lines of code to the `<head>` of our page (above the `<style>` tag) to include them <strong>only if</strong> the user has selected one; because they impact loading times negatively. For this purpose, we need to slightly **preprocess** them with PHP. Google expects an API call like this:

```html
<link rel="stylesheet" type="text/css" href="http://fonts.googleapis.com/css?family=font+name">
```

We only want the first font in the option, and we need to replace space characters with `+`, It is good to know the following 2 PHP functions:

* [explode($delimiter, $string)](http://php.net/manual/en/function.explode.php)
* [str_replace($search, $replacement, $string)](http://php.net/manual/en/function.str-replace.php)

In the code below, we <em>(1)</em> create 2 PHP vars `$t_hfont` (headings font) and `$t_pfont` (paragraph font), <em>(2)</em> get the setting with a call to `get_setting` and the third parameter as `FALSE` to output the <em>display value</em> of a setting (if you did `return_setting` you would get a number, because the raw value of option settings is the index of the selected option).. <em>(3)</em> With `explode` we split the string into an array, then in that string <em>(4)</em> we replace space characters with a <strong>+</strong> via `str_replace`.

Finally, because the first 13 options are <em>not</em> Google fonts,  we check with `return_setting` if the <em>raw</em> value of the font settings is higher than 13, and only include it then.

```php
<?php 
$t_hfont = get_setting('theme', 'css_hfont', false);
$t_hfont = explode(', ', $t_hfont);
$t_hfont = str_replace(' ', '+', $t_hfont[0]);
$t_pfont = get_setting('theme', 'css_pfont', false);
$t_pfont = explode(', ', $t_pfont);
$t_pfont = str_replace(' ', '+', $t_pfont[0]);

if (return_setting('theme', 'css_hfont') > 13) { ?>
<link rel="stylesheet" type="text/css" 
      href="http://fonts.googleapis.com/css?family=<?php echo $t_hfont;?>">
<?php } if (return_setting('theme', 'css_pfont') > 13) { ?>
<link rel="stylesheet" type="text/css" 
      href="http://fonts.googleapis.com/css?family=<?php echo $t_pfont;?>">
<?php } ?>
```

<a name="third-party-embeds"></a>

#### Third party embeds (maps, social feeds,..)

This setup will enable the user to:

* embed a Twitter profile feed from the UI
* embed a static Google Map with basic options from the UI

<table style="border-collapse: collapse;">
 <thead>
  <tr>
    <th>Label</th>
    <th>Lookup</th>
    <th>Type</th>
  </tr>
 </thead>
 <tbody>
  <tr>
    <td>Twitter feed</td>
    <td><code>twttr_fd</code></td>
    <td><code>text</code></td>
  </tr>
  <tr>
    <td>Twitter widget ID</td>
    <td><code>twttr_id</code></td>
    <td><code>text</code></td>
  </tr>
  <tr>
    <td>Google Map on contact page?</td>
    <td><code>gmap_on</code></td>
    <td><code>checkbox</code></td>
  </tr>
  <tr>
    <td>Google Map size</td>
    <td><code>gmap_size</code></td>
    <td><code>text</code></td>
  </tr>
  <tr>
    <td>Google Map zoom</td>
    <td><code>gmap_zoom</code></td>
    <td><code>text</code></td>
  </tr>
  <tr>
    <td>Address</td>
    <td><code>contact_address</code></td>
    <td><code>textarea</code></td>
  </tr>
 </tbody>
</table>

##### DISCUSSION

Embedding a Twitter (user) feed is as simple as copy pasting the code from the [dev guide](https://dev.twitter.com/web/embedded-timelines/user) and replacing the feed name. Also don't forget to put a surrounding `if` clause to test if the settings are not empty to avoid JS errors. To be able to use the feed, the user needs to create a 'widget' in his Twitter account for a certain profile, and copy paste the widget's ID and the feed's name into GS Custom Settings.

```php
<?php if (return_setting('theme', 'twttr_fd') && return_setting('theme', 'twttr_id')) { ?>
<a class="twitter-timeline" 
   href="https://twitter.com/<?php get_setting('theme', 'data_twttr_fd'); ?>"
   data-widget-id="<?php get_setting('theme', 'data_twttr_id'); ?>">
Tweets by @<?php get_setting('theme', 'data_twttr_fd'); ?></a>
<script>
  !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';
  if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";
  fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");
</script><?php } ?>
```

For the Google Map we will use the `contact_address` setting from our theme. Suppose the site owner is Google UK. Their address is entered as:

```
Google UK, 
Belgrave House, 
76 Buckingham Palace Road, 
London
```

To understand this part, read up on the [Google Maps Static API](https://developers.google.com/maps/documentation/staticmaps/). The output is served as image data, so we need an image tag, and a safe URL which we obtain through PHP's `url_encode`. The Static Maps API takes a couple of parameters for customization; here I will only include 3: the location, zoom level, and image size. Zoom levels are between 0 and 21, and image size is in the format `w x h`, as in `100x100` (these details can be explained in the setting description).

```php
<?php $gmap = return_setting_group('theme', 'gmap');
if ($gmap['on']) {
   $gmap_url = 'size=' . $gmap['size'] . '&zoom=' . $gmap['zoom'] . '&markers=color:red%7C';
   $gmap_url .= urlencode(return_setting('theme', 'contact_address')); ?>
<img src="https://maps.googleapis.com/maps/api/staticmap? <?php echo $gmap_url; ?>">
<?php } ?>
```

<a name="third-party-services"></a>

#### Third party services (analytics, comments,..)

The following code allows the user to:

* Set Google Analytics (both classic and universal account types) from the UI with the GA ID.

##### SETTINGS

<table style="border-collapse: collapse;">
 <thead>
  <tr>
    <th>Label</th>
    <th>Lookup</th>
    <th>Type</th>
  </tr>
 </thead>
 <tbody>
  <tr>
    <td>Google Analytics ID</td>
    <td><code>data_ga</code></td>
    <td><code>text</code></td>
  </tr>
 </tbody>
</table>

##### DISCUSSION

Many third-party services (like mail forms, analytics trackers, comment systems) can be embedded via a Javascript API on the page. For this example, we will add [Google Analytics](http://analytics.google.com). First copy paste the tracker code: Google Analytics [has 2](https://developers.google.com/analytics/devguides/collection/web/) (universal vs. classic). Instead of having another checkbox for the user to set, we can check it in the code because the tracking codes for universal and classic analytics have a different format.

```php
<?php if (return_setting('theme', 'data_ga')) { ?>
<script type="text/javascript">
  <?php $ga_method = explode('-', return_setting('theme', 'data_ga')); 
  $ga_method = strlen($ga_method[1]) === 4 ? 'uni' : 'classic';
  if ($ga_method === 'classic') { ?>

  var _gaq = _gaq || []; 
  _gaq.push(['_setAccount', '<?php get_setting('theme','data_ga'); ?>']); 
  _gaq.push(['_trackPageview']);
  (function() { var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s); })();

  <?php } elseif ($ga_method === 'uni') { ?>

  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
  ga('create', '<?php get_setting('theme', 'data_ga'); ?>', 'auto');
  ga('send', 'pageview');
 
  <?php } ?>
</script>
<?php } ?>
```

##### IN DETAIL

In the code we:

1. test whether the `data_ga` text setting is not empty (you could also do more validation on the format)
2. assign the `$ga_method` variable to the `data_ga` setting Universal analytics have a `UA-XXXX-Y` tracking code, while classic analytics have one more `X` in the middle. So we split the `data_ga` string in 3 parts and test if the middle part is 4 characters long. If yes, the code is universal analytics, else it is classic.
3. output the correct tracking codes from the [Google Analytics devguide page](https://developers.google.com/analytics/devguides/collection/web/) in an `if else` clause.
4. For <em>classic</em> analytics, set `_gaq.push(['_setAccount', '<?php get_setting('theme','data_ga'); ?<']);`, and for <em>universal analytics</em>, set `ga('create', '<?php get_setting('theme', 'data_ga'); ?>', 'auto');`

### Social media links

The following setup allows the user to:

* Set between 1 and 5 social media links using FontAwesome for brand icons.
* Choose between 20+ social networks to display (if they're just text links, you could do even more).
* Choose the ordering in which his/her social networks are displayed.

##### SETTINGS

<table style="border-collapse: collapse;">
 <thead>
  <tr>
    <th>Label</th>
    <th>Lookup</th>
    <th>Type</th>
  </tr>
 </thead>
 <tbody>
  <tr>
    <td>Social profile 1</td>
    <td><code>social_1</code></td>
    <td><code>select</code></td>
  </tr>
  <tr>
    <td>Social profile 1 URL</td>
    <td><code>social_2_url</code></td>
    <td><code>text</code></td>
  </tr>
  <tr>
    <td>Social profile 2</td>
    <td><code>social_2</code></td>
    <td><code>select</code></td>
  </tr>
  <tr>
    <td>Social profile 2 URL</td>
    <td><code>social_2_url</code></td>
    <td><code>text</code></td>
  </tr>
  <tr>
    <td>Social profile 3</td>
    <td><code>social_3</code></td>
    <td><code>select</code></td>
  </tr>
  <tr>
    <td>Social profile 3 URL</td>
    <td><code>social_3_url</code></td>
    <td><code>text</code></td>
  </tr>
  <tr>
    <td>Social profile 4</td>
    <td><code>social_4</code></td>
    <td><code>select</code></td>
  </tr>
  <tr>
    <td>Social profile 4 URL</td>
    <td><code>social_4_url</code></td>
    <td><code>text</code></td>
  </tr>
  <tr>
    <td>Social profile 5</td>
    <td><code>social_5</code></td>
    <td><code>select</code></td>
  </tr>
  <tr>
    <td>Social profile 5 URL</td>
    <td><code>social_5_url</code></td>
    <td><code>text</code></td>
  </tr>
 </tbody>
</table>

##### DISCUSSION

If your theme includes fixed social media providers (Facebook, Twitter, Google+ for example), you could simply use `text` settings for each one. But if you want to give the webmaster the <em>possiblility to choose the display order</em> of the social media, and give him/her more social media options, read on =). In this approach, there are 2 settings per social button: `social_x` defines which social network to choose for profile x, `social_x_url` holds the link. Basically every `social_x` `select` setting has +- 20 of the <a href="http://fortawesome.github.io/Font-Awesome/icons/#brand">FontAwesome brand icons</a> as options, and an extra option 'None'.
You might want to read up on PHP <a href="http://php.net/manual/en/control-structures.for.php">for loops</a> and <a href="http://php.net/manual/en/control-structures.if.php">conditional if</a> if you're not familiar.

```php
<?php $social_opts = return_setting('theme', 'social_1', 'options'); ?>
<nav id="profile-social">
  <?php for ($si = 1; $si < 6; $si++) {  
  if (return_setting('theme', 'social_' . $si) && return_setting('theme', 'social_' . $si . '_url')) { ?>
  <a href="<?php get_setting('theme', 'social_' . $si . '_url'); ?>">
    <i class="fa fa-fw fa-<?php echo strtolower($social_opts[return_setting('theme', 'social_' . $si)]); ?>"></i>
  </a>
  <?php } ?>
</nav>
```

##### IN DETAIL

In the code, we:

<ol>
<li>assign the <code>options</code> from the first select setting to the PHP variable <code>$social_opts</code>. They are all the same for the 5 settings so it doesn't matter which one.</li>
<li>create a <code>for</code> loop starting from <strong>1</strong> because the first link is <code>social_1</code> and not <code>social_0</code>, and ending at <strong>6</strong> because there can be max. 5 social links in our theme and <strong>6-1 = 5</strong>.</li>
<li>
Inside the <code>for</code> loop, we check with <code>if</code> with: 
<ol>
<li><code>return_setting('theme', 'social_' . $si)</code> if the value of the <code>select</code> is not 0 (='None')</li>
<li><code>return_setting('theme', 'social_' . $si . '_url')</code> if the value of the <code>text</code> (link) is not empty.</li>
</ol>
</li>
<li>output the link in the <code>href</code> attribute, and the name of the social network as <code>fa-&lt;name&gt;</code> (for fontAwesome) <code>&lt;?php echo strtolower($social_opts[return_setting('theme', 'social_' . $si)]); ?&gt;</code> <br><code>strtolower</code> simply converts eg 'Facebook' to 'facebook', and <code>$social_opts</code> is a numeric array, while <code>return_setting('theme', 'social_' . $si)</code> is an index, so doing the above is the same as <code>$social_opts[x]</code> which holds the name of a social network. </li>
</ol>

<a name="key-value-pairs"></a>

#### Meta: date format - hidden settings for key-value pairs

The following code allows the user to:

* choose a date format from the UI in human-readable form, and output it in PHP form.

##### SETTINGS

<table style="border-collapse: collapse;">
 <thead>
  <tr>
    <th>Label</th>
    <th>Lookup</th>
    <th>Type</th>
    <th>Access</th>
  </tr>
 </thead>
 <tbody>
  <tr>
    <td>Blogpost date format</td>
    <td><code>blog_date</code></td>
    <td><code>select</code></td>
    <td>Normal</td>
  </tr>
  <tr>
    <td>Blogpost date values</td>
    <td><code>blog_date_fm</code></td>
    <td><code>select</code></td>
    <td>Hidden</td>
  </tr>
 </tbody>
</table>

##### DISCUSSION

PHP date formats are somewhat hard to understand for non-technical people. They probably don't understand `F jS Y` as a date. Sometimes you want the <em>options displayed in the UI to return a different output associated with that option</em>. For text settings/ settings with limited options it's easy enough to do, but for 15+ options you might need <strong>key - value</strong> pairs. You could do this in a PHP array but you would be polluting your template. There's a 'hack' around it in GS Custom Settings: create two `select` settings, - one for the display and one for the return data (hidden access) -, with <em>the same options in the same order</em>. <strong>Note:</strong>: With `v0.4+` you can also simply define a custom `data` property on one select instead; however you have to modify the JSON & can't use the UI.

```php
<?php $date_fm_opts = return_setting('theme', 'blog_date_fm', 'options');
      $date_ui = return_setting('theme','blog_date');
 // JFYI $item->creDate is set from a call in return_i18n_search_results
 echo date($date_fm_opts[$date_ui], $item->creDate); ?>
```

##### IN DETAIL

In the code we:

1. return the options (an array) from the hidden `blog_date_fm` setting and assign it to `$date_fm_opts`.
2. return the value (an index) from the `blog_date` setting and assign it to `$date-ui`
3. Because `blog_date` and `blog_date_fm` have the same options in the same order, we can get the value from `blog_date` and retrieve the correct return value from `blog_date_fm` by doing `$date_fm_opts[$date_ui]`.