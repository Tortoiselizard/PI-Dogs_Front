import { configure, shallow } from "enzyme"
import Adapter from "@wojtekmaj/enzyme-adapter-react-17"
import { NavLink }  from "react-router-dom"
import Nav from "./Nav"
// import React from "react"

configure({adapter: new Adapter()})

describe("Testeando contenido de <Nav />", () => {
    let nav
    beforeEach(() => {
        nav = shallow(<Nav />)
    })
    test("titulo barra de navegación", () => {
        const counterText = nav.find("p").text()
        expect(counterText).toBe("Barra de navegación")
    })
    test("Rutas para moverse en la aplicación", () => {
        const rutas = nav.find(NavLink)
        expect(rutas.find({to:"/home"}).find("button").text()).toBe("Home")
        expect(rutas.find({to:"/dog/create"}).find("button").text()).toBe("New Dog")
    })
})

