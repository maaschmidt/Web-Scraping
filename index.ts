import { checkPF } from './src/checkPF';
import { checkPJ } from './src/checkPJ';

const main = async (doc: string) => {
  let result: any
  console.time('queryTime');

  if (doc.length === 11) {
    result = await checkPF(doc);
  } else if (doc.length === 14) {
    result = await checkPJ('<CNPJ>');
  }

  console.timeEnd('queryTime');
  console.log(result);
};

main('<DOCUMENTO>');// Substituir <DOCUMENTO> pelo CPF ou CNPJ a ser consultado
