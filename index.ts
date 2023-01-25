import { checkPF } from './src/checkPF';
import { checkPJ } from './src/checkPJ';

const main = async (name: string, doc: string, motherName?: string, birthDate?: string, type?: string) => {
  let result: any = '';
  console.time('queryTime');

  if (doc.length === 11) {
    result = await checkPF(name, doc, motherName, birthDate);
    console.log(result);
  } else if (doc.length === 14) {
    result = await checkPJ(name, doc, type);
    console.log(result);
  }

  console.timeEnd('queryTime');
};

main('<NOME COMPLETO>', '<CPF>', '<NOME DA MÃE>', '<DATA DE NASCIMENTO>');

// main('<RAZÃO SOCIAL>', '<CNPJ>', '<TIPO?(civel ou criminal)>');