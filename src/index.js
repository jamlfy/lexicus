import DICTIONARIES from './dictionaries.json';
import Load from './load.js';

const factoryGet = (dictionaries = DICTIONARIES) => {
  const toUse = DICTIONARIES.filter(({ key, dictionary }) =>
    dictionaries.find((e) => e.key === key && e.dictionary === dictionary),
  );

  return async (language = '', word = '') => {
    const result = await Promise.allSettled(
      toUse
        .filter((e) => e.languages.includes(language))
        .map((dictionary) => Load(language, word, dictionary)),
    );

    return result
      .filter(({ status }) => 'fulfilled' === status)
      .map(({ value }) => value);
  };
};

export default (arg1, arg2, arg3) => {
  if (Array.isArray(arg1)) {
    const getter = factoryGet(arg1);

    if (arg2 && arg3 && typeof arg2 === 'string' && typeof arg3 === 'string') {
      return getter(arg2, arg3);
    }

    return getter;
  }

  if (arg1 && arg2 && typeof arg1 === 'string' && typeof arg1 === 'string') {
    return factoryGet(arg3)(arg1, arg2);
  }

  throw new Error(
    'Use the arguments like `language`, `word`, `dictionaries` (Optional) ',
  );
};
