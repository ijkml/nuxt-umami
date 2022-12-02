declare global {
  interface Window {
    umami: Umami
  }
}

export interface ModuleOptions {
  /**
   * Url to the tracking script provided by your Umami setup
   *
   * Example: `http://ijkml.xyz/umami.js`
   */
  scriptUrl: string
  /**
   * Unique identifier provided by Umami
   *
   * Example `3c255b6d-678a-42dd-8074-272ee5b78484`
   */
  websiteId: string
  /**
   * Umami automatically tracks all pageviews and events for you.
   * Set to false to disable this behavior and track events yourself.
   * @default true
   */
  autoTrack?: boolean
  /**
   * Configure Umami to respect the visitor's Do Not Track setting
   * @default false
   */
  doNotTrack?: boolean
  /**
   * Cache some data to improve the performance of the tracking script
   * @default false
   */
  cache?: boolean
  /**
   * Configure the tracker to only run on specific domains.
   *
   * Example: `mywebsite.com, mywebsite2.com`
   */
  domains?: string
  /**
   * By default, Umami will send data to wherever the script is
   * located. You can override this to send data to another location.
   */
  hostUrl?: string

  /**
   * Enable or disable the module
   * @default true
   */

  enable?: boolean
}

export interface Umami {
  /**
   * Sends an event with an event type of custom
   */
  (eventValue: string): void

  /**
   * Track page views.
   *
   * The referrer and website-id values are optional. They will default to
   * the page referrer and data-website-id defined by the script.
   * @param url page being tracked, eg '/about'
   * @param referer
   * @param websiteId
   */
  trackView(url: string, referer?: string, websiteId?: string): void
  /**
   * Tracks an event with a custom event type.
   *
   * The url and website_id values are optional. They will default to
   * the page url and website-id defined by the script.
   * @param eventValue eg 'Super Button Click'
   * @param eventType eg. 'click', 'signup', 'downloads'
   * @param url
   * @param websiteId
   */
  trackEvent(eventValue: string, eventType: string, url?: string, websiteId?: string): void
}
