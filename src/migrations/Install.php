<?php

namespace creativeorange\craft\article\migrations;

use Craft;
use craft\db\Migration;
use craft\helpers\FileHelper;
use craft\helpers\Json;

/**
 * Install migration.
 */
class Install extends Migration
{
    /**
     * @inheritdoc
     */
    public function safeDown()
    {
        // Place uninstallation code here...
    }

    /**
     * @inheritdoc
     */
    public function safeUp()
    {

        $path = Craft::$app->getPath()->getConfigPath().DIRECTORY_SEPARATOR.'article';

        if (!is_dir($path)) {
            FileHelper::createDirectory($path);
        }

        $configFiles = realpath(__DIR__.'/../config');

        $files = FileHelper::findFiles($configFiles, [
            'only' => ['*.json'],
        ]);
        foreach ($files as $configFile) {
            $config = Json::decodeIfJson(file_get_contents($configFile));
            if (!is_array($config)) {
                echo "skipped (not valid JSON)\n";
                continue;
            }

            if (!file_exists($path.'/'.basename($configFile))) {
                FileHelper::writeToFile($path.'/'.basename($configFile),
                    Json::encode($config, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
            }
        }
    }
}
