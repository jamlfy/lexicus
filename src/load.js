import cheerio from 'cheerio';

export const getInfo = async (html, { htmlSections = '', splitText }) => {
  let data = [];
  const $ = await cheerio.load(html);

  for (const htmlSection of htmlSections) {
    const selectedContent = $(htmlSection);
    for (const content of selectedContent) {
      const list = $(content)
        .html()
        .replace(/<(?:.|\n)*?>/gm, '\n')
        .split('\n')
        .map((e) => e.split(splitText))
        .flat(Infinity)
        .map((e) => e.trim())
        .filter((e) => e && e.length > 2);

      data = [...new Set([...data, ...list])];
    }
  }

  if (data.length === 0) {
    throw new Error('Don`t found content');
  }

  return data;
};

export default async (language, word, { key, url, dictionary, ...rest }) => {
  const data = await fetch(
    url.replace(
      /\%[A-Z]{3,4}\%/gim,
      (e) =>
        ({
          '%WORD%': word,
          '%LANG%': language,
        })[e],
    ),
  ).then((e) => e.text());

  const list = await getInfo(data, rest);

  return {
    word,
    language,
    dictionary,
    [key]: list,
  };
};
