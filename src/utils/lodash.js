import lodash from 'lodash'

export const cloneDeep = (data) => {
    return lodash.cloneDeep(data)
}

export const differenceKeyObject = (object1,object2) => {
    const val = lodash.omitBy(object1, (value, key) =>  lodash.isEqual(value, object2[key]));
    return  val
}
export const differenceArray = (arr1,arr2) => {
    const val = lodash.differenceWith(arr1,arr2,lodash.isEqual)
    return  val
}