<?php
/**
 * (c) 2021 Creativeorange B.V.
 */

namespace creativeorange\craft\article\models;

use Craft;
use craft\base\Model;
use Illuminate\Support\Str;

/**
 * Article Settings Model
 *
 * This is a model used to define the plugin's settings.
 *
 * Models are containers for data. Just about every time information is passed
 * between services, controllers, and templates in Craft, it’s passed via a model.
 *
 * https://craftcms.com/docs/plugins/models
 *
 * @author    Needletail
 * @package   Needletail
 * @since     1.0.0
 */
class Settings extends Model
{
    public $cdnUrl = '';
    public $useCDN = false;

    /**
     * API Keys can be set in environment variable. Therefore
     * we need to parse the keys on retrieval.
     *
     * @param string $file
     * @param bool $withKey
     * @return bool|string|null
     * @throws \craft\errors\InvalidLicenseKeyException
     */
    public function getAssetUrl(string $file = '', bool $withKey = true)
    {
        if ($this->useCDN) {
            $result = Craft::parseEnv($this->cdnUrl);

            if (!str_ends_with($result, '/')) {
                $result .= '/';
            }

            return $result . $file;
        } else {
            $result = 'https://cdn.creativeorange.nl/article/';

            if ($withKey) {
                // @todo Replace with our own License Key for the CDN
                $licenseKey = Craft::$app->getPlugins()->getPluginLicenseKey('article-craft') ?? 'unlicensed';
            }

            return $result . $file . ($withKey ? '?key=' . urlencode($licenseKey) : '');
        }

    }

}