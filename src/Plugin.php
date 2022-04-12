<?php

namespace creativeorange\craft\article;

use craft\base\Model;
use craft\events\RegisterComponentTypesEvent;
use craft\i18n\PhpMessageSource;
use craft\services\Fields;
use creativeorange\craft\article\models\Settings;
use yii\base\Event;

class Plugin extends \craft\base\Plugin
{
    public bool $hasCpSettings = true;

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
    protected function createSettingsModel(): ?Model
    {
        return new Settings();
    }

    protected function settingsHtml(): ?string
    {
        return \Craft::$app->getView()->renderTemplate(
            'craft-article/settings',
            ['settings' => $this->getSettings()]
        );
    }
}