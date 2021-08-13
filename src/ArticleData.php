<?php
/**
 * @link https://craftcms.com/
 * @copyright Copyright (c) Pixel & Tonic, Inc.
 * @license MIT
 */

namespace creativeorange\craft\article;

use Craft;
use Twig\Markup;

class ArticleData extends Markup
{

    /**
     * @var string
     */
    private $_rawContent;

    // Public Methods
    // =========================================================================

    /**
     * Constructor
     *
     * @param  string  $content
     * @param  int|null  $siteId
     */
    public function __construct(string $content, int $siteId = null)
    {
        // Save the raw content in case we need it later
        $this->_rawContent = $content;

        // Parse the ref tags
        $content = Craft::$app->getElements()->parseRefs($content, $siteId);

        parent::__construct($content, Craft::$app->charset);
    }

    /**
     * Returns the raw content, with reference tags still in-tact.
     *
     * @return string
     */
    public function getRawContent(): string
    {
        return $this->_rawContent;
    }

    /**
     * Returns the parsed content, with reference tags returned as HTML links.
     *
     * @return string
     */
    public function getParsedContent(): string
    {
        return (string) $this;
    }
}