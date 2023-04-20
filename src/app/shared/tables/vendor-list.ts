export class vendorsDB {

    private _vendorImg: string;
    private _name: string;
    private _products: string;
    private _store_name: string;
    private _date: Date;
    private _balance: bigint;
    private _revenue: bigint;


    constructor(vendorImg: string, name: string, products: string, store_name: string, date: Date, balance: bigint, revenue: bigint) {
        this._vendorImg = vendorImg;
        this._name = name;
        this._products = products;
        this._store_name = store_name;
        this._date = date;
        this._balance = balance;
        this._revenue = revenue;
    }

    get vendorImg(): string {
        return this._vendorImg;
    }

    set vendorImg(value: string) {
        this._vendorImg = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get products(): string {
        return this._products;
    }

    set products(value: string) {
        this._products = value;
    }

    get store_name(): string {
        return this._store_name;
    }

    set store_name(value: string) {
        this._store_name = value;
    }

    get date(): Date {
        return this._date;
    }

    set date(value: Date) {
        this._date = value;
    }

    get balance(): bigint {
        return this._balance;
    }

    set balance(value: bigint) {
        this._balance = value;
    }

    get revenue(): bigint {
        return this._revenue;
    }

    set revenue(value: bigint) {
        this._revenue = value;
    }

    static get data(): ({ date: string; revenue: string; balance: string; vendor: string; name: string; store_name: string; products: string } | { date: string; revenue: string; balance: string; vendor: string; name: string; store_name: string; products: string } | { date: string; revenue: string; balance: string; vendor: string; name: string; store_name: string; products: string } | { date: string; revenue: string; balance: string; vendor: string; name: string; store_name: string; products: string } | { date: string; revenue: string; balance: string; vendor: string; name: string; store_name: string; products: string } | { date: string; revenue: string; balance: string; vendor: string; name: string; store_name: string; products: string } | { date: string; revenue: string; balance: string; vendor: string; name: string; store_name: string; products: string } | { date: string; revenue: string; balance: string; vendor: string; name: string; store_name: string; products: string } | { date: string; revenue: string; balance: string; vendor: string; name: string; store_name: string; products: string } | { date: string; revenue: string; balance: string; vendor: string; name: string; store_name: string; products: string })[] {
        return this._data;
    }

    static set data(value: ({ date: string; revenue: string; balance: string; vendor: string; name: string; store_name: string; products: string } | { date: string; revenue: string; balance: string; vendor: string; name: string; store_name: string; products: string } | { date: string; revenue: string; balance: string; vendor: string; name: string; store_name: string; products: string } | { date: string; revenue: string; balance: string; vendor: string; name: string; store_name: string; products: string } | { date: string; revenue: string; balance: string; vendor: string; name: string; store_name: string; products: string } | { date: string; revenue: string; balance: string; vendor: string; name: string; store_name: string; products: string } | { date: string; revenue: string; balance: string; vendor: string; name: string; store_name: string; products: string } | { date: string; revenue: string; balance: string; vendor: string; name: string; store_name: string; products: string } | { date: string; revenue: string; balance: string; vendor: string; name: string; store_name: string; products: string } | { date: string; revenue: string; balance: string; vendor: string; name: string; store_name: string; products: string })[]) {
        this._data = value;
    }

    private static _data = [
        {
            vendor: 'assets/images/team/3.jpg',
            name: "Anna Mull",
            products: "1670",
            store_name: "Zotware",
            date: "2018-10-08",
            balance: "$576132",
            revenue: "$9761266",
        },
        {
            vendor: 'assets/images/dashboard/designer.jpg',
            name: "Colton Clay",
            products: "9710",
            store_name: "Green-Plus",
            date: "2018-05-06",
            balance: "$780250",
            revenue: "$8793611",
        },
        {
            vendor: 'assets/images/dashboard/boy-2.png',
            name: "Gray Brody",
            products: "579",
            store_name: "Conecom",
            date: "2018-02-25",
            balance: "$245508",
            revenue: "$1279520",
        },
        {
            vendor: 'assets/images/dashboard/user.png',
            name: "Lane Skylar",
            products: "8972",
            store_name: "Golddex",
            date: "2018-03-30",
            balance: "$7812483",
            revenue: "$8761424",
        },
        {
            vendor: 'assets/images/dashboard/user1.jpg',
            name: "Lane Skylar",
            products: "8678",
            store_name: "Plexzap",
            date: "2018-08-04",
            balance: "$89340",
            revenue: "$10285255",
        },
        {
            vendor: 'assets/images/team/1.jpg',
            name: "Paige Turner",
            products: "4680",
            store_name: "Finhigh",
            date: "2018-07-11",
            balance: "$87616",
            revenue: "$947611",
        },
        {
            vendor: 'assets/images/dashboard/user3.jpg',
            name: "Perez Alonzo",
            products: "3476",
            store_name: "Betatech",
            date: "17/9/18",
            balance: "$32451",
            revenue: "$647212",
        },
        {
            vendor: 'assets/images/team/2.jpg',
            name: "Petey Cruiser",
            products: "1670",
            store_name: "Warephase",
            date: "8/10/18",
            balance: "$576132",
            revenue: "$9761266",
        },
        {
            vendor: 'assets/images/dashboard/user5.jpg',
            name: "Rowan torres",
            products: "790",
            store_name: "Sunnamplex",
            date: "5/6/18",
            balance: "$87610",
            revenue: "$631479",
        },
        {
            vendor: 'assets/images/dashboard/user2.jpg',
            name: "Woters maxine",
            products: "680",
            store_name: "Kan-code",
            date: "15/4/18",
            balance: "$27910",
            revenue: "$579214",
        },
    ]
}
