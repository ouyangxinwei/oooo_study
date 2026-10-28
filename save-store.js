// Storage adapter. Game-state serialization remains in the game layer.
(function (global) {
  function create({ key, version, compatibleVersions = [], legacyKeys = [], validate = () => true }) {
    const acceptedVersions = new Set([version, ...compatibleVersions]);

    function read() {
      try {
        const storage = global.localStorage;
        let sourceKey = key;
        let raw = storage.getItem(key);
        if (!raw) {
          for (const candidate of legacyKeys) {
            raw = storage.getItem(candidate);
            if (raw) { sourceKey = candidate; break; }
          }
        }
        if (!raw) return null;

        const data = JSON.parse(raw);
        if (!data || !acceptedVersions.has(data.version) || !validate(data)) return null;

        if (data.version !== version) {
          const upgraded = { ...data, version };
          storage.setItem(key, JSON.stringify(upgraded));
          if (sourceKey !== key) storage.removeItem(sourceKey);
          return upgraded;
        }
        return data;
      } catch (_error) {
        return null;
      }
    }

    function write(data) {
      try {
        global.localStorage.setItem(key, JSON.stringify(data));
        return true;
      } catch (_error) {
        return false;
      }
    }

    function clear() {
      try {
        const storage = global.localStorage;
        for (const storageKey of new Set([key, ...legacyKeys])) storage.removeItem(storageKey);
        return true;
      } catch (_error) {
        return false;
      }
    }

    return Object.freeze({ read, write, clear });
  }

  global.MoonlitSaveStore = Object.freeze({ create });
})(window);
