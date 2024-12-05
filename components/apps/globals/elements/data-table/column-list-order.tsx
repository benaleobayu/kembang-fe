// @flow
import * as React from 'react';

type Props = {
    key: string;
    name: string;
};
export default function _ColumnListOrder(props: Props) {
    const {key, name} = props;
    return {
        id: key,
        accessorKey: key,
        header: name,
        cell: ({row}) => {
            const listOrder = row.getValue(key);
            // Pastikan `listOrder` adalah array
            if (Array.isArray(listOrder)) {
                return (
                    <div className="flex flex-col space-y-1">
                        {listOrder.map((order, index) => (
                            <div key={index} className="flex justify-between whitespace-nowrap">
                                <div>{order.productName} {" "} </div> <div> [ {order.quantity} ]</div>
                            </div>
                        ))}
                    </div>
                );
            }
            return <div>-</div>; // Jika `listOrder` bukan array, tampilkan placeholder
        },
    };
};