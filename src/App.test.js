// import React from "react"
// import ReactDOM from "react-dom"
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
// import {configure, shallow} from "enzyme"
// import Adapter from "@wojtekmaj/enzyme-adapter-react-17"
// import App from './App';
import MainPage from "./components/MainPage/MainPage"

// configure({adapter: new Adapter()})
// test('renders learn react link', () => {
//   render(<App />);
//   screen.debug()
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });

test('render content', () => {
  // const component = render(<Provider><MainPage/></Provider>);
  // const component = render(<MainPage/>)
  // screen.debug()
  // console.log(component)

  // const div = document.createElement("div")
  // ReactDOM.render(<App />, div)
  // const linkElement = screen.getByText(/en/);
  // expect(linkElement).toBeInTheDocument();
})


// it("Renderizar el componente", () => {
//   const wrapperApp = shallow(<App />)
//   expect(wrapperApp).toBeTruthy()
// })