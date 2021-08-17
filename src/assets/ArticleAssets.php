<?php

namespace creativeorange\craft\article\assets;

use craft\web\AssetBundle;

class ArticleAssets extends AssetBundle
{
    /**
     * @inheritdoc
     */
    public $sourcePath = '@craft_article/assets/editor';

    /** @inheritdoc */
    public function init()
    {
        parent::init();

        $this->css = [
            'css/arx-content.min.css',
            'css/arx-frame.min.css',
        ];
    }
}