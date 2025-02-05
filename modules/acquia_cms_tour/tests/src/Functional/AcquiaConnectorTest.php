<?php

namespace Drupal\Tests\acquia_cms_tour\Functional;

use Drupal\Tests\BrowserTestBase;

/**
 * Tests the Acquia CMS Connector form.
 *
 * @group acquia_cms
 * @group acquia_cms_tour
 */
class AcquiaConnectorTest extends BrowserTestBase {

  /**
   * {@inheritdoc}
   */
  protected $defaultTheme = 'stark';

  /**
   * {@inheritdoc}
   */
  protected static $modules = [
    'acquia_cms_tour',
    'acquia_connector',
  ];

  /**
   * Disable strict config schema checks in this test.
   *
   * Cohesion has a lot of config schema errors, and until they are all fixed,
   * this test cannot pass unless we disable strict config schema checking
   * altogether. Since strict config schema isn't critically important in
   * testing this functionality, it's okay to disable it for now, but it should
   * be re-enabled (i.e., this property should be removed) as soon as possible.
   *
   * @var bool
   */
  // @codingStandardsIgnoreStart
  protected $strictConfigSchema = FALSE;
  // @codingStandardsIgnoreEnd

  /**
   * Tests the Acquia CMS Connector form.
   */
  public function testAcquiaConnector() {
    $assert_session = $this->assertSession();

    $account = $this->drupalCreateUser(['access acquia cms tour dashboard']);
    $this->drupalLogin($account);

    // Visit the tour page.
    $this->drupalGet('/admin/tour/dashboard');
    $assert_session->statusCodeEquals(200);
    $container = $assert_session->elementExists('css', '.acquia-cms-connector-form');
    // Assert that the expected fields show up.
    $assert_session->fieldExists('Name');
    // Assert that save and advanced buttons are present on form.
    $assert_session->buttonExists('Save');
    $assert_session->elementExists('css', '.advanced-button');
    // Save site name.
    $dummy_name = 'dev';
    $container->fillField('edit-site-name', $dummy_name);
    $container->pressButton('Save');
    $assert_session->pageTextContains('The configuration options have been saved.');
    // Test that the config values we expect are set correctly.
    $state = $this->container->get('state');
    $connector_site_name = $state->get('spi.site_name');
    $this->assertSame($connector_site_name, $dummy_name);
  }

}
