const authUrl = "/auth"
const cmsUrl = "/cms/v1"
const apiUrl = "/api/dev"

export const routesUrl: Array<{ key: string, url: string }> = [
    {key: "login", url: authUrl + "/login"},
    {key: "register", url: authUrl + "/login"},
    {key: "logout", url: authUrl + "/login"},

    {key: "menuApi", url: apiUrl + "/util/menu"},
    {key: "logoApi", url: apiUrl + "/element/logo"},
    {key: "sideLogoApi", url: apiUrl + "/element/side-login-logo"},

    {key: "location", url: cmsUrl + "/ms/locations"},
    {key: "locationApi", url: apiUrl + "/ms/locations"},

    {key: "productCategory", url: cmsUrl + "/ms/product_category"},
    {key: "productCategoryApi", url: apiUrl + "/ms/product_category"},

    {key: "product", url: cmsUrl + "/ms/products"},
    {key: "productApi", url: apiUrl + "/ms/products"},
    {key: "productServer", url: "ms/product"},

    {key: "order", url: cmsUrl + "/order"},
    {key: "orderApi", url: apiUrl + "/order"},
    {key: "orderServer", url: "order"},

    {key: "order-route", url: cmsUrl + "/order-route"},
    {key: "order-routeApi", url: apiUrl + "/order-route"},
    {key: "order-routeServer", url: "order-route"},

    {key: "customer", url: cmsUrl + "/customers"},
    {key: "customerApi", url: apiUrl + "/customers"},
    {key: "customerServer", url: "customers"},


    {key: "mapsDistanceMatrix", url: "https://maps.gomaps.pro/maps/api/distancematrix/json?"},


]