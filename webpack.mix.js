const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

mix
    .disableNotifications()
    .js([
        'src/assets/editor/js/CraftArticleImageEditor.js',
        'src/assets/editor/js/CraftArticleImages.js',
        'src/assets/editor/js/CraftArticleLink.js',
        'src/assets/editor/js/CraftArticle.js',
    ], 'dist/js/CraftArticle.js');
