<?php

namespace creativeorange\craft\article\assets;

use craft\web\AssetBundle;
use creativeorange\craft\article\Plugin;

class EditorAssets extends AssetBundle
{
    /**
     * @inheritdoc
     */
    public $sourcePath = __DIR__ . '/editor';

    /**
     * @var array $plugins
     */
    public $plugins = [];


    /** @inheritdoc */
    public function init()
    {
        parent::init();

        $this->js = [
            Plugin::getInstance()->getSettings()->getAssetUrl('article-editor.js'),
            'js/CraftArticleImages.min.js',
            'js/CraftArticleImageEditor.min.js',
            'js/CraftArticleLink.min.js',
        ];

        $this->css = [
            Plugin::getInstance()->getSettings()->getAssetUrl('css/article-editor.min.css'),
        ];
    }
}