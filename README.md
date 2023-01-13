# Search CPF

### Com esta aplicação você pode consultar a situação de um CPF.

Para isto você deverá seguir os passos seguintes:

1- Fazer o dowload desta branch

```bash
wget https://github.com/maaschmidt/Web-Scraping/archive/refs/heads/search-cpf.zip
```

2- Extrair em seu diretório de preferencia

```bash
unzip search-cpf.zip
```

3- Instalar as dependencias

```bash
npm install
```

4- Inserir o CPF a ser consultado no arquivo src/index.js

```javascript
62 ...
63 main('CPF AQUI')
64

// Exemplo:
62 ...
63 main('12345678901')
64
```
ps: O CPF a ser consultado é de sua responsabilidade

5- Rode a aplicação

```bash
npm run start
```

## Resultado esperado é um print screen da situação do CPF consultado.