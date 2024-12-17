import {NextResponse} from "next/server";
import {
    LuBoxes,
    LuFlagTriangleRight,
    LuIndent,
    LuLayoutDashboard, LuLock,
    LuMap,
    LuMapPin,
    LuUserCog,
    LuUsers
} from "react-icons/lu";

const data = [
    {
        id: 1,
        name: 'Main',
        menus: [
            {
                id: 1,
                name: 'Dashboard',
                icon: 'LuLayoutDashboard',
                link: '/cms/v1/dashboard'
            },
            {
                id: 2,
                name: 'Customers',
                icon: 'LuUsers',
                link: '/cms/v1/customers'
            },
            {
                id: 3,
                name: 'Orders',
                icon: 'LuIndentIncrease',
                link: '/cms/v1/order'
            },
            {
                id: 4,
                name: 'Route',
                icon: 'LuMap',
                link: '/cms/v1/order-route'
            },
        ]
    },
    {
        id: 2,
        name: 'Masterdata',
        menus: [
            {
                id: 1,
                name: 'Products',
                icon: 'LuBoxes',
                link: '/cms/v1/ms/products'
            },
            {
                id: 2,
                name: 'Locations',
                icon: 'LuMapPin',
                link: '/cms/v1/ms/order-route'
            },
            {
                id: 3,
                name: 'Product Category',
                icon: 'LuFlagTriangleRight',
                link: '/cms/v1/ms/product_category'
            }
        ]
    },
    {
        id: 3,
        name: 'Setting',
        menus: [
            {
                id: 1,
                name: 'Admin',
                icon: 'LuUserCog',
                link: '/cms/v1/am/admins'
            },
            {
                id: 2,
                name: 'Privilege',
                icon: 'LuLock',
                link: '/cms/v1/am/privileges'
            }
        ]
    },


]

export async function GET() {

    return NextResponse.json({status: 200, message: 'success', data: data})
}