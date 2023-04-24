import { HostListener, Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WINDOW } from "./windows.service";

// Menu
export interface Menu {
    path?: string;
    title?: string;
    icon?: string;
    type?: string;
    badgeType?: string;
    badgeValue?: string;
    active?: boolean;
    bookmark?: boolean;
    children?: Menu[];
}

@Injectable({
    providedIn: 'root'
})

export class NavService {

    public screenWidth: any
    public collapseSidebar: boolean = false
    public roleName: string = localStorage.getItem('user-role');
    public items: BehaviorSubject<Menu[]>;

    constructor(@Inject(WINDOW) private window) {
        this.onResize();
        if (this.screenWidth < 991) {
            this.collapseSidebar = true
        }
        this.updateMenuItems();
    }

    private updateMenuItems() {
        if (this.roleName == 'ROLE_ADMIN') {
            this.items = new BehaviorSubject<Menu[]>(this.MENUITEMS);
        }
        else {
            this.items = new BehaviorSubject<Menu[]>(this.SHOP_ITEMS);
        }
    }

    // Windows width
    @HostListener("window:resize", ['$event'])
    onResize(event?) {
        this.screenWidth = window.innerWidth;
    }

    MENUITEMS: Menu[] = [
        {
            path: '/dashboard/default',
            title: 'Bảng điều khiển',
            icon: 'home',
            type: 'link',
            badgeType: 'primary',
            active: false
        },
        {
            title: 'Sản phẩm', icon: 'box', type: 'sub', active: false, children: [
                { path: '/products/product-list', title: 'Danh sách', type: 'link' },
                // {path: '/products/product-detail', title: 'Product Detail', type: 'link'},
                // {path: '/products/physical/sub-category', title: 'Sub Category', type: 'link'},
                { path: '/products/add-product', title: 'Thêm sản phẩm', type: 'link' },
                { path: '/products/category', title: 'Thể loại', type: 'link' },
                // {path: '/products/add-product-category', title: 'Add Product Category', type: 'link'},
            ]
        },
        // {
        //     title: 'Physical', type: 'sub', children: [
        //         {path: '/products/physical/category', title: 'Category', type: 'link'},
        //         {path: '/products/physical/sub-category', title: 'Sub Category', type: 'link'},
        //         {path: '/products/physical/product-list', title: 'Product List', type: 'link'},
        //         {path: '/products/physical/product-detail', title: 'Product Detail', type: 'link'},
        //         {path: '/products/physical/add-product', title: 'Add Product', type: 'link'},
        //     ]
        // },
        // {
        //     title: 'digital', type: 'sub', children: [
        //         {path: '/products/digital/digital-category', title: 'Category', type: 'link'},
        //         {path: '/products/digital/digital-sub-category', title: 'Sub Category', type: 'link'},
        //         {path: '/products/digital/digital-product-list', title: 'Product List', type: 'link'},
        //         {path: '/products/digital/digital-add-product', title: 'Add Product', type: 'link'},
        //     ]
        // },
        {
            title: 'Đơn hàng', icon: 'dollar-sign', type: 'sub', active: false, children: [
                { path: '/sales/orders', title: 'Danh sách', type: 'link' },
                // { path: '/sales/transactions', title: 'Giao dịch', type: 'link' },
            ]
        },
        // {
        //     title: 'Coupons', icon: 'tag', type: 'sub', active: false, children: [
        //         {path: '/coupons/list-coupons', title: 'List Coupons', type: 'link'},
        //         {path: '/coupons/create-coupons', title: 'Create Coupons', type: 'link'},
        //     ]
        // },
        // {
        //     title: 'Pages', icon: 'clipboard', type: 'sub', active: false, children: [
        //         {path: '/pages/list-page', title: 'List Page', type: 'link'},
        //         {path: '/pages/create-page', title: 'Create Page', type: 'link'},
        //     ]
        // },
        // {
        //     title: 'Media', path: '/media', icon: 'camera', type: 'link', active: false
        // },
        // {
        //     title: 'Menus', icon: 'align-left', type: 'sub', active: false, children: [
        //         { path: '/menus/list-menu', title: 'Menu Lists', type: 'link' },
        //         { path: '/menus/create-menu', title: 'Create Menu', type: 'link' },
        //     ]
        // },
        {
            title: 'Tài khoản', path: '/account', icon: 'user', type: 'link', active: false
        },
        {
            title: 'Người dùng', icon: 'user-plus', type: 'sub', active: false, children: [
                { path: '/users/list', title: 'Danh sách', type: 'link' },
                { path: '/users/create', title: 'Tạo người dùng', type: 'link' }
            ]
        },
        {
            title: 'Người bán hàng', icon: 'users', type: 'sub', active: false, children: [
                { path: '/vendors/list', title: 'Danh sách', type: 'link' },
                { path: '/vendors/create', title: 'Tạo người bán', type: 'link' }
            ]
        },
        {
            title: 'Shipper', icon: 'archive', type: 'sub', active: false, children: [
                { path: '/shippers/list', title: 'Danh sách', type: 'link' },
                { path: '/shippers/create', title: 'Tạo shipper', type: 'link' }
            ]
        },
        {
            title: 'Tiện ích', icon: 'align-left', type: 'sub', active: false, children: [
                { path: '/utilities/list-address', title: 'Địa chỉ', type: 'link' },
                { path: '/utilities/list-slider', title: 'Slider', type: 'link' }
            ]
        },
        // {
        //     title: 'Localization', icon: 'chrome', type: 'sub', children: [
        //         {path: '/localization/translations', title: 'Translations', type: 'link'},
        //         {path: '/localization/currency-rates', title: 'Currency Rates', type: 'link'},
        //         {path: '/localization/taxes', title: 'Taxes', type: 'link'},
        //     ]
        // },
        // {
        //     title: 'Báo cáo', path: '/reports', icon: 'bar-chart', type: 'link', active: false
        // },
        // {
        //     title: 'Cài đặt', icon: 'settings', type: 'sub', children: [
        //         { path: '/settings/profile', title: 'Trang cá nhân', type: 'link' },
        //     ]
        // }
        // {
        //     title: 'Login', path: '/auth/login', icon: 'log-in', type: 'link', active: false
        // }
    ]

    SHOP_ITEMS: Menu[] = [
        {
            path: '/dashboard/default',
            title: 'Bảng điều khiển',
            icon: 'home',
            type: 'link',
            badgeType: 'primary',
            active: false
        },
        {
            title: 'Sản phẩm', icon: 'box', type: 'sub', active: false, children: [
                { path: '/products/add-product', title: 'Thêm sản phẩm', type: 'link' },
                { path: '/products/product-list', title: 'Sản phẩm của bạn', type: 'link' }
                // {path: '/products/product-detail', title: 'Product Detail', type: 'link'},
                // {path: '/products/physical/sub-category', title: 'Sub Category', type: 'link'},
                // {path: '/products/add-product-category', title: 'Add Product Category', type: 'link'},
            ]
        },
        // {
        //     title: 'Physical', type: 'sub', children: [
        //         {path: '/products/physical/category', title: 'Category', type: 'link'},
        //         {path: '/products/physical/sub-category', title: 'Sub Category', type: 'link'},
        //         {path: '/products/physical/product-list', title: 'Product List', type: 'link'},
        //         {path: '/products/physical/product-detail', title: 'Product Detail', type: 'link'},
        //         {path: '/products/physical/add-product', title: 'Add Product', type: 'link'},
        //     ]
        // },
        // {
        //     title: 'digital', type: 'sub', children: [
        //         {path: '/products/digital/digital-category', title: 'Category', type: 'link'},
        //         {path: '/products/digital/digital-sub-category', title: 'Sub Category', type: 'link'},
        //         {path: '/products/digital/digital-product-list', title: 'Product List', type: 'link'},
        //         {path: '/products/digital/digital-add-product', title: 'Add Product', type: 'link'},
        //     ]
        // },
        {
            title: 'Đơn hàng', icon: 'dollar-sign', type: 'sub', active: false, children: [
                { path: '/sales/orders', title: 'Danh sách', type: 'link' },
                { path: '/sales/transactions', title: 'Giao dịch', type: 'link' },
            ]
        },
        // {
        //     title: 'Coupons', icon: 'tag', type: 'sub', active: false, children: [
        //         {path: '/coupons/list-coupons', title: 'List Coupons', type: 'link'},
        //         {path: '/coupons/create-coupons', title: 'Create Coupons', type: 'link'},
        //     ]
        // },
        // {
        //     title: 'Pages', icon: 'clipboard', type: 'sub', active: false, children: [
        //         {path: '/pages/list-page', title: 'List Page', type: 'link'},
        //         {path: '/pages/create-page', title: 'Create Page', type: 'link'},
        //     ]
        // },
        // {
        //     title: 'Media', path: '/media', icon: 'camera', type: 'link', active: false
        // },
        // {
        //     title: 'Menus', icon: 'align-left', type: 'sub', active: false, children: [
        //         { path: '/menus/list-menu', title: 'Menu Lists', type: 'link' },
        //         { path: '/menus/create-menu', title: 'Create Menu', type: 'link' },
        //     ]
        // },
        {
            title: 'Shipper', icon: 'archive', type: 'sub', active: false, children: [
                { path: '/shippers/list', title: 'Danh sách', type: 'link' },
                { path: '/shippers/create', title: 'Tạo shipper', type: 'link' }
            ]
        },
        // {
        //     title: 'Localization', icon: 'chrome', type: 'sub', children: [
        //         {path: '/localization/translations', title: 'Translations', type: 'link'},
        //         {path: '/localization/currency-rates', title: 'Currency Rates', type: 'link'},
        //         {path: '/localization/taxes', title: 'Taxes', type: 'link'},
        //     ]
        // },
        // {
        //     title: 'Báo cáo', path: '/reports', icon: 'bar-chart', type: 'link', active: false
        // },
        // {
        //     title: 'Hoá đơn', path: '/invoice', icon: 'archive', type: 'link', active: false
        // },
        // {
        //     title: 'Login', path: '/auth/login', icon: 'log-in', type: 'link', active: false
        // }
    ]
    // Array
    // items = new BehaviorSubject<Menu[]>(this.MENUITEMS);


}
