<?php

namespace creativeorange\craft\article;

use Craft;
use craft\events\RegisterComponentTypesEvent;
use craft\events\TemplateEvent;
use craft\i18n\PhpMessageSource;
use craft\services\Fields;
use craft\web\View;
use creativeorange\craft\article\assets\EditorAssets;
use creativeorange\craft\article\models\Settings;
use yii\base\Event;

class Plugin extends \craft\base\Plugin
{
    public $hasCpSettings = true;

    /**
     *
     */
    public function init()
    {
        parent::init();

        \Yii::setAlias('@craft_article', realpath(dirname(__DIR__))."/src/assets/editor");

        Event::on(Fields::class, Fields::EVENT_REGISTER_FIELD_TYPES, function (RegisterComponentTypesEvent $e) {
            $e->types[] = Article::class;
        });

        Event::on(
            View::class,
            View::EVENT_BEFORE_RENDER_PAGE_TEMPLATE,
            function (TemplateEvent $event) {
                // Get view
                $view = Craft::$app->getView();

                // Load CSS file
                $view->registerAssetBundle(EditorAssets::class);
            }
        );

        \Craft::$app->i18n->translations['article'] = [
            'class'          => PhpMessageSource::class,
            'sourceLanguage' => 'nl',
            'basePath'       => __DIR__.'/translations',
            'allowOverrides' => true,
        ];
    }

    /**
     * @return Settings
     */
    protected function createSettingsModel()
    {
        return new Settings();
    }

    protected function settingsHtml()
    {
        return \Craft::$app->getView()->renderTemplate(
            'craft-article/settings',
            ['settings' => $this->getSettings()]
        );
    }
}