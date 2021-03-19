import * as config from 'config';

const isObject = (thing: any) => typeof thing === 'object' && thing !== null;

/**
 * @Version 0.0.1
 */
export default class ConfigManagement {
  private static configDataDictionary = {};

  public static extractConfigVariables(ymlHead: string): any {
    if (!this.configDataDictionary.hasOwnProperty(ymlHead)) {
      const prefabData = config.get(ymlHead);
      if (!isObject(prefabData)) return {}; // return empty object because the extracted value is null/undef (is not an object)
      Object.assign(this.configDataDictionary, { [ymlHead]: prefabData });
    }
    return this.configDataDictionary[ymlHead];
  }
  public static legacyGet(key: string): any {
    return config.get(key);
  }
}
