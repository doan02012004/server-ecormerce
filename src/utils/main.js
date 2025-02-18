export const calculateVolume = (height,width,length) =>{
    return height * width * length
}

export const calculateDiscount= (original_price,price) =>{
    const percent = (original_price - price) /original_price *100
    return  Math.ceil(percent)
}

export const calculateTotalStock= (data) =>{
    if(!data && data.length==0){
        return 0
    }
    return  data.reduce((sum,item) => sum + item.stock,0)
}

export const getLinkProductByTypeView = (type='wed',slug) => {
    if(type=='admin'){
        return `/admin/products/edit/${slug}`
    }
     return `/sanpham/${slug}`

}
export const getModelProductByPriceMin= (data) =>{
    if(!data && data.length==0){
        return null
    }
    return  data.reduce((item,currentValue) => {
        if(currentValue.price > item.price){
            return item
        }
        return currentValue
    },{})
}
