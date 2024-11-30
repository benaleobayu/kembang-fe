// @flow
import * as React from 'react';

type Props = {
    key: string;
    name: string;
};
export default function _ColumnInput(props: Props) {
    const {key, name} = props;
    return {
        id: key,
        accessorKey: key,
        header: name,
        cell: ({row}) => {
            const value = row.getValue(key);
            const booleanString = typeof value === 'boolean' ? value ? 'true' : 'false' : value;
            return <div className="capitalize">{booleanString}</div>;
        },
    };
};