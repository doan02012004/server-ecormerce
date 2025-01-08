const productConfigurable = {
    name: "Sản phẩm 1",
    slug: "san-pham-1",
    categoryId: "category_id",
    type: "configurable", // simple or configurable,
    options: [
        {
            code: "option1",
            name: "màu sắc",
            image: true,
            value:[
                'Xanh',
                'Đỏ',
                'Tím'
            ]
        },
        {
            code: "option2",
            name: "kích thước",
            image: true,
            value:[
                'M',
                'L',
                'XL',
                'XXL'
            ]
        },
    ],
    models:[
        {
            name:'Xanh,XL',
            _id:'skdjksdjks',
            stock:200,
            price:200000,
            original_price:250000
        }
    ]
};
