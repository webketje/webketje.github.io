GS Custom Settings provides a ton of functionality for building plugins.
This tutorial will walk you through all the capabilities of GS Custom Settings for plugins, through building a simple gallery plugin that takes with a couple of customization options.
### Plugin language file
First we create a standard GS plugin `en_US.php` language file, which will go in the `/lang/` directory of our plugin:
<pre>
$i18n = array(
  'PLUGIN_NAME' => 'GSconfig UI',
  'PLUGIN_DESCR' => 'UI shim for gsconfig.php. Tweak the config settings directly from GS CMS. Requires GS Custom Settings v0.4+',
  'PLUGIN_INTRO' => '',
  'PLUGIN_OUTRO' => ''
);
</pre>
### Settings file
Next we create the `settings.json` file in our plugin dir which GS Custom Settings will use. You can do this in the JSON itself, or through the UI (exporting the settings). But for this plugin it will be required to edit the JSON files, as some advanced functions of GS Custom Settings cannot be set through the UI. For this tutorial I am only including three GSCONFIG settings for the sake of brevity, which are:  `GSNOUPLOADIFY`, `GSDEBUG` and `GSEDITORLANG`.
<table style="border-collapse: collapse;">
<tr>
  <td>Constant</td>
  <td>Lookup</td>
  <td>Type</td>
  <td>Default</td>
</tr>
<tr>
  <td><code>GSNOUPLOADIFY</code></td>
  <td><code>gs_uploadify</code></td>
  <td><code>checkbox</code></td>
  <td><code>true</code></td>
</tr>
<tr>
  <td><code>GSDEBUG</code></td>
  <td><code>gs_debug</code></td>
  <td><code>checkbox</code></td>
  <td><code>false</code></td>
</tr>
<tr>
  <td><code>GSEDITORANG</code></td>
  <td><code>gs_editor_lang</code></td>
  <td><code>select</code></td>
  <td><code>'en'</code></td>
</tr>
</table>
`settings.json` looks like this:
<pre>
{
  "tab":{
    "lookup":"gsconfig_ui",
    "label":"GetSimple Config",
    "version":"0.1",
    "enableReset": true,
    "enableAccess": false
  },
  "settings":{
     {
      "lookup":"gs_uploadify",
      "value":true,
      "type":"checkbox",
      "descr":"",
      "access":"normal",
      "label":"Enable Uploadify to upload files?",
      "default":false,
      "constant":"GSNOUPLOADIFY"
     },
     {
      "lookup":"gs_debug",
      "value":false,
      "type":"checkbox",
      "descr":"",
      "access":"normal",
      "label":"Turn on debug mode",
      "default":false,
      "constant":"GSDEBUG"
    },
    {
      "lookup":"gs_editor_lang",
      "value":23,
      "type":"select",
      "descr":"",
      "access":"normal",
      "label":"Editor language",
      "options":[
        "af","ar","bg","bn","bs","ca","cs","cy","da","de",
        "el","en-au","en-ca","en-gb","en","eo","es","et",
        "eu","fa","fi","fo","fr-ca","fr","gl","gu","he",
        "hi","hr","hu","is","it","ja","ka","km","ko","ku",
        "lt","lv","mn","ms","nb","nl","no","pl","pt-br",
        "pt","ro","ru","sk","sl","sr-latn","sr","sv","th",
        "tr","ug","uk","vi","zh-cn","zh"],
      "default":14,
      "constant":"GSEDITORLANG"
     },
  }
}
</pre>
### Main plugin file
First we create a simple GS plugin `.php` file. Note that if your plugin needs its own display tab, you should add an extra entry to the `register_plugin` parameters: the string name of your display function. And add a function for a GS plugin hook. This plugin only uses GS Custom Settings in the backend, so no need for that.

<pre>
register_plugin('gsconfig_ui',    # plugin ID
  i18n_r('PLUGIN_NAME'),          # Title of plugin
  '0.1',                          # Version of plugin
  'Kevin Van Lierde',             # Author of plugin
  'http://webketje.github.io',    # Author URL
  i18n_r('PLUGIN_DESCR'),         # Plugin Description
  'plugins'                       # Page type of plugin
);
</pre>

<pre>
function gsconfig_ui_intro() { i18n('PLUGIN_INTRO'); }
function gsconfig_ui_outro() { i18n('PLUGIN_OUTRO'); }

add_action('custom-settings-render-top', 'custom_settings_render', array('gsconfig_ui', 'gsconfig_ui_intro'));
add_action('custom-settings-render-bottom', 'custom_settings_render', array('gsconfig_ui', 'gsconfig_ui_outro'));
</pre>
First thing we want to do is to avoid modifying the `gsconfig.php` file when no settings have been changed. To do this we need to store a copy of the settings using a custom function in the `custom-settings-load` hook:
<pre>
function gsconfig_ui_load() {
  $settings = array();
  $temp = return_setting_group('gsconfig_ui', 'gs', false);
  foreach ($temp as $l => $s) {
    if ($s['type'] !== 'section-title')
      $settings[$s['constant']] = array_merge($s, array('lookup', $l));
  }
  $settings = array_reduce($settings, 'gsconfig_ui_flatten_setting');
  file_put_contents(GSPLUGINPATH . 'gsconfig_ui/temp_data.txt', $settings);
}
add_action('custom-settings-load', 'gsconfig_ui_load');
</pre>
What we've done here is we return the setting group prefixed with `gs` with `return_setting_group`. Because all settings are prefixed with `gs`, this returns all settings for the plugin. In a `foreach` loop, we push all relevant settings to the `$settings` array, excluding section titles (they don't hold any value). Then we map the `$settings` array to an appropriate comparison format for later with `array_reduce`, and finally, store this data in a `temp_data.txt` file in our plugin dir to compare with later in the `custom-settings-save` hook.