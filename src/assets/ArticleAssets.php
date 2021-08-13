<?php

namespace creativeorange\craft\article\assets;

use craft\web\AssetBundle;
use creativeorange\craft\article\Plugin;

class ArticleAssets extends AssetBundle
{
    /** @inheritdoc */
    public function init()
    {
        parent::init();

        $this->css = [
            Plugin::getInstance()->getSettings()->getAssetUrl('css/arx-content.min.css'),
            Plugin::getInstance()->getSettings()->getAssetUrl('css/arx-frame.min.css'),
        ];
    }
}