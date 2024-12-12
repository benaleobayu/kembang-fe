import axios from "axios";
import { routesUrl } from "@/components/apps/globals/options/routes";
import { SelectOptions } from "@/types/SelectOptions";

interface Options {
    label: string;
    address: string;
    location: string;
    value: string;
}

export const mapsDistanceMatrix = async (): Promise<Options[]> => {
    const apiRouteData = routesUrl.find(data => data.key === "mapsDistanceMatrix")?.url;

    try {
        const response = await axios.post(`${apiRouteData}?avoid=tolls&destinations=Jl Kepodang rempoa&origins=Jl Hima jaya cilandak&key=`);
        const mapResponse = response.data.data.result;

        return mapResponse.map((data: any) => ({
            label: data.name,
            address: data.address,
            location: data.location,
            value: data.id,
        }));
    } catch (error) {
        throw new Error(error.response?.data?.message || "An error occurred while fetching customer data.");
    }
};
