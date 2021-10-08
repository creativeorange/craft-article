/**
 * @license See LICENSE.md
 * @preserve (c) 2021 Creativeorange B.V.
 */
ArticleEditor.add('plugin', 'craft-image', {
    volumes: null,
    transforms: [],
    defaultTransform: '',
    elementSiteId: null,
    allowAllFiles: false,
    subscribe: {
        'popup.open': function () {
            var stack = this.app.popup.getStack();
            var name = stack.getName();
            var names = ['image-edit'];

            if (names.indexOf(name) !== -1) {
                this._build(stack);
            }
        },
    },

    // Initialize the plugin
    init: function () {
        var craftSettings = this.opts.craft;

        this.volumes = craftSettings.volumes;
        this.transforms = craftSettings.transforms;
        this.defaultTransform = craftSettings.defaultTransform;
        this.elementSiteId = craftSettings.elementSiteId;
        this.allowAllFiles = craftSettings.allowAllUploaders;
    },

    // Start the plugin
    start: function () {
        // Add image in the addbar
        // so you can insert craft cms
        this.app.addbar.add('craft-image', {
            title: 'Image',
            icon: '<span class="arx-popup-item-icon arx-icon-image"></span>',
            command: 'craft-image.showModal'
        });
    },

    // Open the Image Selector modal
    showModal: function (args) {

        if (typeof this.assetSelectionModal === 'undefined') {
            const criteria = {
                siteId: this.elementSiteId,
                kind: 'image'
            };

            if (this.allowAllFiles) {
                criteria.uploaderId = null;
            }

            this.assetSelectionModal = Craft.createElementSelectorModal('craft\\elements\\Asset', {
                storageKey: 'CraftArticle.ChooseImage',
                multiSelect: true,
                sources: this.volumes,
                criteria: criteria,
                onSelect: function (assets, transform) {
                    const data = {};

                    // Process the url into an asset url
                    const processAssetUrls = function (assets, callback) {
                        const asset = assets.pop();
                        const isTransform = this._isTransformUrl(asset.url);

                        // If transform was selected or we don't have a default, no _real_ processing.
                        if (isTransform || this.defaultTransform.length == 0) {
                            data['asset' + asset.id] = {
                                url: this._buildAssetUrl(asset.id, asset.url, isTransform ? transform : this.defaultTransform),
                                id: asset.id
                            };

                            if (assets.length) {
                                processAssetUrls(assets, callback);
                            } else {
                                callback();
                            }
                            // Otherwise, get the transform url for the default transform.
                        } else {
                            let url = this._getTransformUrl(asset.id, this.defaultTransform, function (url) {
                                data['asset' + asset.id] = {
                                    url: this._buildAssetUrl(asset.id, url, this.defaultTransform),
                                    id: asset.id
                                }

                                if (assets.length) {
                                    processAssetUrls(assets, callback);
                                } else {
                                    callback();
                                }
                            }.bind(this))
                        }
                    }.bind(this);

                    // Process the images to make it an asset url
                    processAssetUrls(assets, function () {
                        // Insert into the editor
                        this.app.image.insert(data);
                    }.bind(this));
                }.bind(this),
                transforms: this.transforms,
                closeOtherModals: false
            });
        } else {
            this.assetSelectionModal.show();
        }
    },

    // Transforms in the popup for image selection
    _build: function (stack) {
        var $item = stack.getFormItem('link');

        // Create the DIV with the label
        var $box = this.dom('<div>').addClass(this.prefix + '-form-item');
        $label = this.dom('<label>').addClass(this.prefix + '-form-label').html(this.lang.parse('Transform'));
        $box.append($label);

        // Create the selectbox
        this.$select = this._create();

        $box.append(this.$select);
        $item.after($box);
    },
    _change: function (e) {
        // Get the selected transform
        var _transformSelected = this.dom(e.target).val();
        var _instance = this.app.block.get();
        var images = _instance.getImage();

        // Set the image URL to the new asset
        this._setAssetUrl(images.nodes[0], _transformSelected);
    },
    _create: function () {
        var items = this.transforms;
        var $select = this.dom('<select>').addClass(this.prefix + '-form-select');
        $select.on('change', this._change.bind(this));

        // Get current selected transform
        var _instance = this.app.block.get();
        var images = _instance.getImage();

        var transform = this._getTransformName(images.nodes[0].src);

        var $option = this.dom('<option>');
        $option.val('');
        $option.html(this.lang.parse('No Transform'));

        if (transform == '') {
            $option.attr('selected', 'selected');
        }

        $select.append($option);

        for (var i = 0; i < items.length; i++) {
            var data = items[i];

            var $option = this.dom('<option>');
            $option.val(data.handle);
            $option.html(data.name);

            if (transform == data.handle) {
                $option.attr('selected', 'selected');
            }

            $select.append($option);
        }

        return $select;
    },
    // Does this asset link to an transform
    _isTransformUrl: (url) => /(.*)(_[a-z0-9+].*\/)(.*)/.test(url),
    // Remove the transform
    _removeTransformFromUrl: (url) => url.replace(/(.*)(_[a-z0-9+].*\/)(.*)/, '$1$3'),
    // Generate asset URL
    _buildAssetUrl: (assetId, assetUrl, transform) => assetUrl + '#asset:' + assetId + ':' + (transform ? 'transform:' + transform : 'url'),
    // Get the name of the transform
    _getTransformName: function (src) {
        var matches = src.match(/(.*)#asset:(\d+)(:transform:(.*))?/i);
        if (!matches[4]) {
            // Not a transform
            return '';
        } else {
            return matches[4];
        }
    },
    // Get the URL to the Transform
    _getTransformUrl: function (assetId, handle, callback) {
        var data = {
            assetId: assetId,
            handle: handle
        };

        Craft.postActionRequest('assets/generate-transform', data, function (response, textStatus) {
            if (textStatus === 'success') {
                if (response.url) {
                    callback(response.url);
                } else {
                    alert('There was an error generating the transform URL.');
                }
            }
        });
    },
    // Set the asset to the new choosen transform
    _setAssetUrl: function (node, newTransform) {
        var _instance = this.app.block.get();
        var matches = node.src.match(/(.*)#asset:(\d+)(:transform:(.*))?/i);
        // Find all instances of THIS asset.
        if (matches) {
            // Not a transform
            if (newTransform == '') {
                url = this._buildAssetUrl(matches[2], this._removeTransformFromUrl(matches[1]), null);
                _instance.setImage({url: url});
            } else {
                var params = {
                    assetId: matches[2],
                    handle: newTransform
                };
                Craft.postActionRequest('assets/generate-transform', params, function (data) {
                    _instance.setImage({url: data.url + '?' + (new Date().getTime()) + '#asset:' + matches[2] + ':transform:' + newTransform});
                });
            }
        }
    },
});