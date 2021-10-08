<?php
/**
 * (c) 2021 Creativeorange B.V.
 */

namespace creativeorange\craft\article\models;

use Craft;
use craft\base\Model;
use GuzzleHttp\Client;
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

    public $cdnToken = null;

    /**
     * API Keys can be set in environment variable. Therefore
     * we need to parse the keys on retrieval.
     *
     * @param  string  $file
     * @param  bool  $withKey
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

            return $result.$file;
        } else {
            $result = 'https://cdn.creativeorange.eu/article/2.3.x/';

            if ($withKey) {
                $token = $this->getCDNToken();
            }

            return $result.$file.($withKey ? '?key='.urlencode($token) : '');
        }
    }

    /**
     * @return bool
     * @throws \GuzzleHttp\Exception\GuzzleException
     * @throws \yii\base\ExitException
     */
    public function getCDNToken()
    {
        return $this->cdnToken ?? $this->generateCDNToken();
    }

    /**
     * @throws \GuzzleHttp\Exception\GuzzleException
     * @throws \yii\base\ExitException
     */
    public function generateCDNToken()
    {
        try {
            $craftArticle = Craft::$app->getPlugins()->getPlugin('craft-article');
            $client = new Client();
            $response = $client->post('https://license.creativeorange.eu/api/new/article', [
                'form_params'      => ['name' => 'craft-article.'.Craft::$app->getPlugins()->getPlugin('craft-article')->getVersion()],
                'force_ip_resolve' => 'v4',
            ]);

            $cdnToken = $response->getBody();
            if (!empty($cdnToken)) {
                $this->cdnToken = (string) $cdnToken;

                Craft::$app->getPlugins()->savePluginSettings($craftArticle, ['cdnToken' => (string) $cdnToken]);
            }
            return $this->cdnToken;
        } catch (\Exception $e) {
            return 'unknown';
        }
    }


}