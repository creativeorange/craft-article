/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*********************************************************!*\
  !*** ./src/assets/editor/js/CraftArticleImageEditor.js ***!
  \*********************************************************/
/**
 * @license See LICENSE.md
 * @preserve (c) 2021 Creativeorange B.V.
 */
ArticleEditor.add('plugin', 'craft-image-editor', {
  assetId: null,
  // Start the plugin
  start: function start() {
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
  open: function open() {
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
  reloadImage: function reloadImage() {
    var _instance = this.app.block.get();

    var _images = _instance.getImage();

    var refreshNodeSource = function (node) {
      var matches = node.src.match(/(.*)#asset:(\d+)(:transform:(.*))?/i); // Find all instances of THIS asset.

      if (matches && matches[2] == this.assetId) {
        // Not a transform
        if (!matches[4]) {
          node.src = matches[1] + '?' + new Date().getTime() + '#asset:' + matches[2];
        } else {
          var params = {
            assetId: matches[2],
            handle: matches[4]
          };
          Craft.postActionRequest('assets/generate-transform', params, function (data) {
            node.src = data.url + '?' + new Date().getTime() + '#asset:' + matches[2] + ':transform:' + matches[4];
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
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!****************************************************!*\
  !*** ./src/assets/editor/js/CraftArticleImages.js ***!
  \****************************************************/
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
    'popup.open': function popupOpen() {
      var stack = this.app.popup.getStack();
      var name = stack.getName();
      var names = ['image-edit'];

      if (names.indexOf(name) !== -1) {
        this._build(stack);
      }
    }
  },
  // Initialize the plugin
  init: function init() {
    var craftSettings = this.opts.craft;
    this.volumes = craftSettings.volumes;
    this.transforms = craftSettings.transforms;
    this.defaultTransform = craftSettings.defaultTransform;
    this.elementSiteId = craftSettings.elementSiteId;
    this.allowAllFiles = craftSettings.allowAllUploaders;
  },
  // Start the plugin
  start: function start() {
    // Add image in the addbar
    // so you can insert craft cms
    this.app.addbar.add('craft-image', {
      title: 'Image',
      icon: '<span class="arx-popup-item-icon arx-icon-image"></span>',
      command: 'craft-image.showModal'
    });
  },
  // Open the Image Selector modal
  showModal: function showModal(args) {
    if (typeof this.assetSelectionModal === 'undefined') {
      var criteria = {
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
          var data = {}; // Process the url into an asset url

          var processAssetUrls = function (assets, callback) {
            var asset = assets.pop();

            var isTransform = this._isTransformUrl(asset.url); // If transform was selected or we don't have a default, no _real_ processing.


            if (isTransform || this.defaultTransform.length == 0) {
              data['asset' + asset.id] = {
                url: this._buildAssetUrl(asset.id, asset.url, isTransform ? transform : this.defaultTransform),
                id: asset.id
              };

              if (assets.length) {
                processAssetUrls(assets, callback);
              } else {
                callback();
              } // Otherwise, get the transform url for the default transform.

            } else {
              var _url = this._getTransformUrl(asset.id, this.defaultTransform, function (url) {
                data['asset' + asset.id] = {
                  url: this._buildAssetUrl(asset.id, url, this.defaultTransform),
                  id: asset.id
                };

                if (assets.length) {
                  processAssetUrls(assets, callback);
                } else {
                  callback();
                }
              }.bind(this));
            }
          }.bind(this); // Process the images to make it an asset url


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
  _build: function _build(stack) {
    var $item = stack.getFormItem('link'); // Create the DIV with the label

    var $box = this.dom('<div>').addClass(this.prefix + '-form-item');
    $label = this.dom('<label>').addClass(this.prefix + '-form-label').html(this.lang.parse('Transform'));
    $box.append($label); // Create the selectbox

    this.$select = this._create();
    $box.append(this.$select);
    $item.after($box);
  },
  _change: function _change(e) {
    // Get the selected transform
    var _transformSelected = this.dom(e.target).val();

    var _instance = this.app.block.get();

    var images = _instance.getImage(); // Set the image URL to the new asset


    this._setAssetUrl(images.nodes[0], _transformSelected);
  },
  _create: function _create() {
    var items = this.transforms;
    var $select = this.dom('<select>').addClass(this.prefix + '-form-select');
    $select.on('change', this._change.bind(this)); // Get current selected transform

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
  _isTransformUrl: function _isTransformUrl(url) {
    return /(.*)(_[a-z0-9+].*\/)(.*)/.test(url);
  },
  // Remove the transform
  _removeTransformFromUrl: function _removeTransformFromUrl(url) {
    return url.replace(/(.*)(_[a-z0-9+].*\/)(.*)/, '$1$3');
  },
  // Generate asset URL
  _buildAssetUrl: function _buildAssetUrl(assetId, assetUrl, transform) {
    return assetUrl + '#asset:' + assetId + ':' + (transform ? 'transform:' + transform : 'url');
  },
  // Get the name of the transform
  _getTransformName: function _getTransformName(src) {
    var matches = src.match(/(.*)#asset:(\d+)(:transform:(.*))?/i);

    if (!matches[4]) {
      // Not a transform
      return '';
    } else {
      return matches[4];
    }
  },
  // Get the URL to the Transform
  _getTransformUrl: function _getTransformUrl(assetId, handle, callback) {
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
  _setAssetUrl: function _setAssetUrl(node, newTransform) {
    var _instance = this.app.block.get();

    var matches = node.src.match(/(.*)#asset:(\d+)(:transform:(.*))?/i); // Find all instances of THIS asset.

    if (matches) {
      // Not a transform
      if (newTransform == '') {
        url = this._buildAssetUrl(matches[2], this._removeTransformFromUrl(matches[1]), null);

        _instance.setImage({
          url: url
        });
      } else {
        var params = {
          assetId: matches[2],
          handle: newTransform
        };
        Craft.postActionRequest('assets/generate-transform', params, function (data) {
          _instance.setImage({
            url: data.url + '?' + new Date().getTime() + '#asset:' + matches[2] + ':transform:' + newTransform
          });
        });
      }
    }
  }
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!**************************************************!*\
  !*** ./src/assets/editor/js/CraftArticleLink.js ***!
  \**************************************************/
/**
 * @license See LICENSE.md
 * @preserve (c) 2021 Creativeorange B.V.
 */
ArticleEditor.add('plugin', 'craft-link', {
  linkOptions: null,
  elementSiteId: null,
  urlToSet: null,
  subscribe: {
    'popup.before.open': function popupBeforeOpen() {
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
  init: function init() {
    var craftSettings = this.opts.craft;
    this.linkOptions = craftSettings.linkOptions;
    this.elementSiteId = craftSettings.elementSiteId;
  },
  make: function make(params) {
    this.app.popup.close();
    this.urlToSet = null; // Create a new one each time because Redactor creates a new one and we can't reuse the references.

    var modal = Craft.createElementSelectorModal(params.elementType, {
      storageKey: 'ArticleInput.LinkTo.' + params.elementType,
      sources: params.sources,
      criteria: params.criteria,
      defaultSiteId: this.elementSiteId,
      autoFocusSearchBox: false,
      onSelect: $.proxy(function (elements) {
        if (elements.length) {
          var element = elements[0];
          this.urlToSet = element.url + '#' + params.refHandle + ':' + element.id + '@' + element.siteId;
          this.app.link.format();
        }
      }, this),
      closeOtherModals: false
    });
  },
  // The dropdown when clicking the link in the toolbar
  _dropdown: function _dropdown(stack) {
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
  _insertLink: function _insertLink(stack) {
    if (this.urlToSet === null) {
      return;
    }

    var data = stack.data;
    data.url = this.urlToSet;
  }
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!**********************************************!*\
  !*** ./src/assets/editor/js/CraftArticle.js ***!
  \**********************************************/
window.articleEditors = [];
jQuery(function ($) {
  Garnish.on(Craft.Preview, 'open', articleEditorReload);
  Garnish.on(Craft.LivePreview, 'enter', articleEditorReload);
  Garnish.on(Craft.Preview, 'close', articleEditorReload);
  Garnish.on(Craft.LivePreview, 'exit', articleEditorReload);
});

var articleEditorReload = function articleEditorReload() {
  articleEditors.forEach(function (i) {
    i.stop();
    i.start();
  });
};
})();

/******/ })()
;