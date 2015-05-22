---
title: Building a theme with GS Custom Settings - advanced
category: CMS
img: http://i.imgur.com/HzihL7G.png
tags: GetSimple PHP plugin theme
layout: blog-post
published: true
description: Example use cases for the GetSimple KO Site settings plugin
intro: |
  This article demonstrates the functionality of GS Custom Settings by converting the standard Innovation Theme from Getsimple to an an i18N-enabled custom settings version.
---

In this tutorial, we'll be building a theme which will demonstrate all the features in GS Custom Settings, combined with the power of the [I18n plugin](), and 3 different templates: page, blog, and contact. The theme essentially mimics [Todd Motto's Github blog](http://www.toddmotto.com). If you're impatient, or rather learn by looking at the code, you can [download this theme]() at the bottom of the article.
###Table of contents

1. [Considering the variables in the theme](#)
2. [Building the site header](#)

Anyhow, the theme folder will look like this:
<pre>
GSCS-sample-theme/
  ├─ template.php
  ├─ blog.php
  ├─ contact.php
  ├─ functions.php
  ├─ inc/  
  |    ├─ footer.inc.php
  |    ├─ header.inc.php
  |    └─ dynamic_css.inc.php
  ├─ assets/
  |    ├─ favicon.png
  |    ├─ style.css
  |    └─ lib/
  |        ├─ html5shiv.js
  |        ├─ uikit.css
  |        └─ fontawesome.css
  ├─ settings.json
  └─ lang/
     ├─ fr_FR.json
     └─ de_DE.json
</pre>
This tutorial will focus on how to integrate GS Custom Settings in theme development, if you need to get familiar with regular GetSimple theming, read [the tutorial]() in the wiki. It's also handy to keep a browser tab open on the [complete template tags reference](). 
### Step 1: Considering the *variables* in the theme
First we need to consider which settings will be adjustable in the template. For inspiration, you could have a look at [Tumblr theme options](http://scaffold.tumblr.com/options/), ThemeForest Wordpress' [Select options](http://i.imgur.com/1kEkKAu.png), or even [Blogger template options](http://2.bp.blogspot.com/-5o8ExgEBbVk/TzYiXNXleDI/AAAAAAAAFig/38Mcn18TVog/s1600/Change%2Bpost%2Btitle%2Bcolor%2Bin%2BBlogger%2Btemplates.png). Generally, you will want to provide settings in three four different sections: 

1. **Styling**: Providing users the ability to modify theme colors, fonts and other styles without having to dig into your template, and with the option to change them over time.
2. **Output**: Providing users the ability to place content in fixed theme positions   (like footer content, contact details, etc.) without having to dig into your template.
3. **Data**: Providing users the ability to include/ turn off certain parts of the template, like a social media widget, or whether or not to show the author name under blog posts.
4. **Meta-settings**: Primarily meant for you, the developer, and usually set to `locked`/`hidden` in the interface, to facilitate version checking, include credits and links, and fixed information.

In our case we will provide the following settings:
<table style="border-collapse: collapse;">
<tbody>
  <tr>
    <td>Setting label</td>
    <td>Setting lookup</td>
    <td>Setting type</td>
    <td>Setting options/ defaults/ details</td>
  </tr>
  <tr><td colspan="4"><strong>Styling</strong></td></tr>
  <tr>
    <td>Headings font</td>
    <td>css_hfont</td>
    <td>select</td>
    <td>/</td>
  </tr>
  <tr>
    <td>Headings text color</td>
    <td>css_hcolor</td>
    <td>color</td>
    <td>/</td>
  </tr>
  <tr>
    <td>Body font</td>
    <td>css_pfont</td>
    <td>select</td>
    <td>/</td>
  </tr>
  <tr>
    <td>Body text color</td>
    <td>css_pcolor</td>
    <td>color</td>
    <td>/</td>
  </tr>
  <tr>
    <td>Link text color</td>
    <td>css_acolor</td>
    <td>color</td>
    <td>/</td>
  </tr>
  <tr>
    <td>Theme style</td>
    <td>css_theme</td>
    <td>radio</td>
    <td>Options: <code>square / circle / rounded</code></td>
  </tr>
  <tr><td colspan="3"><strong>Output</strong></td></tr>
  <tr>
    <td>Name</td>
    <td>contact_name</td>
    <td>text</td>
    <td></td>
  </tr>
  <tr>
    <td>E-mail</td>
    <td>contact_email</td>
    <td>text</td>
    <td></td>
  </tr>
  <tr>
    <td>Phone/ Fax</td>
    <td>contact_phone</td>
    <td>textarea</td>
    <td>/</td>
  </tr>
  <tr>
    <td>Address</td>
    <td>contact_addr</td>
    <td>textarea</td>
    <td>/</td>
  </tr>
  <tr>
    <td>Headline</td>
    <td>profile_h</td>
    <td>text</td>
    <td>Default: Hi, I'm &lt;a href="http://twitter.com/tyblitz">@Tyblitz&lt;/a>!</td>
  </tr>
  <tr>
    <td>Lead paragraph</td>
    <td>profile_desc</td>
    <td>textarea</td>
    <td>Default: Developer behind GS Custom Settings & tons of useless code. 23, based in Belgium, communications agent and all-things-web enthusiast.</td>
  </tr>
  <tr>
    <td>Profile image</td>
    <td>profile_img</td>
    <td>image</td>
    <td>Default: https://s3.amazonaws.com/uifaces/<br>faces/twitter/mantia/128.jpg</td>
  </tr>
  <tr><td colspan="4"><strong>Data</strong></td></tr>
  <tr>
    <td>Blog-post meta keyword</td>
    <td><code>blog_keyword</code></td>
    <td>text</td>
    <td>Default: <code>_blog</code></td>
  </tr>
  <tr>
    <td>Blog-post date format</td>
    <td><code>blog_date</code></td>
    <td>select</td>
    <td>/</td>
  </tr>
  <tr>
    <td>Blog-post excerpt length</td>
    <td><code>blog_ex_len</code></td>
    <td>text</td>
    <td>0 = no post-excerpt, 'full' = full post in blog-roll</td>
  </tr>
  <tr>
    <td>Link on blog-post title?</td>
    <td><code>blog_show_link</code></td>
    <td>checkbox</td>
    <td>/</td>
  </tr>
  <tr>
    <td>Show blogpost tags?</td>
    <td><code>blog_show_tags</code></td>
    <td>checkbox</td>
    <td>/</td>
  </tr>
  <tr>
    <td>Show featured image?</td>
    <td><code>blog_show_img</code></td>
    <td>checkbox</td>
    <td>/</td>
  </tr>
  <tr>
    <td># of blog-posts/page</td>
    <td><code>blog_list_len</code></td>
    <td>text</td>
    <td>Default: 10</td>
  </tr>
  <tr>
    <td>Blog is homepage?</td>
    <td><code>blog_home</code></td>
    <td>checkbox</td>
    <td>/</td>
  </tr>
  <tr>
    <td>Disqus username</td>
    <td><code>data_disqus</code></td>
    <td>text</td>
    <td>Leave empty to disable</td>
  </tr>
  <tr>
    <td>Google Analytics</td>
    <td><code>data_ga</code></td>
    <td>text</td>
    <td>Leave empty to disable</td>
  </tr>
  <tr>
    <td>Social Profile 1</td>
    <td><code>social_1</code></td>
    <td>text</td>
    <td>Leave empty to disable</td>
  </tr>
  <tr>
    <td>Social Profile 2</td>
    <td><code>social_2</code></td>
    <td>text</td>
    <td>Leave empty to disable</td>
  </tr>
  <tr>
    <td>Social Profile 3</td>
    <td><code>social_3</code></td>
    <td>text</td>
    <td>Leave empty to disable</td>
  </tr>
  <tr><td colspan="4"><strong>Meta-settings</strong></td></tr>
  <tr>
    <td>Theme Version</td>
    <td><code>meta_version</code></td>
    <td>text</td>
    <td>Access: locked</td>
  </tr>
  <tr>
    <td>Theme Link</td>
    <td><code>meta_url</code></td>
    <td>text</td>
    <td>Access: locked</td>
  </tr>
  <tr>
    <td>Author</td>
    <td><code>author</code></td>
    <td>text</td>
    <td>Access: locked</td>
  </tr>
  <tr>
    <td>Author URL</td>
    <td><code>author_url</code></td>
    <td>text</td>
    <td>Access: locked</td>
  </tr>
</tbody>
</table>

### Step 1: Building the site header (header.inc.php)
As with all GetSimple theme files, first include the following statement to prevent direct file access:
<pre>&lt;?php if(!defined('IN_GS')){ die('you cannot load this page directly.'); } ?&gt;</pre>
The `<head>` tag is pretty straightforward too, nothing different from regular GS theming:
<pre>
  &lt;title&gt;&lt;?php get_page_clean_title(); ?&gt; - &lt;?php get_site_name(); ?&gt;&lt;/title&gt;
  &lt;meta charset=&quot;utf-8&quot;&gt;
  &lt;meta name=&quot;description&quot; content=&quot;&lt;?php get_page_meta_desc(); ?&gt;&quot;&gt;
  &lt;meta name=&quot;viewport&quot; content=&quot;width=device-width,initial-scale=1,maximum-scale=1&quot;&gt;
  &lt;link rel=&quot;stylesheet&quot; type=&quot;text/css&quot; href=&quot;&lt;?php get_theme_url(); ?&gt;/res/font-awesome.min.css&quot;&gt;
  &lt;link rel=&quot;stylesheet&quot; type=&quot;text/css&quot; href=&quot;&lt;?php get_theme_url(); ?&gt;/res/style.css&quot;&gt;
  &lt;link rel=&quot;stylesheet&quot; type=&quot;text/css&quot; href=&quot;&lt;?php get_theme_url(); ?&gt;/res/uikit.css&quot;&gt;
  &lt;link rel=&quot;stylesheet&quot; type=&quot;text/css&quot; href='http://fonts.googleapis.com/css?family=Open+Sans'&gt;
  &lt;script src=&quot;&lt;?php get_theme_url(); ?&gt;/res/html5shiv.min.js&quot;&gt;&lt;/script&gt;</pre>

####Checking settings for *falsey* values
#####Loose checking
We provide an option in the theme to show or hide the blog page's title (when it's the homepage it should be hidden). The setting `blog_show_title` is of type `checkbox` and so returns `true` or `false` and can be simply checked for by doing the following:
<pre>&lt;?php if (return_setting('theme', 'blog_show_title')) { ?>
    &lt;h1> &lt;?php get_setting('theme', 'blog_show_title'); ?> &lt;/h1>
&lt;?php } ?> </pre>
But there are also some settings with the `text`/ `textarea` type that you want to output only if they have an actual value, like the Disqus or Google Analytics Javascript. Instead of making new checkbox settings, you can check if text fields are *non-empty* by using the exact same method as for checkboxes. The `if` clause evaluates to `false` if the field's value contains 0 characters.
<pre>&lt;?php if (return_setting('theme', 'data_disqus')) { ?>
  &lt;div id=&quot;disqus_thread&quot;&gt;&lt;/div&gt;
  &lt;script type=&quot;text/javascript&quot;&gt;
    var disqus_shortname = '&lt;?php get_setting('theme', 'data_disqus'); ?>';
    (function() { var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
     dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js'; (document.getElementsByTagName('head')[0] ||
     document.getElementsByTagName('body')[0]).appendChild(dsq); })();
  &lt;/script&gt;
  &lt;noscript&gt;Please enable JavaScript to view the &lt;a href=&quot;https://disqus.com/?ref_noscript&quot; rel=&quot;nofollow&quot;&gt;comments.&lt;/a&gt;&lt;/noscript&gt;
&lt;?php } ?> </pre> 
With *option* settings like `radio` or `select`, you should be careful with `if` clauses: if the first option is selected (index=0), doing `if (return_setting('theme','options'))` will be `false`. Only use this if the first option *means* `false`, eg: show social buttons options: (0) 'none', (1) 'three', (2) 'five'.

###Building the blog
For the blog, we add a function in the `functions.php` file because it uses `i18n` plugin functions. Because we want to be able to configure the output, we need to use `return_i18n_search_results` (see the [details]()) and not the display function. The `i18n` plugin makes available a global variable `$language` on the page which holds the language for the current page.
<pre>function gscs_get_blog($start, $end=1) { 
  global $language;
  $srch = return_i18n_search_results('blogpost', null, $start, $end, 'date', $language);
  
  $show_categories = return_setting('theme', 'blog_show_cat');
  $show_images = return_setting('theme', 'blog_show_img');
  $show_tags = return_setting('theme', 'blog_show_tags');
  $show_permalink = return_setting('theme', 'blog_show_permalink');
  $excerpt_length = return_setting('theme','blog_excerpt_length');
  $date_format = return_setting('theme','blog_date_format');
  
  foreach($srch['results'] as $item) {
  ?&gt;
  &lt;li class=&quot;uk-article&quot;&gt;
    &lt;h3 class=&quot;uk-article-title&quot;&gt;&lt;?php if (!$show_permalink) get_i18n_link($item-&gt;id); else echo $item-&gt;title; ?&gt;&lt;/h3&gt;
    &lt;div class=&quot;post-meta uk-article-meta&quot;&gt;
      &lt;time datetime=&quot;&lt;?php echo date('F jS, Y' , $item-&gt;pubDate); ?&gt;&quot;&gt;&lt;?php echo date('F jS, Y' , $item-&gt;pubDate); ?&gt;&lt;/time&gt;
    &lt;/div&gt;
    &lt;?php if ($show_images) { ?&gt;
      &lt;img src=&quot;http://placehold.it/192x128&quot;&gt;
    &lt;?php } 
    if ($excerpt_length)
      echo '&lt;p class=&quot;uk-article-lead&quot;&gt;' . substr(strip_tags($item-&gt;content), 0, 50) . '&lt;/p&gt;';
    if ($show_tags) { ?&gt;
    &lt;ul class=&quot;tags&quot;&gt;
      &lt;?php foreach ($item-&gt;tags as $tag)
        echo '&lt;li&gt;&lt;a href=&quot;#&quot; class=&quot;uk-badge&quot;&gt;' . $tag . '&lt;/a&gt;&lt;/li&gt;';
      ?&gt;
    &lt;/ul&gt;
    &lt;?php } ?&gt;
  &lt;/li&gt;
  &lt;?php }
}
</pre>

###Further techniques

Sometimes you might want to have key-value pairs, like for the blog's date format. In the UI you want to display date formats as human-readable, like so: *20/02/2015*, or *April 20, 2015*. But PHP only understands formats as listed [in the docs](http://php.net/manual/en/function.date.php). Given the setting `blog_date_format`, the 2 previou In that case you have 2 options: 

1. You map the options to other 

####Contents

0. [Preface](#preface)
  1. [Best practices](#best-practices)
  2. [Some PHP you should know](#php-you-should-know)
  1. [Considering the theme variables](#considering-theme-variables)
1. [Basic](#basic)
  2. [Output: text and HTML content](#outputting-text-and-html-content)
  3. [Output: Show-/hiding content](#show-hiding-content)
  4. [Styling: Allowing custom CSS](#allowing-custom-css)
  5. [Styling: Tweakable fonts and colors](#tweak-fonts-and-colors)
  5. [Styling: Multiple options](#tweak-fonts-and-colors)
  5. [Meta: Setting theme & author data](#theme-and-author-data)
2. [Intermediate](#intermediate)
  1. [Data: Enabling third party services](#third-party-services)
  2. [Styling: Google web fonts](#google-web-fonts)
  1. [Output: third party embeds](#third-party-embeds)
  2. [Output: social media icon links collection](#social-media-links)
  3. [Meta: date format - hidden settings for key-value pairs](#key-value-pairs)
3. [Advanced](#advanced)
  1. [Building a mail form](#build-a-mail-form)
  3. [Integrating with other GS plugins](#integrate-with-other-plugins)
  4. [Building a configurable blog](#build-a-blog)

###Best practices
######Themes with GS Custom Settings
If you use GS Custom Settings for a theme, make sure to mention in the theme description in the [GS Extend]() repo that your theme *requires* installing the Custom settings plugin first, or wrap the entire HTML in an `if` clause, and output a message *'This theme requires GS Custom Settings to work'*, else you will get a lot of *undefined function* errors. Here's a sample snippet that you can directly copy paste in your theme's Extend description:
<pre>This theme requires [GS Custom Settings](http://get-simple.info/extend/plugin/gs-custom-settings/913/).</pre> and one for in the forum threads:
<pre>This theme requires [url=http://get-simple.info/extend/plugin/gs-custom-settings/913/]GS Custom Settings[/url].</pre>
######Empty text settings
Often you need to check whether a setting is valid. When the only check you need is whether a text setting is empty, you can avoid creating a checkbox to 'enable' the setting (eg. a social media link) by  checking the string length of the setting's value. When it is an empty string, its length is 0, so PHP will evaluate to `false` when you call `return_setting('theme', 'myTextSetting')`. In the setting's description, simply write something like *"Leave empty to disable"*. For example, the `text` setting `social_fb` could be outputted as follows:
<pre>&lt;?php if (return_setting('theme', 'social_fb'))
   echo '&lt;a href="' . return_setting('theme', 'social_fb') . '>&lt;i class="fa fa-facebook'>&lt;/i>&lt;/a>; ?>
</pre>
######Using `for` loops
If you're using setting output in PHP `for` or `foreach` loops, it is wisest to put them in a PHP variable before the loop. Although calls to `return/get_setting` are not very expensive, it does save some performance.
<pre>&lt;?php $show_img = return_setting('theme', 'blog_show_img'); 
 foreach ($items as $item) {
 echo '&lt;div class="post">' . ($show_img ? '&lt;img src="">' : '') . '&lt;/div>'; ?>
</pre>
######Easily accessing a group of settings
If you need to access many settings (more than 5) in one particular place in your theme, *from v0.4 onwards* you can use `return_setting_group` to return an entire group of settings as a PHP array. For the function to work, you should prefix the setting lookups with a common name, followed by an underscore (`_`); eg. for all profile-related settings, you could have: `profile_h` for the headline, `profile_desc` for the description and `profile_name` for the name. You can then access the returned settings *without the prefix*. In PHP you could simply do: 
<pre>&lt;?php $profile = return_setting_group('theme', 'profile'); 
 echo '&lt;h1>' . $profile['name'] . '&lt;h1>';
 echo '&lt;h3>' . $profile['h'] . '&lt;/h3>';
 echo '&lt;p>' . $profile['desc'] . '&lt;/p>'; ?>
</pre>
###Some PHP you should know
As soon as you need to do some more advanced stuff (like in the sections Intermediate and Advanced), you will sometimes need to pre-process the output of a setting. In that case, some of the most useful PHP functions to know are:

* `echo($string)` - Outputs the given string.
* `strip_tags($string)` - Removes HTML tags from the string.Handy for example if you want to use HTML in the profile description on the page, and use the same setting for social media/ meta descriptions but without HTML.
* `explode($delimiter, $string)` - Splits a string into an array on `$delimiter`. Useful if you want to re-use and pre-process settings with options or fixed formats.
* `str_replace($search, $replacement, $string)`
* `strlen($string)` - Returns the length of a string. Useful for checking purposes.
* `date($format[, $timestamp])` - Returns a date in the specified `$format`. Useful for blog posts/ footer copyright/ event dates.
* `substr($string, $start, $length)` - Subtracts a part of a string starting at `$start` and ending at `$start + $length`. Useful for eg. post excerpts

<a name="outputting-text-and-html-content"></a>
###Outputting text and HTML content

###### SETTINGS
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
######DISCUSSION
Outputting content is the most basic functionality of GS Custom Settings. In the example below we output the values of the settings `email`, `phone` and `address` to the `contact.php` template. The settings are preceded by a FontAwesome icon. Note that if you want `textarea` settings to preserve multiple lines, you will have to set the CSS `white-space` property to `pre/ pre-wrap/ pre-line`.
<pre>&lt;address&gt;
  &lt;div&gt;&lt;p style=&quot;white-space: pre;&quot;&gt;
    &lt;i class=&quot;fa fa-fw fa-lg fa-map-marker&quot;&gt;&lt;/i&gt;&lt;?php get_setting('theme', 'contact_address'); ?&gt;
  &lt;/p&gt;&lt;/div&gt;
  &lt;div&gt;&lt;p&gt;
    &lt;i class=&quot;fa fa-fw fa-lg fa-at&quot;&gt;&lt;/i&gt;&lt;?php get_setting('theme', 'contact_email'); ?&gt;
  &lt;/p&gt;&lt;/div&gt;
  &lt;div&gt;&lt;p style=&quot;white-space: pre;&quot;&gt;
    &lt;i class=&quot;fa fa-fw fa-lg fa-phone&quot;&gt;&lt;/i&gt;&lt;?php get_setting('theme', 'contact_phone'); ?&gt;
  &lt;/p&gt;&lt;/div&gt;
&lt;/address&gt;</pre>Another popular example is outputting a copyright notice in the theme footer:
<pre>&lt;footer id="site-footer">&amp;copy;
  &lt;?php echo date('Y');?> &lt;?php get_setting('theme', 'contact_name'); ?>
&lt;/footer></pre>
You may also want to let the user decide which HTML content should be outputted, for example to **highlight** a part of the phrase, or to customize, eg sidebar widget content. The `textarea` or `text` settings may contain HTML. As such, if you had a  `textarea` setting `sidebar_html`, you could do the following:
<pre>&lt;aside>&lt;?php get_setting('theme', 'sidebar_html'); ?>&lt;/aside></pre>

###Show-/hiding content
###### SETTINGS
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
######DISCUSSION
Conditionally showing content is pretty easy, the checkbox setting will either return `true` or `false`. The snippet below shows/hides the title of pages using the template `blog.php`. Useful as you would usually not display the title when the blog is also the homepage. 
<pre>if (return_setting('theme', 'blog_show_title')) { ?&gt;
  &lt;h1&gt;&lt;?php get_page_title(); ?&gt;&lt;/h1&gt;
&lt;?php } ?&gt;</pre>You may also want to hide output when a `textarea/text/image` setting is *not set* (when the value is an empty string). 
If the setting has no container element, you can simply call `get_setting` and an empty string will be outputted (*note: with v0.3 the image setting will return an image with a broken link if you do this*).
<pre>&lt;?php get_setting('theme', 'profile_desc'); ?>
&lt;?php get_setting('theme', 'profile_img'); ?></pre>
If the setting output does have a container element, you need to check whether it is non-empty with `return_setting`:
<pre>&lt;?php if (return_setting('theme', 'profile_img')) { ?>
  &lt;div id="profile-img">&lt;?php get_setting('theme', 'profile_img'); ?>&lt;div>
&lt;?php } ?></pre>
###Styling: allowing custom CSS
###### SETTINGS
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
######DISCUSSION
Custom CSS is the easiest way to provide users a way to change the visual style without touching the template, but of course it requires them to go look for classes and id's in the browser, and at least have a basic understanding of CSS, so not very user-friendly. You should output this setting *at the end of your dynamic CSS*, so that if the user makes a syntax error nothing else gets lost. 
<pre>&lt;style>
 /* other style rules */
 &lt;?php get_setting('theme', 'custom_css'); ?>
&lt;/style>
</pre>
###Styling: Tweakable fonts and colors
######SETTINGS

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

######DISCUSSION
The colors take any valid CSS colors (color name, HEX, RGB, HSL or RGBA). You would keep all fixed CSS in a separate stylesheet `style.css`, and include the changeable CSS in your `header.inc.php` or `dynamic_css.inc.php` or something alike in a `<style>` tag. Below is an example of how you would output dynamic styling options into your theme: 
<pre>&lt;style&gt;
  h1,h2,h3,h4,h5,h6, #site-nav a {
    color: &lt;?php get_setting('theme', 'css_hcolor'); ?&gt;; 
    font-family: &lt;?php get_setting('theme', 'css_hfont'); ?&gt;; 
  }
  body, body p, body ul, body ol, body blockquote { 
    color: &lt;?php get_setting('theme', 'css_pcolor'); ?&gt;; 
    font-family: &lt;?php get_setting('theme', 'css_pfont'); ?&gt;; 
  }
  #profile-social a, #blog-roll .tags li a, .tags li div {
    background-color:  &lt;?php get_setting('theme', 'css_pri_color'); ?&gt;;
  }
  #profile-social a:hover, #profile-social a:active { 
    background-color:  &lt;?php get_setting('theme', 'css_sec_color'); ?&gt;; 
  }
  a, a:link, a:visited, #site-nav a, #site-nav a:visited, #blog-roll h3 a  { 
    color: &lt;?php get_setting('theme', 'css_pri_color'); ?&gt;;  
  }
  a:active, a:hover, #site-nav a:hover, #site-nav a:active, 
  #blog-roll h3 a:hover, #blog-roll h3 a:active { 
    color: &lt;?php get_setting('theme', 'css_sec_color'); ?&gt;; 
  }
  &lt;?php get_setting('theme', 'custom_css'); ?&gt;
&lt;/style&gt;</pre>

###Styling: multiple options
###### SETTINGS
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
######DISCUSSION
You can provide customization through fixed options, with the `radio` or `select` type.
The `radio` setting `css_theme` has 3 options: square, rounded or circle. In our `style.css` stylesheet, the following rules could be defined (none for square, that is default): 
<pre>.circle #profile-image img, .circle #profile-social a { 
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
</pre>
In the theme we set a variable class on the `<body>` tag:
<pre>&lt;body class="&lt;?php get&#95;setting('theme', 'css_theme');?>"></pre>

Similarly, if you had a setting `profile_img_size` with 3 options: small, normal, big; you could set the size of the profile image only:
<pre>&lt;style>
  #profile-image.big img { height: 160px;}
  #profile-image.normal img, #profile-image img { height: 128px;}
  #profile-image.small img { height: 96px; }
&lt;/style>
&lt;div class="&lt;?php get&#95;setting('theme', 'profile_img_size');?>">&lt;img src="/my/image.jpeg">&lt;/div>
</pre>
###Styling options
For our theme we have a total of 8 styling options. The font `<select>`'s offer a choice between +- 20 different fonts, including a couple from Google fonts. **Custom CSS** allows non-technical users to add some CSS rules to the theme (this is a popular setting in Wordpress).

#####Fonts and webfonts
If you limit your font options to te [websafe fonts](), adding 2 extra `font-family` lines to the dynamic CSS like below will suffice. Generally this should also be fine if you included custom fonts in your CSS with `@font-face`
<img src="../assets/posts/gscs_advanced_theming/themetut_font_options.png">
<pre>
h1,h2,h3,h4,h5,h6, #site-nav a {
  color: &lt;?php get_setting('theme', 'css_hcolor'); ?&gt;; 
  font-family: &lt;?php get_setting('theme', 'css_hfont'); ?&gt;; 
}
body, body p, body ul, body ol, body blockquote { 
  color: &lt;?php get_setting('theme', 'css_pcolor'); ?&gt;; 
  font-family: &lt;?php get_setting('theme', 'css_pfont'); ?&gt;; 
}
</pre>
###Meta: Setting theme & author data
######SETTINGS
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
######DISCUSSION
Theme and author info typically are not customizable and with GS Custom Settings you can (if you wish) easily keep track of them by creating some settings. If you wish to display them for users, set the settings' access to *Locked*. If you rather hide them, set them to *Hidden*. The `extend_id` setting **might become important in the future for automatic theme update notifications in the UI**. 

You might also want to output some of these settings, for example in the site footer:
<pre>&lt;footer id="site-footer">&amp;copy;
  &lt;?php echo date('Y');?> &lt;?php get_setting('theme', 'contact_name'); ?>
  Theme &lt;a href="&lt;?php get_setting('theme','url'); ?>">My theme&lt;/a> 
  v.&lt;?php get_setting('theme','version'); ?>by 
  &lt;a href=&quot;&lt;?php get_setting('theme', 'author_url');?&gt;&quot;&gt;&lt;?php get_setting('theme', 'author'); ?&gt;&lt;/a&gt;
&lt;/footer></pre>
###Styling: Enabling Google Webfonts
######SETTINGS

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
######DISCUSSION
But you could also give your users some more options by providing *Google Webfonts*, and we need to add a couple of extra lines of code to the `head.inc.php` file (above the `<style>` tag) to include them **only if** the user has selected one because they impact loading times negatively. For this purpose, we need to slightly **preprocess** them with PHP. Google expects an API call like this:
<pre>
&lt;link rel=&quot;stylesheet&quot; type=&quot;text/css&quot; href=&quot;http://fonts.googleapis.com/css?family=font+name">
</pre>
We only want the first font in the option, and we need to replace space characters with `+`, It is good to know the following 2 PHP functions:

* [`explode($delimiter, $string)`](http://php.net/manual/en/function.explode.php)
* [`str_replace($search, $replacement, $string)`](http://php.net/manual/en/function.str-replace.php)

In the code below, we *(1)* create 2 PHP vars `$t_hfont` (headings font) and `$t_pfont` (paragraph font), *(2)* get the setting with a call to `get_setting` and the third parameter as `FALSE` to output the *display value* of a setting (if you did `return_setting` you would get a number, because the raw value of option settings is the index of the selected option).. *(3)* With `explode` we split the string into an array, then in that string *(4)* we replace space characters with a **+** via `str_replace`. 

Finally, because the first 13 options are *not* Google fonts,  we check with `return_setting` if the *raw* value of the font settings is higher than 13, and only include it then.

<pre>
&lt;?php 
$t_hfont = get_setting('theme', 'css_hfont', false);
$t_hfont = explode(', ', $t_hfont);
$t_hfont = str_replace(' ', '+', $t_hfont[0]);
$t_pfont = get_setting('theme', 'css_pfont', false);
$t_pfont = explode(', ', $t_pfont);
$t_pfont = str_replace(' ', '+', $t_pfont[0]);

if (return_setting('theme', 'css_hfont') &gt; 13) { ?&gt;
&lt;link rel=&quot;stylesheet&quot; type=&quot;text/css&quot; 
      href=&quot;http://fonts.googleapis.com/css?family=&lt;?php echo $t_hfont;?&gt;&quot;&gt;
&lt;?php } if (return_setting('theme', 'css_pfont') &gt; 13) { ?&gt;
&lt;link rel=&quot;stylesheet&quot; type=&quot;text/css&quot; 
      href=&quot;http://fonts.googleapis.com/css?family=&lt;?php echo $t_pfont;?&gt;&quot;&gt;
&lt;?php } ?&gt;</pre>
###Third party embeds (maps, social feeds,..)
This setup will enable the user to:

* embed a Twitter profile feed from the UI
* embed a static Google Map with basic options from the UI

social feeds, Google Drive documents.)

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
######DISCUSSION
Embedding a Twitter feed is as simple as copy pasting the code from the [dev guide]() and replacing the feed name. Also don't forget to put a surrounding `if` clause to test if the settings are not empty to avoid JS errors. To be able to use the feed, the user needs to create a 'widget' in his Twitter account for a certain profile, and copy paste the widget's ID and the feed's name into GS Custom Settings.
<pre>&lt;?php if (return_setting('theme', 'twttr_fd') && return_setting('theme', 'twttr_id')) { ?>
&lt;a class=&quot;twitter-timeline&quot; 
   href=&quot;https://twitter.com/&lt;?php get_setting('theme', 'data_twttr_fd'); ?>&quot;
   data-widget-id=&quot;&lt;?php get_setting('theme', 'data_twttr_id'); ?>&quot;&gt;
Tweets by @&lt;?php get_setting('theme', 'data_twttr_fd'); ?>&lt;/a&gt;
&lt;script&gt;
  !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';
  if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+&quot;://platform.twitter.com/widgets.js&quot;;
  fjs.parentNode.insertBefore(js,fjs);}}(document,&quot;script&quot;,&quot;twitter-wjs&quot;);
&lt;/script&gt;&lt;?php } ?></pre>
For the Google Map we will re-use the `contact_address` setting from our theme. Suppose the site owner is Google UK. Their address is entered as:
<pre>Google UK, 
Belgrave House, 
76 Buckingham Palace Road, 
London
</pre>
To understand this part, read up on the [Google Maps Static API](https://developers.google.com/maps/documentation/staticmaps/). The output is served as image data, so we need an image tag, and a safe URL which we obtain through PHP's `url_encode`. The Static Maps API takes a couple of parameters for customization; here I will only include 3: the location, zoom level, and image size. Zoom levels are between 0 and 21, and image size is in the format `wxh`, as in `100x100` (these details can be explained in the setting description).
<pre>&lt;?php $gmap = return_setting_group('theme', 'gmap');
if ($gmap['on']) {
   $gmap_url = 'size=' . $gmap['size'] . '&zoom=' . $gmap['zoom'] . '&markers=color:red%7C';
   $gmap_url .= urlencode(return_setting('theme', 'contact_address')); ?>
&lt;img src="https://maps.googleapis.com/maps/api/staticmap? &lt;?php echo $gmap_url; ?>">
&lt;?php } ?></pre>
###Third party services (analytics, comments,..)
The following code allows the user to:

* Set Google Analytics (both classic and universal account types) from the UI with the GA ID.
* Set the Disqus comment system on blog pages.
###### SETTINGS
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
  <tr>
    <td>Disqus username</td>
    <td><code>data_disqus</code></td>
    <td><code>text</code></td>
  </tr>
 </tbody>
</table>
######DISCUSSION
Many third-party services (like mail forms, analytics trackers, comment systems) can be embedded via a Javascript API on the page. For this example, we will add [Google Analytics](http://analytics.google.com) and the popular [Disqus comment system]() to blog pages only. First copy paste the tracker codes: Google Analytics [has 2](https://developers.google.com/analytics/devguides/collection/web/). Instead of having another checkbox for the user to set, we can check it in the code because the tracking codes for universal and classic analytics are different.

<pre>&lt;?php if (return_setting('theme', 'data_ga')) { ?>
&lt;script type=&quot;text/javascript&quot;&gt;
  &lt;?php $ga_method = explode('-', return_setting('theme', 'data_ga')); 
  $ga_method = strlen($ga_method[1]) === 4 ? 'uni' : 'classic';
  if ($ga_method === 'classic') { ?&gt;

  var _gaq = _gaq || []; 
  _gaq.push(['_setAccount', '&lt;?php get_setting('theme','data_ga'); ?&gt;']); 
  _gaq.push(['_trackPageview']);
  (function() { var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s); })();

  &lt;?php } elseif ($ga_method === 'uni') { ?&gt;

  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
  ga('create', '&lt;?php get_setting('theme', 'data_ga'); ?&gt;', 'auto');
  ga('send', 'pageview');
 
  &lt;?php } ?&gt;
&lt;/script&gt;
&lt;?php } ?&gt;</pre>
######IN DETAIL
In the code we:

1. test whether the `data_ga` text setting is not empty (you could also do more validation on the format)
2. assign the `$ga_method` variable to the `data_ga` setting Universal analytics have a `UA-XXXX-Y` tracking code, while classic analytics have one more `X` in the middle. So we split the `data_ga` string in 3 parts and test if the middle part is 4 characters long. If yes, the code is universal analytics, else it is classic.
3. output the correct tracking codes from the [Google Analytics devguide page](https://developers.google.com/analytics/devguides/collection/web/) in an `if else` clause. 
4. For *classic* analytics, set `_gaq.push(['_setAccount', '<?php get_setting('theme','data_ga'); ?>']); `, and for *universal analytics*, set `ga('create', '<?php get_setting('theme', 'data_ga'); ?>', 'auto');`

###Social media links
The following setup allows the user to:

* Set between 1 and 5 social media links using FontAwesome for brand icons.
* Choose between 20+ social networks to display (if they're just text links, you could do even more).
* Choose the ordering in which his/her social networks are displayed.

###### SETTINGS
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
######DISCUSSION
If your theme includes fixed social media providers (Facebook, Twitter, Google+ for example), you could simply use `text` settings for each one. But if you want to give the webmaster the *possiblility to choose the display order* of the social media, and give him/her more social media options, read on =). In this approach, there are 2 settings per social button: `social_x` defines which social network to choose for profile x, `social_x_url` holds the link. Basically every `social_x` `select` setting has +- 20 of the [FontAwesome brand icons](http://fortawesome.github.io/Font-Awesome/icons/#brand) as options, and an extra option 'None'.
You might want to read up on PHP [for loops](http://php.net/manual/en/control-structures.for.php) and [conditional if](http://php.net/manual/en/control-structures.if.php) if you're not familiar.

<pre>&lt;?php $social_opts = return_setting('theme', 'social_1', 'options'); 
?&gt;
&lt;nav id=&quot;profile-social&quot;&gt;
  &lt;?php for ($si = 1; $si &lt; 6; $si++) {  
  if (return_setting('theme', 'social_' . $si) && return_setting('theme', 'social_' . $si . '_url')) { ?&gt;
  &lt;a href=&quot;&lt;?php get_setting('theme', 'social_' . $si . '_url'); ?&gt;&quot;&gt;
    &lt;i class=&quot;fa fa-fw fa-&lt;?php echo strtolower($social_opts[return_setting('theme', 'social_' . $si)]); ?&gt;&quot;&gt;&lt;/i&gt;
  &lt;/a&gt;
  &lt;?php } } ?&gt;
&lt;/nav&gt;</pre>
###### IN DETAIL
In the code, we:

1. assign the `options` from the first select setting to the PHP variable `$social_opts`. They are all the same for the 5 settings so it doesn't matter which one.
2. create a `for` loop starting from **1** because the first link is `social_1` and not `social_0`, and ending at **6** because there can be max. 5 social links in our theme and **6-1 = 5**.
3. Inside the `for` loop, we check with `if` with: 
   1. `return_setting('theme', 'social_' . $si)` if the value of the `select` is not 0 (='None')
   2. `return_setting('theme', 'social_' . $si . '_url')` if the value of the `text` (link) is not empty.
4. output the link in the `href` attribute, and the name of the social network as `fa-<name>` (for fontAwesome) <code><?php echo strtolower($social&#95;opts[return&#95;setting('theme', 'social_' . $si)]); ?></code> <br>`strtolower` simply converts eg 'Facebook' to 'facebook', and `$social_opts` is a numeric array, while `return_setting('theme', 'social_' . $si)` is an index, so doing the above is the same as `$social_opts[x]` which holds the name of a social network. 
###Meta: date format - hidden settings for key-value pairs
The following code allows the user to:

* Set Google Analytics (both classic and universal account types) from the UI with the GA ID.
* Set the Disqus comment system on blog pages.
###### SETTINGS
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
######DISCUSSION
PHP date formats are somewhat hard to understand for non-technical people. They probably don't understand `F jS Y` as a date. Sometimes you want the *options displayed in the UI to return a different output associated with that option*. For text settings/ settings with limited options it's easy enough to do, but for 15+ options you might need **key - value** pairs. You could do this in a PHP array but you would be polluting your template. There's a 'hack' around it in GS Custom Settings: create two `select` settings, - one for the display and one for the return data (hidden access) -, with *the same options in the same order*.
<pre>&lt;?php $date_fm_opts = return_setting('theme', 'blog_date_fm', 'options');
      $date_ui = return_setting('theme','blog_date');
 // JFYI $item->creDate is set from a call in return_i18n_search_results
 echo date($date_fm_opts[$date_ui], $item->creDate); ?></pre>
######IN DETAIL
In the code we:

1. return the options (an array) from the hidden `blog_date_fm` setting and assign it to `$date_fm_opts`.
2. return the value (an index) from the `blog_date` setting and assign it to `$date-ui`
3. Because `blog_date` and `blog_date_fm` have the same options in the same order, we can get the value from `blog_date` and retrieve the correct return value from `blog_date_fm` by doing `$date_fm_opts[$date_ui]`.

###Data: Setting a maintenance mode page
The following setup allows the user to:

* Toggle on a custom maintenance page
* Choose which content (HTML) to output in the maintenance page
* 

###### SETTINGS
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
<pre>
&lt;
</pre>
######DISCUSSION
The example here is based on the [GSMaintenance plugin](), but simpler and more flexible.

######Building a popup menu