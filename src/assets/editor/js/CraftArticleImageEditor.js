/**
 * @license See LICENSE.md
 * @preserve (c) 2021 Creativeorange B.V.
 */
ArticleEditor.add('plugin', 'craft-image-editor', {
    assetId: null,

    // Start the plugin
    start: function () {
        // Add image in the addbar
        // so you can insert craft cms
        this.app.toolbar.add('craft-image-editor', {
            title: 'Edit Image',
            command: 'craft-image-editor.open',
            icon: '<span class="arx-popup-item-icon arx-icon-edit"></span>',
            blocks: {
                types: ['image']
            }
        });
    },

    open: function () {
        var _instance = this.app.block.get();
        var _images = _instance.getImage();

        var matches = _images.nodes[0].src.match(/(.*)#asset:(\d+)(:transform:(.*))?/i);

        if (!matches) {
            alert('Could not open Image Editor: asset ID is missing');
            return;
        }

        this.assetId = matches[2];

        var settings = {
            allowSavingAsNew: false,
            onSave: this.reloadImage.bind(this),
            allowDegreeFractions: Craft.isImagick
        };

        new Craft.AssetImageEditor(this.assetId, settings);
    },

    reloadImage: function () {
        var _instance = this.app.block.get();
        var _images = _instance.getImage();

        var refreshNodeSource = function (node) {
            var matches = node.src.match(/(.*)#asset:(\d+)(:transform:(.*))?/i);

            // Find all instances of THIS asset.
            if (matches && matches[2] == this.assetId) {
                // Not a transform
                if (!matches[4]) {
                    node.src = matches[1] + '?' + (new Date().getTime()) + '#asset:' + matches[2];
                } else {
                    var params = {
                        assetId: matches[2],
                        handle: matches[4]
                    };
                    Craft.postActionRequest('assets/generate-transform', params, function (data) {
                        node.src = data.url + '?' + (new Date().getTime()) + '#asset:' + matches[2] + ':transform:' + matches[4];
                    });
                }
            }
        }.bind(this);

        for (var node in _images.nodes) {
            node = _images.nodes[node];
            refreshNodeSource(node);
        }
    }
});