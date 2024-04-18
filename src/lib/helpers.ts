export const updateEmptyStringToNull = (obj: any): any => {
  let objCopy: any = {}
  for (let val in obj) {
    if (obj[val] === '') {
      objCopy[val] = null
    } else {
      objCopy[val] = obj[val]
    }
  }
  return objCopy
}
