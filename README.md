<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
<!-- [![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url] -->



<!-- PROJECT LOGO -->
<br />
<p align="center">
  
  <img src="readme/images/logo-mapbix2.PNG" alt="Logo" >

  <h1 align="center">Mapbix</h1>

  <p align="center">
    Mapa integrado a API do Zabbix, mostrando geograficamente a localização e os problemas de cada grupo de hosts.
    <br />
    <br />
    
  </p>
</p>

![Tela Inicial][product-screenshot]



<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Conteúdo</summary>
  <ol>
    <li>
      <a href="#sobre-o-projeto">Sobre o projeto</a>
      <ul>
        <li><a href="#construído-com">Construído com</a></li>
      </ul>
    </li>
    <li>
      <a href="#Iniciando">Iniciando</a>
      <ul>
        <li><a href="#Pré-requisitos">Pré-requisitos</a></li>
        <li><a href="#Instalação-Local">Instalação Local</a></li>
        <li><a href="#Instalação-via-container">Instalação via container</a></li>
      </ul>
    </li>
    <li><a href="#Uso">Uso</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#Licença">Licença</a></li>
    <li><a href="#Contato">Contato</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## Sobre o projeto

A principal característica da aplicação é a exibição das informações do Zabbix de uma forma geograficamente distribuída. É possível cadastrar os grupos de hosts do Zabbix que serão exibidos e atribuir coordenadas de latitude e longitude. Além disso é permitido especificar o host principal do grupo e os itens que representam o tráfego de upload/download bem como a disponibilidade relacionada a perda de pacotes/tempo de resposta de cada grupo.

![Tela cadastro grupo][product-form-screenshot]

![Tela lista grupos cadastrados][product-table-screenshot]

O host principal é, por exemplo, um roteador ou switch que fornece conexão externa do grupo. Desta forma, quando há um problema neste equipamento com a severidade “Desastre”, o mapa exibe um alerta piscante para chamar a atenção. Já os itens relativos ao tráfego e disponibilidade são utilizados para a montagem dos gráficos de banda e disponibilidade de cada grupo. 

Após o cadastro os grupos são apresentados na "Lista de Grupos", acessível através do segundo botão na barra superior. São exibidos o nome e um indicador da severidade de host mais grave encontrada dentro daquele grupo.

![Tela lista grupos][product-grouplist-screenshot]

Ao clicar em um item da lista, o mapa é apontado automáticamente para localização do grupo. São exibidas também a lista de todos os problemas, gráficos e informações.

![Tela informações do grupo][product-groupinfo-screenshot]

O mapa consulta a API do zabbix a cada minuto, obtendo assim as informações referentes aos hosts e triggers, de acordo com os grupos configurados. Desta forma a aplicação faz somente requisições ao zabbix através do back-end, salvando as informações em uma espécie de cache. Com isso ao abrir o mapa no navegador, a aplicação cliente consulta os dados do cache, ao invés de fazer uma requisição direta à API do Zabbix.


### Construído com

Os principais frameworks e bibliotecas utilizados foram os seguintes:

* [React](https://pt-br.reactjs.org/)
* [Mapbox](https://www.mapbox.com/)
* [Next.js](https://nextjs.org/)
* [NextAuth](https://next-auth.js.org/)
* [Grommet UI](https://v2.grommet.io/)
* [Immer](https://immerjs.github.io/immer/)
* [Joi](https://joi.dev/)
* [Lodash](https://lodash.com/)
* [React-Query](https://react-query.tanstack.com/)
* [Recharts](https://react-query.tanstack.com/)
* [React-Map-Gl](https://visgl.github.io/react-map-gl/)
* [Axios](https://axios-http.com/)



<!-- GETTING STARTED -->
## Iniciando

Para rodar e configurar uma cópia local da aplicação siga os seguintes passos:

### Pré-requisitos

 - Antes de tudo é necessário um ambiente Zabbix. Se você não possui um ambiente funcional, uma alternativa é a utilização das [imagens Docker](https://github.com/zabbix/zabbix-docker) disponibilizadas pela própria Zabbix SIA. Um completo passo a passo da instalação e utilização pode ser vista neste [artigo](https://blog.zabbix.com/zabbix-docker-containers/7150/).

 - A aplicação pode ser instalada através de containers Docker. São disponibilizados arquivos docker-compose e Dockerfile que descrevem o processo de build das imagens e inicialização do container. Desta forma se faz necessário a [instalação](https://docs.docker.com/engine/install/) prévia do Docker Engine, de acordo com o seu sistema operacional.

 - Outra maneira possível é a instalação local da aplicação. Assim, como prerequisitos serão necessários [Node.js versão 14.06](https://nodejs.org/pt-br/download/package-manager/) ou superior e o gerenciador de pacotes [Yarn](https://classic.yarnpkg.com/en/docs/install/#windows-stable).


### Instalação Local

Considerando que o Node.js e Yarn já estão instalados.

1. Clonar o repositório;
   ```sh
   git clone https://github.com/rockchico/mapbix.git
   ```

3. Instalar pacotes;
   ```sh
   cd mapbix
   yarn install
   ```

4. Configurar .env;

- Faça uma cópia do .env.exemplo para .env.production

   ```sh
   cp .env.exemplo .env.production
   ```


- Criar token Mapbox e configurar mapa.<br />
Criar uma conta no site [Mapbox](https://www.mapbox.com/) e obter um token de acesso. Após o cadastro no site, na sessão Tokens de Acesso é possível criar um novo token para utilização. 

  ```dosini
  MAPBOX_TOKEN=<token mapbox>
  ```

- Informar o ponto central, latitude e longitude no formato graus e decimais do grau, onde o mapa deve ser centralizado;

  Ex: latitude: -14.235004 e longitude: -51.925282

  ```dosini
  MAP_CENTER_LATITUDE=<latitude>
  MAP_CENTER_LONGITUDE=<longitude>
  ```

- Setar a porta que a aplicação deve ouvir e o nome que será exibido na barra superior do mapa;

  ```dosini
  PORT=
  APP_NAME=
  ```

- Configurar o usuário e senha para login na aplicação. 

  ```dosini
  APP_USER=mapbix
  APP_PASSWORD=mapbix
  ```

- Especificar [NEXTAUTH_URL](https://next-auth.js.org/configuration/options#nextauth_url) com o URL canônica do site em produção e a [NEXTAUTH_JWT_SECRET](https://next-auth.js.org/v3/configuration/options#secret), string utilizada para fazer o hash dos tokens, assinar cookies e gerar as chaves criptográficas.

  ```dosini
  NEXTAUTH_URL=http://localhost:3030
  NEXTAUTH_JWT_SECRET=d879f9ddb3e6e178cfa0d4c425265852
  ```

- Por fim é ncessário informar dados de acesso a API do Zabbix

  ```dosini
  ZABBIX_API_URL=http://<servidor>:<porta>/api_jsonrpc.php
  ZABBIX_API_USER=<user>
  ZABBIX_API_PASSWORD=<senha>
  ```

- É possível ainda especificar um filtro de grupos, para limitar o uso dentro da aplicação.

  Ex: Busca somente grupos cujo nome inicia por Matriz ou Filial

  ```dosini
  ZABBIX_API_GROUPS_SEARCH=Matriz*,Filial*
  ```

5. Gerar um build da aplicação

  ```sh
  yarn build
  ```

6. Iniciar o servidor

  ```sh
  yarn start-server
  ```


  Após este processo o Mapbix pode acessado usando http://< host >:< porta > 


### Instalação via container

Considerando que o docker engine já está instalados.

1. Clonar o repositório;
   ```sh
   git clone https://github.com/rockchico/mapbix.git
   ```

2. Configurar os parâmetros do .env, conforme o item 4. da seção anterior.

3. Rodar a aplicação ;
  ```sh
  cd mapbix
  docker-compose -f docker-compose.prod.yml --env-file .env.production up
  ```

<!-- USAGE EXAMPLES -->
## Uso

Segue um pequeno vídeo mostrando a criação de um grupo no zabbix e como fazer com que ele seja exibido no Mapbix.



https://user-images.githubusercontent.com/17732925/134019937-cb68e64f-7f6f-470c-80a8-6ff66089b47e.mp4



Primeiramente é criado o grupo "Filial Estrela" (Estrela é a minha cidade natal :blush: ) no Zabbix e em seguida o host "Roteador_Estrela" é associado a este grupo.

A partir disto, no Mapbix, já é possível cadastrar este grupo para exibição no mapa. Após efetuar login na aplicação, com as credenciais informadas nos parâmetros de configuração APP_USER e APP_PASSWORD, clicamos em "ADICIONAR GRUPO".

No formulário de cadastro são informados o grupo, o host principal, os itens referentes ao histórico dos gráficos e as informações de latitude e longitude.

Feito isso, o grupo já está registrado. Basta agurdar a sincronização do cache, em torno de 1m, para que o grupo seja exibido no Mapbix.



<!-- ROADMAP -->
## Roadmap

* Tradução para o Inglês;
* Migrar o código para TypeScript;
* Autenticar acesso da aplicação através da API Zabbix.
* Permitir a configuração da quantidade de valores do histórico que são utilizadas para montagem dos gráficos
* Permitir a configuração do tempo de atualização do cache Mapbix
* Ao excluir um grupo no Zabbix, removê-lo do Mapbix se ele estiver cadastrado
* Melhorar o tratamento de erros da aplicação


<!-- LICENSE -->
## Licença

[MIT](/LICENSE) &copy; Rockchico



<!-- CONTACT -->
## Contato

Se você curtiu o projeto e gostaria de fazer alguma personalização ou adaptação para o seu ambiente de monitoramento, segue aí o meu contato:

Francisco Schwertner - rockchico@gmail.com

<a href="https://github.com/rockchico/mapbix/issues">Requisitar funcionalidades / Reportar Bugs</a>






<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=for-the-badge
[contributors-url]: https://github.com/othneildrew/Best-README-Template/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=for-the-badge
[forks-url]: https://github.com/othneildrew/Best-README-Template/network/members
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=for-the-badge
[stars-url]: https://github.com/othneildrew/Best-README-Template/stargazers
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=for-the-badge
[issues-url]: https://github.com/othneildrew/Best-README-Template/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/othneildrew

[product-screenshot]: readme/images/tela-inicial.png
[product-form-screenshot]: readme/images/tela-confgroup-form.png
[product-table-screenshot]: readme/images/tela-confgroup-table.png
[product-grouplist-screenshot]: readme/images/tela-grouplist.png
[product-groupinfo-screenshot]: readme/images/tela-groupinfo.png
[product-groupinfo-graficos-screenshot]: readme/images/tela-groupinfo-graficos.png
[product-groupinfo-informacoes-screenshot]: readme/images/tela-groupinfo-informacoes.png
