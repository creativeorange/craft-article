/**
 * @license See LICENSE.md
 * @preserve (c) 2021 Creativeorange B.V.
 */
ArticleEditor.add('plugin', 'craft-link', {
    linkOptions: null,
    elementSiteId: null,
    urlToSet: null,

    subscribe: {
        'popup.before.open': function () {
            var stack = this.app.popup.getStack();
            var name = stack.getName();

            if (name === 'link') {
                this._dropdown(stack);
            }
            if (name === 'link-create') {
                this._insertLink(stack);
            }
        }
    },
    // Initialize the plugin
    // @todo Add licensing
    init: function () {
        var craftSettings = this.opts.craft;

        this.linkOptions = craftSettings.linkOptions;
        this.elementSiteId = craftSettings.elementSiteId;
    },
    make: function (params) {
        this.app.popup.close();

        this.urlToSet = null;

        // Create a new one each time because Redactor creates a new one and we can't reuse the references.
        const modal = Craft.createElementSelectorModal(params.elementType, {
            storageKey: 'ArticleInput.LinkTo.' + params.elementType,
            sources: params.sources,
            criteria: params.criteria,
            defaultSiteId: this.elementSiteId,
            autoFocusSearchBox: false,
            onSelect: $.proxy(function (elements) {
                if (elements.length) {
                    const element = elements[0];

                    this.urlToSet = element.url + '#' + params.refHandle + ':' + element.id + '@' + element.siteId;
                    this.app.link.format();
                }
            }, this),
            closeOtherModals: false,
        });
    },
    // The dropdown when clicking the link in the toolbar
    _dropdown: function (stack) {
        var items = stack.getItemsData();
        for (var option in this.linkOptions) {
            option = this.linkOptions[option];

            var item = {
                title: option.optionTitle,
                command: 'craft-link.make',
                params: option
            };

            var index = this.app.utils.getObjectIndex(items, 'unlink');
            items = this.app.utils.insertToObject(option.elementType, item, items, index);
        }

        stack.setItemsData(items);
    },

    // If this.urlToSet is not null, fill the popup with that link
    _insertLink: function (stack) {
        if (this.urlToSet === null) {
            return;
        }

        var data = stack.data;
        data.url = this.urlToSet;
    }
});