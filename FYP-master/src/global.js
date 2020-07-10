import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
  }
  *, *::after, *::before {
    box-sizing: border-box;
  }
  body {
    display: flex;
    flex-direction: column;
    justify-content: space-between; 
    padding-top: 20px;
    align-items: center;
    background: ${({ theme }) => theme.primaryDark};
    color: ${({ theme }) => theme.primaryWhite};
    height: 100vh;
    text-rendering: optimizeLegibility;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  }
  img {
    border-radius: 5px;
    height: auto;
    width: 10rem;
  }
  div {
    text-align: left;
  }
  small {
    display: block;
  }
  a {
    color: ${({ theme }) => theme.primaryHover};
    text-decoration: none;
  }
  h1 {
    color: ${({ theme }) => theme.primaryWhite};
    font-size: 20px;
  }
  .customFont {
    color: white;
    text-align:center;
  }
  .customFontSmall {
    color: white;
    text-align:left;
  }
  .customFontBlack {
    color: black;
    text-align:left;
  }
  .customHeader {
    font-size: 32px;
    color: white;
    text-align:center;
  }

`