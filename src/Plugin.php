<?php

namespace creativeorange\craft\article;

use craft\events\RegisterComponentTypesEvent;
use craft\i18n\PhpMessageSource;
use craft\services\Fields;
use creativeorange\craft\article\models\Settings;
use yii\base\Event;

class Plugin extends \craft\base\Plugin
{
    /**
     * @inheritdoc
     */
    public $schemaVersion = '0.0.1';

    public $hasCpSettings = true;

    /**
     *
     */
    public function init()
    {
        parent::init();


        \Yii::setAlias('@craft_article', __DIR__ . '/assets/editor/');

        Event::on(Fields::class, Fields::EVENT_REGISTER_FIELD_TYPES, function (RegisterComponentTypesEvent $e) {
            $e->types[] = Article::class;
        });

        \Craft::$app->i18n->translations['article'] = [
            'class'          => PhpMessageSource::class,
            'sourceLanguage' => 'nl',
            'basePath'       => __DIR__ . '/translations',
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