import { Routes } from '@angular/router';

export const content: Routes = [
    {
        path: 'dashboard',
        loadChildren: () => import('../../components/dashboard/dashboard.module').then(m => m.DashboardModule),
    },
    {
        path: 'utilities',
        loadChildren: () => import('../../components/utility/utility.module').then(m => m.UtilityModule),
        data: {
            breadcrumb: "Tiện ích"
        }
    },
    {
        path: 'products',
        loadChildren: () => import('../../components/products/products.module').then(m => m.ProductsModule),
        data: {
            breadcrumb: "Sản phẩm"
        }
    },
    {
        path: 'sales',
        loadChildren: () => import('../../components/sales/sales.module').then(m => m.SalesModule),
        data: {
            breadcrumb: "Đơn hàng"
        }
    },
    // {
    //     path: 'pages',
    //     loadChildren: () => import('../../components/pages/pages.module').then(m => m.PagesModule),
    //     data: {
    //         breadcrumb: "Pages"
    //     }
    // },
    // {
    //     path: 'media',
    //     loadChildren: () => import('../../components/media/media.module').then(m => m.MediaModule),
    // },
    {
        path: 'menus',
        loadChildren: () => import('../../components/menus/menus.module').then(m => m.MenusModule),
        data: {
            breadcrumb: "Menus"
        }
    },
    {
        path: 'users',
        loadChildren: () => import('../../components/users/users.module').then(m => m.UsersModule),
        data: {
            breadcrumb: "Người dùng"
        }
    },
    {
        path: 'vendors',
        loadChildren: () => import('../../components/vendors/vendors.module').then(m => m.VendorsModule),
        data: {
            breadcrumb: "Shop"
        }
    },
    // {
    //     path: 'localization',
    //     loadChildren: () => import('../../components/localization/localization.module').then(m => m.LocalizationModule),
    //     data: {
    //         breadcrumb: "Localization"
    //     }
    // },
    {
        path: 'settings',
        loadChildren: () => import('../../components/setting/setting.module').then(m => m.SettingModule),
        data: {
            breadcrumb: "Cài đặt"
        }
    },
    {
        path: 'account',
        loadChildren: () => import('../../components/account/account.module').then(m => m.AccountModule),
        data: {
            breadcrumb: "Hoá đơn"
        }
    },
    {
        path: 'shippers',
        loadChildren: () => import('../../components/shippers/shippers.module').then(m => m.ShipperModule),
        data: {
            breadcrumb: "Shipper"
        }
    }
];
