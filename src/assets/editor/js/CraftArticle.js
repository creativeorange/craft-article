window.articleEditors = [];

jQuery(function ($) {
    Garnish.on(Craft.Preview, 'open', articleEditorReload);
    Garnish.on(Craft.LivePreview, 'enter', articleEditorReload);

    Garnish.on(Craft.Preview, 'close', articleEditorReload);
    Garnish.on(Craft.LivePreview, 'exit', articleEditorReload);
});

var articleEditorReload = function() {
    articleEditors.forEach(function(i) {
        i.stop();
        i.start();
    });
}