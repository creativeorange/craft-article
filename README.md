<h1 align="center">Craft Article</h1>

This plugin adds a “Article” field type to Craft CMS, which provides a rich text editor powered
by [Article](https://imperavi.com/article/) by Imperavi.

## Requirements

This plugin requires Craft CMS 3.6 or later.

## Installation

You can install this plugin with Composer.

#### With Composer

Go to the composer.json of your project. Add this to your composer.json:

```json
"repositories": [
    {
        "type": "composer",
        "url": "https://satis.creativeorange.dev",
        "only": [
          "creativeorange/*"
        ]
    }
]
```

After adding it to the composer.json, go to your terminal and execute:

```bash
# go to the project directory
cd /path/to/my-project.test

# tell Composer to load the plugin
composer require creativeorange/craft-article

# tell Craft to install the plugin
./craft install/plugin craft-article
```

## Configuration

### CDN config

It is possible to overwrite the CDN location via the settings page of the plugin.

### Article Configs

You can create custom Article configs that will be available to your Article fields. They should be created as JSON
files in your `config/article/` folder. They will become available within the “Article Config” setting on your Article
field’s settings.

See the [Article documentation](https://imperavi.com/article/docs/settings/) for a list of available config options and
buttons.

### HTML Purifier Configs

Article fields use [HTML Purifier](http://htmlpurifier.org) to ensure that no malicious code makes it into its field
values, to prevent XSS attacks and other vulnerabilities.

You can create custom HTML Purifier configs that will be available to your Article fields. They should be created as
JSON files in your `config/htmlpurifier/` folder.

Copy [Default.json](https://github.com/craftcms/craft/blob/master/config/htmlpurifier/Default.json) as a starting point,
which is the default config that Article fields use if no custom HTML Purifier config is selected.

See the [HTML Purifier documentation](http://htmlpurifier.org/live/configdoc/plain.html) for a list of available config
options.

### Article JS Plugins

All [first party Article JS plugins](https://imperavi.com/article/plugins/) are bundled by default. To enable them, just
add the plugin handle to the `plugin` array in your Article config. If you use your own CDN to serve the files, make
sure they are available on that CDN.

```json
{
  "plugins": [
    "image",
    "underline"
  ]
}
```

## Using the Article Field

When you are using the Article Field with the default and simple settings, it is required to execute

```twig
{% do view.registerAssetBundle("creativeorange\\craft\\article\\assets\\ArticleAssets") %}
```

before rendering the field in your TWIG file. **When you use Bootstrap or Tailwind or some other framework** make sure
to include the CSS for that framework!
