import { createGlobalStyle } from 'styled-components';
import { colors } from './variables';

export const Global = createGlobalStyle`
  :root,body{
    background-color: ${colors.bg};
    font-size: 16px;
    padding:0;
    margin:0;
    font-family: 'Noto Sans JP', sans-serif;
    letter-spacing:1px;

  }
  .content {
    width:100%;
    padding:60px 5px 0 5px;
  }
  p {
    margin-bottom: 6px;
  }
  .btn {
    background-color: ${colors.prb};
    color: black !important;
    &:hover {
      background-color: ${colors.pr};
      color: black !important;
    }
    &:disabled{
       background-color: ${colors.prdisabled};
      color: black !important;
    }
  }
  .center{
    text-align:center;
  }
  .text-right{
    text-align: right;
  }
  .pointer{
    cursor: pointer;
  }
  .btn-red{
    color: white !important;
    &:hover {
      color: white !important;
    }
  }
  .input{
    font-family: 'Quicksand', sans-serif;
  }
  .float-right{
    float:right
  }
`;
