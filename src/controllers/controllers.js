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

    if (name[0] === ' ') { errors.name = 'The name must begin with a letter' } else if (regexName.test(name)) { errors.name = 'The name can only contain letters and/or spaces' } else if (name.length < 3 || name.length > 50) { errors.name = 'The name must be between 3-50 characters' }

    if (!height.min) { errors.height.min = 'This space cannot be empty' } else if (regexNumber.test(height.min)) { errors.height.min = 'You must write only numbers in this box' } else if (height.min <= 0) { errors.height.min = 'The minimum height of the dog cannot be a negative number or zero' }

    if (regexNumber.test(height.max)) { errors.height.max = 'You must write only numbers in this box' } else if (height.max < 0) { errors.height.max = 'The maximum height of the dog cannot be a negative number' } else if (height.max !== '' && Number(height.min) >= Number(height.max)) { errors.height.max = 'The maximum height cannot be less than or equal to the minimum height' }

    if (!weight.min) { errors.weight.min = 'This space cannot be empty' } else if (regexNumber.test(weight.min)) { errors.weight.min = 'You must write only numbers in this box' } else if (weight.min <= 0) { errors.weight.min = 'The minimum weight of the dog cannot be a negative number or zero' }

    if (regexNumber.test(weight.max)) { errors.weight.max = 'You must write only numbers in this box' } else if (weight.max < 0) { errors.weight.max = 'The maximum weight of the dog cannot be a negative number' } else if (weight.max !== '' && Number(weight.min) >= Number(weight.max)) { errors.weight.max = 'The maximum weight cannot be less than or equal to the minimum weight' }

    if (regexNumber.test(lifeSpan.min) && lifeSpan.min.length) { errors.lifeSpan.min = 'You must write only numbers in this box' } else if (lifeSpan.min < 0 || lifeSpan.min === '0') { errors.lifeSpan.min = 'The minimum years of life of the dog cannot be a negative number or zero' }

    if (regexNumber.test(lifeSpan.max) && lifeSpan.max.length) { errors.lifeSpan.max = 'You must write only numbers in this box' } else if (lifeSpan.max < 0 || lifeSpan.max === '0') { errors.lifeSpan.max = 'The maximum years of life of the dog cannot be a negative number' } else if (lifeSpan.max !== '' && Number(lifeSpan.min) >= Number(lifeSpan.max)) { errors.lifeSpan.max = 'The maximum age cannot be less than or equal to the minimum age' }

    if (!regexURL.test(image) && image.length) { errors.image = 'It must correspond to a URL that starts with https:// and ends with . followed by any image format' }

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
    const newDog = {
      id,
      name: dog.name.includes(' ')
        ? dog.name.split(' ').map(nombre => nombre[0].toUpperCase() + nombre.slice(1).toLowerCase()).join(' ')
        : dog.name[0].toUpperCase() + dog.name.slice(1).toLowerCase(),
      height: dog.height.min + (dog.height.max ? ' - ' + dog.height.max : ''),
      weight: dog.weight.min + (dog.weight.max ? ' - ' + dog.weight.max : ''),
      lifeSpan: dog.lifeSpan.min + (dog.lifeSpan.max ? ' - ' + dog.lifeSpan.max : ''),
      temperament: dog.temperament.map(t => t.id),
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
