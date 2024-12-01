const authUrl = "/auth"
const cmsUrl = "/cms/v1"
const apiUrl = "/api"

export const routesUrl: Array<{ key: string, url: string }> = [
    {key: "login", url: authUrl + "/login"},
    {key: "register", url: authUrl + "/login"},
    {key: "logout", url: authUrl + "/login"},

    {key: "location", url: cmsUrl + "/ms/locations"},
    {key: "locationApi", url: apiUrl + "/ms/locations"},

    {key: "productCategory", url: cmsUrl + "/ms/product_category"},
    {key: "productCategoryApi", url: apiUrl + "/ms/product_category"},

    {key: "product", url: cmsUrl + "/ms/products"},
    {key: "productApi", url: apiUrl + "/ms/products"},
    {key: "productServer", url: "ms/product"},

    {key: "order", url: cmsUrl + "/ms/orders"},
    {key: "orderApi", url: apiUrl + "/ms/orders"},
    {key: "orderServer", url: "ms/order"},


    {key: "customer", url: cmsUrl + "/customers"},
    {key: "customerApi", url: apiUrl + "/customers"},
    {key: "customerServer", url: "customers"},


]