<?php

namespace creativeorange\craft\article\assets;

use craft\web\AssetBundle;
use craft\web\assets\cp\CpAsset;
use creativeorange\craft\article\Plugin;

class EditorAssets extends AssetBundle
{
    /**
     * @inheritdoc
     */
    public $sourcePath = __DIR__.'/../../dist/';

    /**
     * @var array $plugins
     */
    public $plugins = [];


    /** @inheritdoc */
    public function init()
    {
        parent::init();

        $this->depends = [
            CpAsset::class,
        ];

        $this->js = [
            Plugin::getInstance()->getSettings()->getAssetUrl('article-editor.js'),
            'js/CraftArticle.js',
        ];

        $this->css = [
            Plugin::getInstance()->getSettings()->getAssetUrl('css/article-editor.min.css'),
        ];
    }
}
