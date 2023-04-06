import { configure, shallow } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17"
import DogCard from "./DogCard";
import {Link} from "react-router-dom"

configure({adapter: new Adapter()})

describe("Testeando contenido de <DogCard/>", () => {
    let dogCard
    const dog = {
        name: "Affenpinscher",
        image: "https://cdn2.thedogapi.com/images/BJa4kxc4X.jpg",
        temperament: "Stubborn, Curious, Playful, Adventurous, Active, Fun-loving",
        weight: "3 - 6"
    }
    beforeEach(() => {
        dogCard = shallow(<DogCard name={dog.name} image={dog.image} temperament={dog.temperament} weight={dog.weight} />)
    })
    test("test name", () => {
        const nombre = dogCard.find("label").at(0).text()
        expect(nombre).toBe("Affenpinscher")
    })
    test("test image", () => {
        const imagen = dogCard.find("img")
        expect(imagen.find({src: "https://cdn2.thedogapi.com/images/BJa4kxc4X.jpg"}).length).toBe(1)
        expect(imagen.find({alt: "Affenpinscher"}).length).toBe(1)
    })
    test("test temperamento", () => {
        const temperamento = dogCard.find("span").at(0).text()
        expect(temperamento).toBe("Stubborn, Curious, Playful, Adventurous, Active, Fun-loving")
    })
    test("test name", () => {
        const peso = dogCard.find("span").at(1).text()
        expect(peso).toBe("3 - 6")
    })
})

describe("Testeando utilidad <DogCard/>", () => {
    let dogCard
    const dog = {
        name: "Affenpinscher",
        image: "https://cdn2.thedogapi.com/images/BJa4kxc4X.jpg",
        temperament: "Stubborn, Curious, Playful, Adventurous, Active, Fun-loving",
        weight: "3 - 6"
    }
    beforeEach(() => {
        dogCard = shallow(<DogCard name={dog.name} image={dog.image} temperament={dog.temperament} weight={dog.weight} />)
    })
    test("test funcionalidad de la redirección a DogDetail", () => {
        const link = dogCard.find(Link)
        expect(link.length).toBe(1)
        expect(link.find({to: "/dog/Affenpinscher"}).length).toBe(1)
    })    
})