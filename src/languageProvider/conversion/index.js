import english from './raw/eng.js';
import danish from './raw/da.js';

export function getKeys(object) {
  let keys = [];
  let variables = [];
  let text = '';

  Object.keys(object).forEach(key => {
    keys.push(key);
    variables.push(object[key]);
    text += object[key] + '\n';
  });
  // getValues(keys);
  return {
    keys,
    variables,
  };
}

export function getValues(enMessages) {
  const { keys, variables } = getKeys(enMessages);
  const langs = [english, danish];
  const langsNm = ['eng', 'da'];

  langs.forEach((lang, ii) => {
    const translatedDAta = lang.split('\n');
    const obj = {};
    keys.forEach((key, index) => {
      obj[key] = translatedDAta[index + 1];
    });

    console.log(
      langsNm[ii],
      translatedDAta.length,
      keys.length,
      '\n',
      JSON.stringify(obj, null, 2),
    );
  });
}
