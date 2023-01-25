# Certidão Nada Consta

### Com esta aplicação você pode consultar a Certidão Nada Consta de um CPF ou CNPJ.

Para isto você deverá seguir os passos seguintes:

1- Fazer o dowload desta branch

```bash
wget https://github.com/maaschmidt/Web-Scraping/archive/refs/heads/07-nada-consta.zip
```

2- Extrair em seu diretório de preferencia

```bash
unzip 07-nada-consta.zip
```

3- Acessar a pasta extraida
```bash
cd Web-Scraping-07-nada-consta/
```

4- Instalar as dependencias

```bash
npm install
```

6- Inserir as informações a serem consultadas no arquivo ./index.ts

```typescript
// Para pesquisar uma pessoa fisica(PF)
main('<NOME COMPLETO>', '<CPF>', '<NOME DA MÃE>', '<DATA DE NASCIMENTO>');

// Para pesquisar uma pessoa jurídica(PJ)
main('<RAZÃO SOCIAL>', '<CNPJ>', '<TIPO?(civel ou criminal)>');

```

7- Inicie a aplicação

```bash
npm run start
```

## Resultado esperado é o console log da situação da PF ou da PJ, mais o tempo de consulta