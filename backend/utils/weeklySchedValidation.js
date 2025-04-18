const allAttributesFilledOrEmptyInList = (list)  => {
    for (const obj of list) {
      if (Object.keys(obj).length === 0) {
        continue; // Object is empty, move to the next object
      }
  
      for (const key in obj) {
        if (obj.hasOwnProperty(key) && obj[key] === '') {
          return false; // At least one attribute in this object is an empty string
        }
      }
    }
  
    return true; // All attributes are filled out or all objects are empty
  }

module.exports = {
    allAttributesFilledOrEmptyInList
}