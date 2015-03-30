---
title: Using KO Site Settings in GetSimple CMS
category: CMS
tags: GetSimple PHP plugin
layout: blog-post
description: Example use cases for the GetSimple KO Site settings plugin
intro: |
  This article shows you how the KO Site Settings plugin can be configured and used in GetSimple CMS. Following its original intent, the article will demonstrate a variety of ways in which you can create components whose output depends (among other plugins) on KO settings.
---
<section>
	<h2>Giving users the ability to tweak their site's CSS</h2>
	<p>Some websites change their CSS or content depending on the season, promotion, event, ... For example, suppose you want to provide different background colors to choose from for spring, summer, autumn, and winter (yellow, lime, brown, white). You can allow the site manager to customize this by adding a <strong>select</strong> or <strong>radio</strong> setting. For this example the setting is put in the tab <code>Site</code>, has a label of <code>Mood</code>, and a type of <code>select</code>, with options <code>yellow, lime, brown, white</code>. In our template we could simply do it like so:</p>
{% highlight php %}{% raw %}
<body style="background: <?php get_setting('site/mood'); ?>;">
  <!-- other code -->
</body>
{% endraw %}{% endhighlight %}
<p>Another example, could be to allow the user to choose the length of a blog post excerpt in a component with a radio setting, with label <code>Number of words in blogpost excerpt?</code>, in tab <code>Blog</code> and options <code>25,50,75,100</code>:</p>
{% highlight php %}{% raw %}
<div class="post">
   <h3>Title</h3>
   <p class="post-excerpt"><?php 
      $content = returnPageContent(return_page_slug());
      substr($content, 0, get_setting('blog/number_of_words_in_blogpost_excerpt')) ?></p>
</div>
{% endraw %}{% endhighlight %}
</section>
<section>
	<h2>Social media links</h2>
	<p>Let's say we want to provide our webmanagers the ability to register their social accounts in the admin backend, and they could be outputted in a component or theme. For this purpose we create a new tab in the KO site settings tab (<code>Site</code>), called <code>Social</code>. We want to provide Twitter, Linkedin, Google+ and Facebook fields, so we create a 4 new settings, each with type 'text', and a different label (the social network's name + ' link'), other settings left as default. Now, the PHP code would look something like this: </p>
{% highlight php %}{% raw %}
<ul>
<?php $social_settings = array('twitter','linkedin','googleplus','facebook');
   for ($i = 0; $i < count($social_settings); $i++) {
      $current = get_setting('social/' . $social_settings[$i] . '_link', FALSE);
      if (strlen($current)) // only add if value is non-empty
         echo '<li><a href="' . $current . '">' . $social_settings[$i] . '</a></li>';
   } 
?>
</ul>
{% endraw %}{% endhighlight %}
</section>
<section>
	<h2>Making use of the access property</h2>
	<p>A setting's access level can be set to <code>Normal</code> (default), <code>Locked</code> or <code>Hidden</code> (refer to the <a href="{{site.url}}/projects/ko-site-settings/#restricting-editing-permission">documentation for more info</a>). If you have a Google Analytics account setup for your client, you might want to set up a setting for the account's ID, or login credentials. For this purpose</p>
{% highlight php %}{% raw %}
<body style="background: <?php get_setting('site/mood' . $social_settings[$i] . '_link'); ?>;">
  <!-- other code -->
</body>
{% endraw %}{% endhighlight %}
</section>