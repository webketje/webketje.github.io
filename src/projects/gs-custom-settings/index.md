---
title: GS Custom Settings
slug: gs-custom-settings
layout: project.twig
widgets: toc
---
<script src="assets/js/jquery.sticky.js"></script>
<section id="intro">
	<header>
		<h2 id="introduction">Introduction</h2>
	</header>
	<p>GS Custom Settings is a plugin for <a href="https://get-simple.info/">GetSimple CMS </a>which lets webmasters/ site managers, theme and plugin developers implement and use their own custom settings for output, configuration, and cross-plugin/-theme communication. It's a bit like the <a href="https://get-simple.info/extend/plugin/customfields/22/">custom fields plugin</a>, but not for pages. The plugin offers 8 different types of input to choose from, 3 access levels, per-user editing permission, and an easy UI to create, import and export the settings. Once activated, a new tab 'Site', is added, where one will find all settings created with the plugin, grouped by sidebar tab. View a screenshot of the UI in <a href="https://i.imgur.com/w0yV3ez.png">Manage mode</a> or <a href="https://i.imgur.com/NuQ2ezN.png">Edit mode</a></p>
	<p>The plugin is built on <a href="https://knockoutjs.com">Knockout JS</a> and handles almost all logic client-side, except for plugin registration, hooks, path resolving, and handling server requests. Data is sent and saved through AJAX. Furthermore, the plugin provides an interactive notification service and a JS localization system. The language file for this plugin is also in JSON format.</p><p>GS Custom Settings is compatible with <strong>PHP 5.2+</strong> (might work with PHP 5+, untested) and <strong>all browsers except Internet Explorer 8 and older</strong> Managing settings also works in IE8 (editing doesn't). Some features might not work on some browsers. See <a href="#known-issues">Known Issues</a> for more information. If you find <strong>bugs</strong> or have <strong>feature requests or questions</strong>, feel free to open a new issue in the <a href="https://github.com/webketje/GS-Custom-Settings/">Github repo</a> or write a post on the <a href="https://get-simple.info/forums/showthread.php?tid=7099">GS support forum</a>.</p>
</section>
<section>
	<header>
		<h2 id="features">Features</h2>
	</header>
	<ul>
		<li>Custom settings for site managers, plugin and theme developers</li>
		<li>8 different setting types (select, radio, text, textarea, checkbox, image, color, section title) + 3 fancy variants (FontAwesome)</li>
		<li>3 access levels for settings (normal, hidden, locked)</li>
		<li>Output settings in pages with <code>(% setting:tab/setting %)</code> or in PHP with <code>get_setting('tab','setting')</code></li>
		<li>Output multilingual settings (only with I18N plugin 2.5.8+)</li>
		<li>Restrict user editing permission per user (also with MultiUser 1.8.2+)</li>
		<li>Feature-rich editing in 'edit' mode with multiselect, batch setting adding/removing &amp; keyboard shortcuts</li>
		<li>Responsive feedback through notifications</li>
		<li>Import (IE10+ &amp; other browsers)/ Export settings for re-use through the GUI</li>
		<li>Build and export settings directly through the UI for your plugin/ theme</li>
		<li>Extend existing themes and plugins with custom settings</li>
		<li>Access settings from other themes and plugins</li>
		<li>(almost) fully i18n, even custom theme and plugin settings I18n-enabled</li>
		<li>Available in English, French, Dutch, German, Russian &amp; Spanish</li>
	</ul>
</section>
<section>
	<header>
		<h2 id="download-install-upgrade">Download, install, upgrade</h2>
	</header>
	<p>Download the latest (or other) version(s) of this plugin on the GetSimple Extend <a href="https://get-simple.info/extend/plugin/ko-site-settings/913/">Plugin page</a>. The latest version of this plugin is <strong>0.3</strong>.
	To install, simply unzip to GS plugins directory.
	</p>
</section>
<section>
	<header>
		<h2 id="user-guide">User Guide</h2>
	</header>
	<section>
		<h3 id="advised-use">Advised use</h3>
		<p>It is required that every setting and every tab have a different <strong>lookup</strong> value, the plugin will not save updates if there are duplicate lookups. It is also important to note that if you change this value, you will have to update your PHP calls. Therefore it is advised not to change the setting's tab/ label after putting it to use.</p>
	</section>
	<section>
		<h3 id="switching-between-modes">Switching between modes</h3>
		<p>The Site Settings plugin allows you to switch modes between <kbd>Manage</kbd> and <kbd>Edit</kbd>. <kbd>Manage</kbd> mode only allows changing the value of visible, non-locked inputs, and is meant for the webmaster/ website manager; in <kbd>Edit</kbd> mode, (primarily) for the developer, one can create and modify settings. Simply click the button to toggle the mode.</p>
	</section>
	<section>
		<h3 id="editing-tabs">Editing tabs</h3>
		<img style="float: right; margin-left: 20px;" src="https://i.imgur.com/dmuLukB.gif">
		<p>Editing tabs is pretty self-explanatory (see image to the right). Click the tab label to edit it, and click the icons to complete any of the following actions, from left to right: </p>
		<ol>
			<li>Add a new tab</li>
			<li>Remove this tab</li>
			<li>Move this tab up</li>
			<li>Move this tab down</li>
			<li>Toggle tab label/ lookup</li>
		</ol>
		<p>There are 3 types of tabs: site tabs, theme tabs and plugin tabs, displayed in that order respectively. Only site tabs are visible in Edit mode/editable (but you can extend plugin and theme tabs manually). You can also extend plugins/ themes which do <em>not</em> use GS Custom Settings trivially by following the instructions in For Plugin/ Theme developers.</p>
	</section>
	<section>
		<h3 id="editing-settings">Editing settings</h3>
		<p>To view setting details for all settings, toggle the Open/ Close All button in the top-right nav. The settings toolbar allows any of the following actions, from left to right:</p>
		<ol>
			<li>(De)select all settings</li>
			<li>Show/ Hide all settings' details</li>
			<li>Add x (x = items in selection) new settings</li>
			<li>Remove all selected settings</li>
			<li>Move all selected settings up</li>
			<li>Move all selected settings down</li>
		</ol>
		<p>Every setting also has the two first buttons to (de)select individually &amp; hide/show individually. As of v0.2, some setting actions can also be achieved using keyboard shortcuts, eg:</p>
		<ol>
		<li><kbd>SHIFT</kbd> + click selects all settings between the setting first and last clicked.</li>
		<li><kbd>Ctrl</kbd> + click adds the clicked setting to the selection</li>
		<li><code>(v0.4+)</code> <kbd>Ctrl</kbd> + <kbd>F</kbd> Jumps to the page search</li>
		<li><code>(v0.4+)</code> <kbd>Ctrl</kbd> + <kbd>DELETE</kbd> removes all selected settings. <br>
				<code>(v0.3-)</code> <kbd>DELETE</kbd> removes all selected settings.</li>
		<li><code>(v0.4+)</code> <kbd>Ctrl</kbd> + <kbd>ArrowUp</kbd> moves all settings in the selection 1 up.</li>
		<li><code>(v0.4+)</code> <kbd>Ctrl</kbd> + <kbd>ArrowDown</kbd> moves all settings in the selection 1 down.</li>
		<li><code>(v0.4+)</code> <kbd>Ctrl</kbd> + <kbd>Enter</kbd> adds a new setting under each setting in the selection.</li>
		</ol>
	</section>
	<section>
		<h3 id="editing-setting-properties">Editing setting properties</h3>
		<p>Each setting has 6 (or 7) modifiable properties: lookup, label, descr, type, value, access [, options]. 
			As of <code>v0.4</code> you can also add your own properties in the JSON files. Here's what the default properties are used for/ their possible values:</p>
		<ul>
			<li><code>lookup</code> is the identifier used by PHP to link translations and return settings through the API functions. It is important to never have duplicate lookups in the same tab to avoid returning the wrong setting.</li>
			<li><code>label</code> is the setting's title, displayed in <code>Manage</code> mode, and should be max 5-10 words.</li>
			<li><code>descr</code> is a setting's additional description, displayed in <code>Manage</code> mode.</li>
			<li><code>value</code> holds the setting's value. For text inputs (text, textarea) this is simply the text entered, for checkbox inputs (checkbox, switch, fancy checkbox) a boolean (true/ false), and for option inputs (radio, select, fancy radio) a zero-based index.</li>
			<li>
			<code>type</code> is a setting's type. It determines display in <code>Manage</code> mode and through  calls to <code>get_setting</code>. There are 3 setting types, each with more variants:
				<ul>
					<li>Text inputs <em>(textarea, text)</em></li>
					<li>Checkbox inputs <em>(checkbox, fancy checkbox, switch)</em></li>
					<li>Option inputs <em>(radio, fancy radio, select)</em></li>
				</ul>
			</li>
			<li>
				<code>access</code> determines how (in)visible the input is in <code>Manage</code> mode: 
				<ul>
					<li><code>Normal</code> is default</li>
					<li><code>Locked</code> shows the input for display, but editing is diasbaled, <br>ideal for eg, fixed passwords or tracking codes.</li>
					<li><code>Hidden</code> hides the input from <code>Manage</code> mode, <br>ideal for meta properties, eg. plugin/theme versions or paths, CSS killswitch. </li>
				</ul>
			</li>
			<li><code>options</code> is only present if the input is of type select, radio or fancy radio, and holds the options for the input.</li>
		</ul>
		<p>Note: changing an input's type will reset its value, but changing to another subtype on the same type will not. Eg, changing from radio to fancy radio, the value will be preserved, but not from radio to checkbox.</p>
		<p>Below is a preview of what the 8 input types look like in <kbd>Manage</kbd> mode.</p>
			<p><strong>Text</strong><img src="assets/img/text-input.png" style="float:right;"></p>
			<p><strong>Textarea</strong><img src="assets/img/textarea-input.png" style="float:right;"></p>
			<p><strong>Checkbox</strong><img src="assets/img/text-input.png" style="float:right;"></p>
			<p><strong>Radio</strong><img src="assets/img/radio-input.png" style="float:right;"></p>
			<p><strong>Select</strong><img src="assets/img/select-input.png" style="float:right;"></p>
			<p><strong>Image</strong><img src="assets/img/image-input.png" style="float:right;"></p>
			<p><strong>Color</strong><img src="assets/img/color-input.png" style="float:right;"></p>
			<p><strong>Section Title</strong><img src="assets/img/section-title-input.png" style="float:right;"></p>
			<p><strong>Fancy checkbox</strong><img src="assets/img/fancy-checkbox-input.png" style="float:right;"></p>
			<p><strong>Fancy radio</strong><img src="assets/img/fancy-radio-input.png" style="float:right;"></p>
			<p><strong>Switch</strong><img src="assets/img/switch-input.png" style="float:right;"></p>
	</section>
	<section>
		<h3 id="outputting-settings">Outputting settings</h3>
		<p>To get a setting in a page (in the WYSIWYG editor), simply type <code>(% setting: tab/setting %)</code>.<br>To get a setting in themes and components, type <code>&lt;?php get_setting('tab/setting') ?&gt;</code>.<br>To process the return value before outputting it, type <code>&lt;?php return_setting('tab/setting') ?&gt;</code>. The easiest way to get this code, is to copy to select and copy paste the code field next to the input (the WYSIWYG code is visible in <kbd>Manage</kbd> mode, the PHP code in <kbd>Edit</kbd> mode.) Beneath is a listing of the return values for each type of input (the 'fancy' versions as well as <code>switch</code> simply make use of font icons instead of standard inputs):</p>
		<table>
			<tbody><tr>
				<td><strong>Input types</strong></td>
				<td><strong>With <code>get_setting</code></strong></td>
				<td><strong>With <code>return_setting($tab, $setting, $value)</code></strong></td>
			</tr>
			<tr>
				<td><code>text</code></td>
				<td>Returns the text content from the field</td>
				<td>Returns the text content from the field</td>
			</tr>
			<tr>
				<td><code>textarea</code></td>
				<td>Returns the text content from the field</td>
				<td>Returns the text content from the field</td>
			</tr>
			<tr>
				<td><code>checkbox</code></td>
				<td>Returns <code>'on'</code> (checked) or <code>'off'</code> (unchecked)</td>
				<td>Returns <code>TRUE</code> (checked) or <code>FALSE</code> (unchecked)</td>
			</tr>
			<tr>
				<td><code>radio</code></td>
				<td>Returns the <i>selected</i> option's text value.</td>
				<td>Returns the <i>selected</i> option's zero-based index.</td>
			</tr>
			<tr>
				<td><code>select</code></td>
				<td>Returns the <i>selected</i> option's text value.</td>
				<td>Returns the <i>selected</i> option's zero-based index.</td>
			</tr>
			<tr>
				<td><code>image</code></td>
				<td>Returns an image tag <br><code>&lt;img src="input_value" alt="input_lookup"&gt;</code>.</td>
				<td>Returns the image URL.</td>
			</tr>
			<tr>
				<td><code>color</code></td>
				<td>Returns the input's value.</td>
				<td>Returns the input's value.</td>
			</tr>
			<tr>
				<td><code>section title</code></td>
				<td>Returns NULL (section titles have no value).</td>
				<td>Returns NULL (section titles have no value).</td>
			</tr>
			<tr>
				<td><code>switch</code></td>
				<td>Returns <code>'on'</code> (checked) or <code>'off'</code> (unchecked)</td>
				<td>Returns <code>TRUE</code> (checked) or <code>FALSE</code> (unchecked)</td>
			</tr>
			<tr>
				<td><code>fancy checkbox</code></td>
				<td>Returns <code>'on'</code> (checked) or <code>'off'</code> (unchecked)</td>
				<td>Returns <code>TRUE</code> (checked) or <code>FALSE</code> (unchecked)</td>
			</tr>
			<tr>
				<td><code>fancy radio</code></td>
				<td>Returns the <i>selected</i> option's text value.</td>
				<td>Returns the <i>selected</i> option's zero-based index.</td>
			</tr>
		</tbody></table>
	</section>
</section>
<section>
	<header>
	<br><br>
		<h2 id="for-webmasters-site-managers">For webmasters/site managers</h2>
	</header>
	<section>
		<h3 id="importing-settings">Importing settings</h3>
		<p>You can <strong>import</strong> settings by clicking the <code>import</code> button (in v0.2, will not work if your browser is IE9 or below). Make sure your file is valid JSON and your filename contains the string <code>theme_data</code> (for theme settings), <code>plugin_data</code> (for plugin settings) or <code>tabname_data</code> (for separate site tabs). For importing multiple site tabs, your file should be named <code>data.json</code>. Importing settings will: overwrite settings that already exist, and add new settings if they don't. Importing settings does not replace an entire tab or remove settings not present in the import. If you prefer you can also manually import settings by copying previously exported settings files to <code>/data/other/custom_settings</code>.</p>
	</section>
	<section>
		<h3 id="exporting-settings">Exporting settings</h3>
		<p>You can <strong>export</strong> settings simply by clicking the <code>export</code> button. You can export 1) all site settings by choosing 'Site Settings', 2) a separate site tab (by name), 3) a separate plugin tab (by name), and 4) the theme settings of the currently selected theme by choosing 'Theme Settings'. You can also manually backup all settings by making a copy of <code>/data/other/custom_settings</code>.</p>
	</section>
	<section>
		<h3 id="restricting-editing-permission">Restricting editing permission (also with Multi User 1.8.2+)</h3>
		<p>Go to <code>root/data/users/</code> and edit the XML file for the user you want to restrict editing permissions for. Simply add an XML node <code>&lt;KO_EDIT&gt;FALSE&lt;/KO_EDIT&gt;</code> and you're done. <code>TRUE</code> also works (to allow editing) but this is the default, so it doesn't really matter. As of v0.3, user permission can be set through Mike Henken's <a href="https://get-simple.info/extend/plugin/multi-user/133/">Multi User 1.8.2+</a> plugin. To do so, go to GS <kbd>Settings</kbd> tab, click on <kbd>User management</kbd>, and when you edit the user, in the <code>Custom Permissions</code> section, check GS Custom Settings <strong>to disable Edit access</strong>, and save.</p>
		<p><u>Note:</u> Upon activation or deactivation of Multi User, GS Custom Settings user permissions will be reset (so you have to do like above/ re-edit the user file).</p>
	</section>
</section>
<section>
	<header>
		<h2 id="for-theme-developers">For theme developers</h2>
	</header>
	<p>GS Custom Settings allows you to build custom settings for your theme through an easy UI, <br>and they can even be multilingual! No need for building a custom plugin like the <code>InnovationPlugin</code>. After you have downloaded Custom Settings, and installed it on your local/ test site (just like other GS plugins), go to <strong>Site</strong> tab, switch to <strong>Edit</strong> mode, create a new tab (name it however you like), add all the settings you need, and in the list toolbar, in the select next to <code>Export tab as:</code>, choose <code>Theme</code>. </p>
	<p>If for some reason the file isn't automatically named <code>settings.json</code>, rename it to that.</p>
	<p>The descriptions/ labels/ values exported will be used as default values in the default language. If you want, you can add more languages by creating a subdirectory in your theme named <code>lang</code>.      
	</p>
	<p>For example a simple GS theme with trilingual custom settings would have a directory like this: </p>
<pre><code class="language-plaintext">Theme root
  ├─ assets/
  ├─ images/
  ├─ style.css
  ├─ template.php
  ├─ functions.php
  <span style="color: #C24145">├─ settings.json </span>(with en_US as standard)
  <span style="color: #C24145">└─ lang/</span> (optional)
     <span style="color: #C24145">├─ en_US.json</span>
     <span style="color: #C24145">├─ fr_FR.json</span>
     <span style="color: #C24145">└─ de_DE.json</span></code></pre>
	<p>The only translatable strings are a setting's <code>label</code>,<code>descr</code> and <code>options</code> (if the setting is a <code>select</code>, <code>radio</code> or <code>fancy radio</code>). For each of these, you should prefix the property with the setting's <code>lookup</code>. The language files in the <code>lang</code> directory should have a <code>strings</code> object holding all strings for the settings. You can optionally add a <code>meta</code> object containing information about the translation version, author, date etc.</p>

<pre><code class="language-json">
{"meta": {"author":"me"}, /* meta is optional */
  "strings": {
     "mysetting_label": "Label",
     "mysetting_descr": "Description",
     "mysetting_options": [
        "option1",
        "option2",
        "option3"
     ],
     "mysecondsetting_label": "Label 2",
     "mysecondsetting_descr": "Description 2"
  }
}
</code></pre>
<p>You're set! When your theme is activated in the GS <code>theme</code> tab, your settings will appear in the Custom Settings sidebar in the tab <code>Theme settings</code> (GS tab <code>Site</code>). The data is saved to <code>/data/other/custom_settings/theme_data_&lt;themename&gt;.json</code>.<br><br>Not entirely sure yet? For more examples, read the <a href="https://webketje.github.io/cms/2015/03/30/building-a-theme-with-gs-custom-settings/">Theme tutorial</a>.</p>
</section>
<section>
	<header>
		<h2 id="for-plugin-developers">For plugin developers</h2>
	</header>
	<p>GS Custom settings provides a sleek GUI for building and (later) updating, or managing (by third parties) your plugin's settings. In your plugin's directory (create one if you didn't have one already, and give it the same name as your plugin's ), you should have a valid <code>settings.json</code> file, create a <code>lang</code> subdirectory (if </p>
	<ol>
	<li>Create a plugin directory with the same name as your plugin's main <code>.php</code> file if you haven't already.</li>
	<li>
	In this directory you should have a valid JSON settings file, named <code>settings.json</code>. You can build this either:
	<ol>
	<li><strong>Manually</strong>: If you choose this, make sure your file has the required format, and your JSON contains no errors. You can test this with <a href="https://jsonlint.com">JSONlint</a>.</li>
	<li><strong>Through the plugin's GUI</strong> (easiest):. To do so, install the plugin on your test site, go to <strong>Site</strong> tab, switch to <strong>Edit</strong> mode, create a new tab, give it your plugin's name, and add all the settings you need. When ready, in the toolbar's <code>Export tab as:</code> dropdown, choose <code>Plugin</code>. Save the file as <code>settings.json</code> in your plugin's directory.</li>
	</ol>
	</li>
	<li>If you want your plugin to be multilingual, create a <code>lang</code> subfolder in your plugin folder, and include all language files with PHP locale used by GetSimple (eg, <code>en_US, fr_FR, de_DE</code>).  Translatable setting properties are: <code>label, descr, options</code>. The format of the JSON file should be as in the sample language file in the Attachments section.</li>
	</ol>
	<p>Your plugin directory should look like this for GS Custom Settings to work:</p>
  <pre><code class="language-plaintext">/plugins/
  ├─ your_plugin.php
  └─ your_plugin/
       <span style="color: #C24145">├─ settings.json</span> (with default language)
       <span style="color: #C24145">└─ lang/</span> (optional)
           <span style="color: #C24145">├─ en_US.json</span>
           <span style="color: #C24145">├─ fr_FR.json</span>
           <span style="color: #C24145">└─ de_DE.json</span>
	</code></pre>
  
	<p>The only translatable strings are a setting's <code>label</code>,<code>descr</code> and <code>options</code> (if the setting is a <code>select</code>, <code>radio</code> or <code>fancy radio</code>). For each of these, you should prefix the property with the setting's <code>lookup</code>. The language files in the <code>lang</code> directory should have a <code>strings</code> object holding all strings for the settings. You can optionally add a <code>meta</code> object containing information about the translation version, author, date etc.</p>

<pre><code class="language-json">
{"meta": {"author":"me"}, /* meta is optional */
  "strings": {
     "mysetting_label": "Label",
     "mysetting_descr": "Description",
     "mysetting_options": [
        "option1",
        "option2",
        "option3"
     ],
     "mysecondsetting_label": "Label 2",
     "mysecondsetting_descr": "Description 2"
  }
}
</code></pre>

	<p>GS Custom Settings provides <a href="#hooks">4 hooks</a> for your plugin's functions. To use it, do: <code>add_action($hook_name, $function)</code></p>
	<p>You can also output a link to your custom settings in your plugin tab by using <code>&lt;?php get_tab_link('myplugin','link title') ?&gt;</code>. When clicked, it will open the relevant item in the Custom settings sidebar.</p>
	<p>It should be noted that you don't need to manually add a hook to initialize your settings. As soon as <code>custom_settings.php</code> is included in the site, the <code>settings.json</code> file from your plugin's settings (if it is activated) will be automatically added to the custom settings UI. You should only use functions like <code>remove_setting</code> and <code>set_setting</code> to <em>update settings from an old to a newer version</em>. If so, be sure to include a hidden version setting to check.<br> Plugin data is saved to <code>/data/other/custom_settings/plugin_data_&lt;yourpluginname&gt;.json</code>.</p>
</section>
<section>
	<header>
		<h2 id="php-api">PHP API</h2>
	</header>
<h4 id="functions">Functions</h4>

<div class="spoiler-toggle" style="font-size: 1.125em;"><i class="fa fa-plus" style="font-size: .6em;"></i> <code>get_setting</code></div>
<div class="spoiler" style="display: none;">
<pre><code class="language-php">get_setting($tab, $setting, $echo=TRUE)
// @param {string} $tab - lookup property of the tab to search in
// @param {string} $setting - lookup property of the setting to output
// @param {boolean} [$echo=TRUE] - (optional) Whether to echo the setting. 
// Handy if you want the display value returned but not outputted.
</code></pre>

<p>Outputs the setting's value for display. This differs by setting type. </p>
<ul>
	<li>If the setting has options, the text from the selected option (in default language) will be displayed. </li>
	<li>If the setting is a checkbox/ switch/ fancy checkbox, <code>on</code> will be displayed if <code>true</code> and <code>off</code> if <code>false</code>.</li>
	<li>If the setting is text/ textarea/ color, the string <code>value</code> is returned as it was last saved.</li>
</ul>
<br>
<strong>Example use</strong>
<p>
	<code>get_setting('my_tab','my_setting')</code> outputs the setting's <em>value</em>.
	<br><code>get_setting('my_tab','my_setting','descr')</code> outputs the setting's description.
	<br><code>get_setting('my_tab','my_setting', false)</code> returns the setting's <em>display value</em>. For <code>option</code> or <code>image</code> settings this is different than its actual <code>value</code> property.
</p>
</div>

<div class="spoiler-toggle" style="font-size: 1.125em;"><i class="fa fa-plus" style="font-size: .6em;"></i> <code>get_i18n_setting</code></div>
<div class="spoiler" style="display: none;">
	<pre><code class="language-php">get_i18n_setting($tab, $setting, $echo=TRUE)
// @param {string} $tab - lookup property of the tab to search in
// @param {string} $setting - lookup property of the multilingual setting to output
// @param {boolean} [$echo=TRUE] - (optional) Whether to echo the multilingual setting. 
// Handy if you want the display value returned but not outputted.
</code></pre>

<p>Outputs the setting's value for display in the page's language (if none, the default language). Only works with the <a href="https://get-simple.info/extend/plugin/i18n/69/">I18N plugin by Martin Mvlcek</a> and with I18N-enabled <code>text/textarea</code> settings. <br><u>Note:</u> make sure all languages are in the final correct order when saving values, else you might have to reset them.</p>
</div>

<div class="spoiler-toggle" style="font-size: 1.125em;"><i class="fa fa-plus" style="font-size: .6em;"></i> <code>return_setting</code></div>
<div class="spoiler" style="display: none;">
<pre><code class="language-php">return_setting($tab, $setting, $prop=NULL)
// @param {string} $tab - lookup property of the tab to search in
// @param {string} $setting - lookup property of the setting to return
// @param {string|boolean} [$prop=NULL] - (Optional) A single property of the setting to return, or FALSE to return the full setting
</code></pre>

<p>Returns the entire setting as an array, or one property of it (if <code>$prop</code> is set).</p>
<p>When returning a setting's value:</p>
<ul>
	<li>If the setting has options (eg <code>select/ radio</code>), the return is a zero-index based number (0 is the first option).</li>
	<li>If the setting is a <code>checkbox/ switch/ fancy checkbox</code>, the return is <code>true</code> or <code>false</code>.</li>
	<li>If the setting is <code>text/ textarea/ color</code>, the string <code>value</code> is returned as it was last saved.</li>
</ul>
<strong>Example use</strong>
<p>
	<code>return_setting('my_tab','my_setting')</code> returns the setting's <em>value</em>.
	<br><code>return_setting('my_tab','my_setting','descr')</code> returns the setting's description.
	<br><code>return_setting('my_tab','my_setting', false)</code> returns the entire setting as a PHP array.
</p>
</div>
	
<div class="spoiler-toggle" style="font-size: 1.125em;"><i class="fa fa-plus" style="font-size: .6em;"></i> <code>return_setting_group</code></div>
<div class="spoiler" style="display: none;">
<pre><code class="language-php">return_setting_group($tab, $group, $prop=NULL)
// @param {string} $tab - lookup property of the tab to search in
// @param {string} $group - prefix in the lookup property, common to all settings in the group
// @param {string|boolean} [$prop=NULL] - (Optional) A single property to return for all settings, or FALSE to return them fully
</code></pre>

<p>Returns a group of settings prefixed with <code>$group_</code> within the given tab as an array of settings. If <code>$settings</code> holds the settings returned, they can be accessed by doing <code>$settings['my_setting']</code>. The prefix is stripped out so you don't have to do <code>$settings['mygroup_my_setting']</code>.</p>
<strong>Example use</strong>
<p>
	<code>return_setting_group('my_tab','mygroup')</code> returns all the values of the settings prefixed with <code>mygroup_</code>.
	<br><code>return_setting_group('my_tab','mygroup','descr')</code> returns all the descriptions of the settings prefixed with <code>mygroup_</code>.
	<br><code>return_setting_group('my_tab','mygroup', false)</code> returns all the settings prefixed with <code>mygroup_</code> entirely.
</p>
</div>

<div class="spoiler-toggle" style="font-size: 1.125em;"><i class="fa fa-plus" style="font-size: .6em;"></i> <code>get_tab_link</code></div>
<div class="spoiler" style="display: none;">
<pre><code class="language-php">get_tab_link($tab=NULL, $linkText='settings')
// @param {string} [$tab=NULL] - (Optional) Empty, lookup property of  
// lookup property of a plugin (basename) or 'theme_settings', or a site tab
// @param {string} [$linkText='settings'] - (Optional) A custom text for the &lt;a&gt; element
</code></pre>

<p>Outputs a link to the settings from the active theme (with <code>$tab</code> set to <code>theme_settings</code>), to an activated plugin, a site tab, or just the GS Custom Settings tab (if <code>$tab</code> is <code>NULL</code>). You can also set a <code>$linkText</code> for custom link text (default is 'settings'). The link will activate the tab given as <code>$tab</code>: useful if you want to include a link to settings from your plugin's page especially.</p>
</div>
	
<div class="spoiler-toggle" style="font-size: 1.125em;"><i class="fa fa-plus" style="font-size: .6em;"></i> <code>set_setting</code></div>
<div class="spoiler" style="display: none;">
<pre><code class="language-php">set_setting($tab, $setting, $value)
// @param {string} $tab - lookup property of the tab to search in
// @param {string} $setting - lookup property of the setting to return
// @param {string|array} $value - The property (ies) to modify.
</code></pre>

<p>(<strong>Experimental</strong>) Sets a given setting's properties if an array is given as value, or changes the settings' value if <code>$value</code> is a string. Be careful when using this function, as the code will be executed over and over again, forcing properties set by the function to overwrite those set in the UI. Note that the function does not write to a file, but modifies/ adds to a global, and changes will only persist if the data is saved. You should normally only use this function conditionally (eg, if a version setting is not up to date)</p>
</div>
	
<div class="spoiler-toggle" style="font-size: 1.125em;"><i class="fa fa-plus" style="font-size: .6em;"></i> <code>remove_setting</code></div>
<div class="spoiler" style="display: none;">
<pre><code class="language-php">remove_setting($tab, $setting)
// @param {string} $tab - lookup property of the tab to search in
// @param {string} $setting - lookup property of the setting to remove
</code></pre>

<p>(<strong>Experimental</strong>) Removes the given setting in the given tab. You should only use this function conditionally (eg, if a version setting is not up to date)</p>
</div>
	
<h4 id="hooks">Hooks</h4>
<div class="spoiler-toggle" style="font-size: 1.125em;"><i class="fa fa-plus" style="font-size: .6em;"></i> <code>custom-settings-load</code></div>
<div class="spoiler" style="display: none;">
<pre><code class="language-php">add_action('custom-settings-load', $function)
// @param {string} $function - the function you want to execute before settings are loaded
</code></pre>

<p>Hook that executes <em>before</em> settings are loaded into the UI. (called through the plugin UI on load). It's worth to point out that this function doesn't directly save settings to a file. It merely adds them to the plugin UI on load, and they will only be saved, if the user hits <kbd>Save updates</kbd>.</p>
</div>

<div class="spoiler-toggle" style="font-size: 1.125em;"><i class="fa fa-plus" style="font-size: .6em;"></i> <code>custom-settings-save</code></div>
<div class="spoiler" style="display: none;">
<pre><code class="language-php">add_action('custom-settings-save', $function)
// @param {string} $function - the function you want to execute right before settings are saved
</code></pre>

<p><code>(v0.4+)</code> Hook that executes <em>before</em> settings are saved to their files. This hook allows you to intercept, check and change values before they are saved, and act accordingly. Furthermore the hook is great as it doesn't require a page refresh to make changes to files or PHP code.</p>
</div>

<div class="spoiler-toggle" style="font-size: 1.125em;"><i class="fa fa-plus" style="font-size: .6em;"></i> <code>custom-settings-render-top</code></div>
<div class="spoiler" style="display: none;">
<pre><code class="language-php">add_action('custom-settings-render-top', 'custom_settings_render', array($plugin, $function))
// @param {string} $plugin - the basename of your plugin
// @param {string} $function - the function you want to execute 
// to output content above your setting list (eg. instructions, links, ...).
</code></pre>
<p><code>(v0.4+)</code> Hook that executes <em>below</em> the tab title (above the list of settings) in the GS Custom Settings tab. Use for outputting content, and <em>always</em> use with the <code>custom_settings_render</code> function as second parameter, and an array with (1) your plugin's name (without .php) and (2) a function that outputs HTML content.</p>
</div>

<div class="spoiler-toggle" style="font-size: 1.125em;"><i class="fa fa-plus" style="font-size: .6em;"></i> <code>custom-settings-render-bottom</code></div>
<div class="spoiler" style="display: none;">
<pre><code class="language-php">add_action('custom-settings-render-bottom', 'custom_settings_render', array($plugin, $function))
// @param {string} $plugin - the basename of your plugin
// @param {string} $function - the function you want to execute 
// to output content below your setting list (eg. extra buttons).
</code></pre>
<p><code>(v0.4+)</code> Hook that executes <em>above</em> the <kbd>Save updates</kbd> button (below the list of settings) in the GS Custom Settings tab. Use for outputting content, and <em>always</em> use with the <code>custom_settings_render</code> function as second parameter, and an array with (1) your plugin's name (without .php) and (2) a function that outputs HTML content.</p>
</div>

<br>
<br>
</section>
<section>  
	<header>
		<h2 id="plugin-info">Plugin info</h2>
	</header>
	<section>
		<h3 id="translating-the-plugin">Translating the plugin</h3>
		<p>You can help translating this plugin by downloading it first (see <a href="#download-install-upgrade">Download, install, upgrade</a>) and in the plugin folder, in the <code>/lang</code> folder, copy paste the <code>en_US.json</code> (or another) language file somewhere, update the meta info (revision, data, translator), and change the strings texts.</p>
	</section>
	<section>
		<h3 id="dependencies">Dependencies</h3>
		<p>GS Custom Settings includes:</p>
			<ul>
				<li><a href="https://jquery.com">jQuery (from GetSimple CMS)</a></li>
				<li><a href="https://knockoutjs.com">KnockoutJS 3.2.0</a></li>
				<li><a href="https://mbest.github.io/knockout.punches/">KnockoutJS punches</a></li>
				<li><a href="https://fortawesome.github.io/Font-Awesome/">FontAwesome 4.3.0 Iconfont</a></li>
			</ul>
	</section>
	<section>
		<h3 id="known-issues">Known issues</h3>
		<p>Find the list of currently known issues <a href="https://github.com/webketje/GS-Custom-Settings/issues">on Github</a></p>
		<pre style="white-space: pre-wrap; font-size: 14px;">{% include_relative known-issues.txt %}</pre>
	</section>
	<section>
		<h3 id="changelog">Changelog</h3>
		<pre style="white-space: pre-wrap; font-size: 14px;">{% include_relative changelog.txt %}</pre>
	</section>
	<footer>
	<hr>
		<p><a rel="license" href="https://creativecommons.org/licenses/by-sa/4.0/"><img alt="Creative Commons License" style="border-width:0; float: left; margin-right: 5px;" src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png"></a>
		<span xmlns:dct="https://purl.org/dc/terms/" property="dct:title">GS Custom Settings</span> by <a xmlns:cc="https://creativecommons.org/ns#" href="https://github.com/webketje/GS-Custom-Settings" property="cc:attributionName" rel="cc:attributionURL">Kevin Van Lierde</a> is licensed under a <a rel="license" href="https://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 International License</a>. Built for<a xmlns:dct="https://purl.org/dc/terms/" href="https://get-simple.info" rel="dct:source">https://get-simple.info</a>.
	</p></footer>
</section>
<script>
  $(document).ready(function(){
    $("#toc-sidebar").sticky({topSpacing:0, className: 'sticky'});
  });
  $('.spoiler-toggle').on('click', function() { 
    $(this.nextElementSibling).toggle(); 
    if ($(this.firstChild).hasClass('fa-plus'))
      this.firstChild.className = this.firstChild.className.replace('fa-plus', 'fa-minus');
    else if ($(this.firstChild).hasClass('fa-minus'))
      this.firstChild.className = this.firstChild.className.replace('fa-minus', 'fa-plus');
  });
	if (location.href.match(/id=.*/))
		document.getElementById(location.href.match(/id=.*/)[0].slice(3)) ? document.getElementById(location.href.match(/id=.*/)[0].slice(3)).scrollIntoView() : null;
</script>