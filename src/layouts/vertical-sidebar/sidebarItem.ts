export interface menu {
    header?: string;
    title?: string;
    icon?: any;
    to?: string;
    chip?: string;
    BgColor?: string;
    chipBgColor?: string;
    chipColor?: string;
    chipVariant?: string;
    chipIcon?: string;
    children?: menu[];
    disabled?: boolean;
    type?: string;
    subCaption?: string;
    external?: boolean;
}

const sidebarItem: menu[] = [

    {
        title: 'Dashboard',
        icon: 'widget-add-line-duotone',
        to: '/'
    },
    {
        title: 'Orders',
        icon: 'cart-3-line-duotone',
        to:'/OrderManagement',

    },
    {
        title: 'Products',
        icon: 'cart-3-line-duotone',
        to: '/Products',
        children:[
             {
                title: 'Product Management',
                icon: 'cart-3-line-duotone',
                to: '/Products/',
            },
            {
                title:'Category Management',
                icon:'cart-3-line-duotone',
                to:'/Category'
            },
            {
                title:'Customization Management',
                icon:'cart-3-line-duotone',
                to:'/Customization'
            },
           
        ]

    },
   
   
   
    // {
    //     title: 'Promotions',
    //     icon: 'shield-user-line-duotone',
    //     to: '/promotions',
    //     children:[{
    //         title: 'Promotion Management',
    //         to: '/Promotions',
    //         icon:  'shield-user-line-duotone',
    //     },
    //      {
    //             title:'Coupon Management',
    //             to:'/Coupons',
    //             icon:  'widget-add-line-duotone'
    //         },
    // ]
    // },
    // {
    //     title: 'Customers',
    //     icon:'shield-user-line-duotone',
    //     to:'',
    //     children:[{
    //         title: 'Customer Management',
    //         to:'/Customer',
    //         icon: 'shield-user-line-duotone',

    //     },
    //     {
    //         title:'Coupon Management',
    //         to:'/Coupone Management',
    //         icon: 'shield-user-line-duotone',

    //     }
    // ]
    // },
    {
        title: 'Settings',
        icon: 'shield-user-line-duotone',
        children:[
        //     {
        //     title:' User Management',
        //     icon:'shield-user-line-duotone',
        //     to: '/customer',
        // },
        // {
        //     title: 'Section Management',
        //     icon: 'shield-user-line-duotone',
        //     to: '',

        // },
        {   
                title: 'Banner Management',
                to: '/Banners',
                icon: 'cart-3-line-duotone',
        },

        // {
        //     title: 'Language Management',
        //     icon: 'shield-user-line-duotone',
        //     to: '',
        // },
        {
            title: 'Table Management',
            icon: 'shield-user-line-duotone',
            to: '/tables',
        } 
    ]},

    {
        title: 'Feedbacks',
        icon: 'user-plus-rounded-line-duotone',
        to: '/Feedbacks'
    },
    




];

export default sidebarItem;
