import Phaser from 'phaser';
/**
 * @namespace Scenes
 */

/**
 * @memberof Scenes
 */
class Scene extends Phaser.Scene {
  /**
   * Shows an AD on certain distribution platforms
   *
   * @returns {Promise} resolved when the Ad is over, disabled or dismissed
   */
  showAd() {
    const { platformAdapter } = ns;

    if (platformAdapter) {
      return platformAdapter.showAd();
    }

    // if ads are not supported on the current platform
    // we just return an already resolved promise
    return Promise.resolve();
  }

  /**
   * Shows an AD on certain distribution platforms
   *
   * @returns {Promise} resolved when the Ad is rewarded, disabled or dismissed
   */
  showRewardedAd() {
    const { platformAdapter } = ns;

    if (platformAdapter) {
      return platformAdapter.showRewardedAd();
    }

    // if ads are not supported on the current platform
    // we just return an already resolved promise
    return Promise.resolve();
  }

  /**
   * Waits the given milliseconds and resolves the promise that is returned
   *
   * @param {number} milliseconds
   * @returns {Promise}
   */
  wait(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }
}

export default Scene;
