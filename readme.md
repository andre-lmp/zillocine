## ZilloCine - Plataforma web de Filmes

### Sobre o Projeto

![imagem inicial da aplicação](./src/app/images/home_img.png)

Zillo Cine é uma plataforma web de filmes, séries e animes, criada especialmente para os fãs de conteúdo virtual. Seu objetivo é oferecer uma experiência de streaming de filmes familiar e fácil de navegar, permitindo que os usuários busquem informações sobre seus filmes favoritos de maneira eficiente.

O projeto consiste em seis páginas principais:

- **Inicio**: Apresenta destaques, recomendações e acesso rápido às principais categorias.

- **Filmes**: Uma seção dedicada exclusivamente a filmes, onde os usuários podem explorar uma ampla gama de títulos.

- **Séries**: Similar à seção de filmes, mas focada em séries de televisão, permitindo aos usuários encontrar suas séries favoritas e descobrir novas.

- **Pesquisa**: Página onde o usuario pode realizar buscas por filmes, series ou animes de sua escolha.

- **Player**: Esta página hospeda o player de mídia, onde os usuários podem assistir a trailers de filmes e séries após escolherem um título.

- **Conta**: Uma seção personalizada onde os usuários podem gerenciar suas contas.

- **Auth**: Página de autenticação, que permite aos usuários se registrarem como tambem realizem login com suas contas.

## Tecnologias Utilizadas

### Linguagens e Frameworks

- HTML5
- CSS3
- JavaScript (ES6+)
- React JS
- Fetch API

### Bibliotecas e Ferramentas

- React Icons
- React Router DOM
- Firebase
- Swiper Slides
- Vite (Ferramenta de Build)

## Como Rodar o Projeto

Para rodar o projeto localmente, siga os passos abaixo:

1. Consiga uma chave de API gratuita em [https://www.themoviedb.org/](https://www.themoviedb.org/)
2. Clone o repositorio
   ```sh
   git clone https://github.com/888888b/Plataforma_filmes.git
   ```
3. Instale os pacotes via NPM
   ```sh
   npm install
   ```
4. Defina sua chave de API em `src/app/shared-components/context-api/tmdb-context/context.jsx/`
   ```js
   const apiKey = 'Sua API aqui';
   ```

5. Inicie o servidor de desenvolvimento
    ```sh
    npm run dev
    ```

O projeto agora deve estar acessível no seu navegador local.

## deploy da aplicação

- Página: https://plataforma-filmes-three.vercel.app/