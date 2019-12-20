import config from "config";

export const AppConfig = {
  get(key: string, defaultValue?: any) {
    return config.has(key) ? config.get(key) : defaultValue;
  }
};
