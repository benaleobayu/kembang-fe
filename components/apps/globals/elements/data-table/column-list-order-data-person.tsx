// _Column
// @flow
import * as React from "react";

type Props = {
    key: string;
    name: string;
};
export default function _ColumnListOrderDataPerson(props: Props) {
    const {key, name} = props;

    return {
        id: key,
        accessorKey: key,
        header: name,
        cell: ({row}) => {
            // Mengambil data dari dataPerson
            const dataPerson = row.getValue(key);
            const listOrder = row.getValue("listOrder");

            if (!dataPerson) {
                return <div>Data not available</div>;
            }

            const {name: personName, address, phone, forwardName, forwardAddress} = dataPerson;

            if (Array.isArray(listOrder) && listOrder.length > 0) {
                return (
                    <div className="flex flex-col space-y-1">
                        {/* Menampilkan nama untuk setiap order */}
                        {listOrder.map((_, index) => (
                            <div key={index} className="flex flex-col items-start">
                                {forwardName ? (
                                    <div>{forwardName} (Pesanan {personName})</div>

                                ) : (
                                    <div>{personName}</div>
                                )}
                            </div>
                        ))}

                        {/* Menampilkan alamat dan nomor telepon setelah semua list order */}
                        <div className="flex flex-col items-center justify-start w-full mt-2">
                            <div className="border-t border-gray-300 w-full py-1">
                                {forwardAddress ?  (`/ ${forwardAddress}`) : (`/ ${address} || ${phone}`)}
                            </div>
                        </div>
                    </div>
                );
            }

            return (
                <div>
                    {personName}
                    <div className="flex flex-col items-center text-center w-full mt-2">
                        <div className="border-t border-gray-300 w-full py-1">
                            || {address} ||
                        </div>
                        <div className="border-t border-gray-300 w-full py-1">
                            || {phone} ||
                        </div>
                    </div>
                </div>
            );
        },
    };
}