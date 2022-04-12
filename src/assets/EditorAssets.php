<?php

namespace creativeorange\craft\article\assets;

use craft\web\AssetBundle;
use creativeorange\craft\article\Plugin;
use yii\web\JqueryAsset;

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
            JqueryAsset::class
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