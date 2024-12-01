import axios from "axios";
import { routesUrl } from "@/components/apps/globals/options/routes";
import { SelectOptions } from "@/types/SelectOptions";

export const productOptions = async (): Promise<SelectOptions[]> => {
    const apiRouteData = routesUrl.find(data => data.key === "productApi")?.url;

    try {
        const response = await axios.get(`${apiRouteData}?limit=1000`);
        const mapResponse = response.data.data.result;

        return mapResponse.map((data: any) => ({
            label: data.name,
            value: data.id,
        }));
    } catch (error) {
        throw new Error(error.response?.data?.message || "An error occurred while fetching customer data.");
    }
};
