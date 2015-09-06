###3 weeks as a webmaster/developer

In July/August 2015, I asked if he was interested in hiring me for a 2-3 week student job as a webmaster/developer. I wanted to test my coding skills in a professional environment and see if there (hopefully) was a match. Even if the period was short, I managed to learn a thing or two. I got two main tasks: updating a Wordpress website with a Themeforest template (Enfold, I'm sure it sounds familiar to you), and preparing the migration from Twitter Bootstrap to Foundation on a custom Ruby-Jekyll install (which I fortunately already had experience with since my website is hosted on Github).

#### Commercial Wordpress themes suck
Commercial Wordpress themes like the ones you can find on [Themeforest](http://themeforest.com) are packed with hundreds of features, custom post types, icons and tons of useless Javascript/ CSS assets, but that's not too bad (except for page load). **Forget about that one feature you are looking for though, it's missing.** In my case this was a setting field to specify a default blog post thumb. In the end I built a simple little plugin to enable this feature in the Settings dashboard. Thought about adding it to the Theme's settings? **Forget about that too**: save yourself hours of wading through opaque code spread over hundreds of includes, and the frustration of finding **zero documentation** except for a few outdated, unanswered tickets.

#### Wordpress also sucks
Another task involved enabling a custom Call-to-action widget (with multiple copies of the same instance). The Wordpress documentation wasn't too clear, but I got most of the plugin working in the end. I was only missing the function to register a custom widget area, and guess because of **what retarded design decision**? All widget functions are called `(<prefix>)widget(</suffix>)`. Except when you want to register a widget area, then it is `dynamic_sidebar('widget_name')`, **really?**

#### Git workflow
I'd learnt the basic steps of the Git workflow through my open-source plugin development and this website: `git status`, `git add`, `git commit`, `git push origin` etc. At [mango-is](http://mango-is.com) though, I finally got to hang of doing diffs, working on and merging separate branches, reverting commited changes, and referring to issues in commits. On top of that, all of it was done *on Windows*.

#### Front-end frameworks
I'd only ever used [UIkit](http://getuikit.com) for a full project, and had looked into parts of Bootstrap for Stackoverflow questions, but this time I got to almost *compare* both [Twitter Bootstrap]() and [Foundation](), as I had to port an entire website from the former to the latter. Summed up, Foundation is what its name says; it has less bells and whistles and less fancy styling than Bootstrap does. Another difference is that Foundation uses SASS while Bootstrap uses LESS.

#### Sass, Compass: CSS enhanced
Until now, I'd never worked with pre-compiling CSS. Mixins and being able to assign a value to a variable is great for CSS as it ensures greater consistency and maintainability, but for the personal projects I worked on it feels like overkill. The setup of the project causes some overhead, although this might of course be partly due to a lack of experience.

