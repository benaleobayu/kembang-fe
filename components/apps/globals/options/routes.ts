
const authUrl = "/auth"
const cmsUrl = "/cms/v1"
const apiUrl = "/api"

export const routesUrl: Array<{ key: string, url: string }> = [
    {key: "login", url: authUrl + "/login"},
    {key: "register", url: authUrl + "/login"},
    {key: "logout", url: authUrl + "/login"},

    {key: "location", url: cmsUrl + "/ms/locations"},
    {key: "locationApi", url: apiUrl + "/ms/locations"},

    {key: "customer", url: cmsUrl + "/customers"},
    {key: "customerApi", url: apiUrl + "/customers"},

]