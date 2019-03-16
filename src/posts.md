---
layout: pages/posts.twig
changefreq: weekly
slug: /posts
title: Posts
---
<h1 style="font-size: 1rem;">{{ title }}</h1>
<div class="rants"></div>
<script type="text/template" id="rant-tpl">
  <div class="rant rants__item">
    <div class="rant__date">%date%</div>
    <div class="rant__img">%img%</div>
    <div class="rant__text">%text%</div>
  </div>
</script>
<!--<script>
  (function RantFeedContext() {
    'use strict';

    var url = 'https://devrant.com/api/users/1207790?app=3&content=rants&skip=0';
    var req = new XMLHttpRequest();
    var html = '';

    function RantFeed(userId) {
      this.user = userId;
      this.rants = [];
      this.root = document.getElementsByClassName('rants')[0];
    }

    RantFeed.prototype.storeRants = function storeRants(response) {
      var rants = JSON.parse(response),
        keypath = 'profile.content.content.rants'.split('.');
      while (keypath.length)
        rants = rants[keypath.shift()];
      this.rants = rants;
    };

    RantFeed.prototype.getRants = function getRants(onload, onerror) {
      var req =  new XMLHttpRequest(),
          self = this;

      req.open('GET', 'https://devrant.com/api/users/' + this.user + '?app=3&content=rants&skip=0');
      req.send();
      req.onerror = onerror;

      req.onload = function() {
        try {
          self.storeRants(req.response);
        } catch (err) {
          if (typeof onerror === 'function')
            onerror(err);
        }

        if (typeof onload === 'function')
          onload(self.rants);
      };
    }

    function Rant(rant) {
      this.permalink = 'https://devrant.com/rants/' + rant.id;
      this.score = rant.score;
      this.commentCount = rant.num_comments;
      this.date = rant.created_time;
      this.links = rant.links || [];
      this.text = rant.text;
      this.img = '';
      if (rant.attached_image)
        this.img = rant.attached_image.url;
      this.template = document.getElementById('rant-tpl').innerHTML;
    }

    Rant.prototype.toHTML = function() {
      return this.template
        .replace('%text%', this.addLinks(this.text))
        .replace('%date%', new Date(this.date * 1000).toISOString().split('T')[0])
        .replace('%img%', this.img);
    };

    Rant.prototype.addLinks = function(text) {
      for (var i = this.links.length; i--;) {
        var l = this.links[i];
        text = text.slice(0, l.start) + '<a href="' + l.url + '">' + l.title + '</a>' + text.slice(l.end);
      }
      return text;
    };
    
    var rantfeed = new RantFeed('1207790');

    rantfeed.getRants(
      function onRantsLoad(rants) {
        var html = '';

        rants.forEach(function(r, i) {
          rantfeed.rants[i] = new Rant(r);
          html += rantfeed.rants[i].toHTML()
        });

        rantfeed.root.innerHTML = html;
      },
      function onRantsError(err) {
        console.log(err);
      }
    );

    window.rantfeed = rantfeed
  }());
</script>-->