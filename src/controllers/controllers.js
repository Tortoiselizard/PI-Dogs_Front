const regexName = /[^A-Za-zÁ-Úá-úñ ]/
const regexNumber = /[^0-9.]/
const regexURL = /^https:\/\/[^\0]+\.jpg|png$/

module.exports = {
  validate: (inputs) => {
    const errors = {
      name: '',
      height: { min: '', max: '' },
      weight: { min: '', max: '' },
      lifeSpan: { min: '', max: '' },
      image: ''
    }
    const { name, height, weight, lifeSpan, image } = inputs

    if (name[0] === ' ') { errors.name = 'El nombre debe comenzar por una letra' } else if (regexName.test(name)) { errors.name = 'El nombre solo puede contener letras y/o espacios' } else if (name.length < 3 || name.length > 20) { errors.name = 'El nombre debe estar comprendido entre 3-20 caracteres' }

    if (!height.min) { errors.height.min = 'Este espacio no puede estar vacio' } else if (regexNumber.test(height.min)) { errors.height.min = 'Debes escribir solo números en esta casilla' } else if (height.min <= 0) { errors.height.min = 'La altura mínima del perro no puede ser un número negativo o cero' }

    if (regexNumber.test(height.max)) { errors.height.max = 'Debes escribir solo números en esta casilla' } else if (height.max < 0) { errors.height.max = 'La altura máxima del perro no puede ser un número negativo' } else if (height.max !== '' && Number(height.min) >= Number(height.max)) { errors.height.max = 'La altura máxima no puede ser menor o igual a la altura mínima' }

    if (!weight.min) { errors.weight.min = 'Este espacio no puede estar vacio' } else if (regexNumber.test(weight.min)) { errors.weight.min = 'Debes escribir solo números en esta casilla' } else if (weight.min <= 0) { errors.weight.min = 'El peso mínimo del perro no puede ser un número negativo o cero' }

    if (regexNumber.test(weight.max)) { errors.weight.max = 'Debes escribir solo números en esta casilla' } else if (weight.max < 0) { errors.weight.max = 'El peso máxima del perro no puede ser un número negativo' } else if (weight.max !== '' && Number(weight.min) >= Number(weight.max)) { errors.weight.max = 'El peso máximo no puede ser menor o igual al peso mínimo' }

    if (regexNumber.test(lifeSpan.min) && lifeSpan.min.length) { errors.lifeSpan.min = 'Debes escribir solo números en esta casilla' } else if (lifeSpan.min < 0 || lifeSpan.min === '0') { errors.lifeSpan.min = 'Los años mínimos de vida del perro no puede ser un número negativo o cero' }

    if (regexNumber.test(lifeSpan.max) && lifeSpan.max.length) { errors.lifeSpan.max = 'Debes escribir solo números en esta casilla' } else if (lifeSpan.max < 0 || lifeSpan.max === '0') { errors.lifeSpan.max = 'Los años máximos de vida del perro no puede ser un número negativo' } else if (lifeSpan.max !== '' && Number(lifeSpan.min) >= Number(lifeSpan.max)) { errors.lifeSpan.max = 'La edad máxima no puede ser menor o igual a la edad mínima' }

    if (!regexURL.test(image) && image.length) { errors.image = 'Debe corresponder a una URL que comieza con https:// y termine con . seguido de cualquier formato de imagen' }

    return errors
  },
  allGood: (errorObj) => {
    let allGood = true
    for (const error in errorObj) {
      if (typeof (errorObj[error]) === 'string') {
        if (errorObj[error].length) {
          allGood = false
        }
      } else if (typeof (errorObj[error]) === 'object') {
        if (errorObj[error].min.length) {
          allGood = false
        }
        if (errorObj[error].max.length) {
          allGood = false
        }
      }
    }
    return allGood
  },
  prepareRequest: (dog, id, type) => {
    console.log(dog)
    const newDog = {
      id,
      name: dog.name.includes(' ')
        ? dog.name.split(' ').map(nombre => nombre[0].toUpperCase() + nombre.slice(1).toLowerCase()).join(' ')
        : dog.name[0].toUpperCase() + dog.name.slice(1).toLowerCase(),
      height: dog.height.min + (dog.height.max ? ' - ' + dog.height.max : ''),
      weight: dog.weight.min + (dog.weight.max ? ' - ' + dog.weight.max : ''),
      lifeSpan: dog.lifeSpan.min + (dog.lifeSpan.max ? ' - ' + dog.lifeSpan.max : ''),
      temperaments: dog.temperament.map(t => t.id),
      image: dog.image
    }
    const data = {
      method: type,
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(newDog)
    }
    return { data }
  },
  restartState: (initialState, setState) => {
    setState(initialState)
  }
}
