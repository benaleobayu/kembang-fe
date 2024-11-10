// @flow
import * as React from 'react';
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";

type Props = {
    control: any;
    name: string;
    labelName: string;
    placeholder?: string;
    type?: string;
};
export default function _ZodInput(props: Props) {
    const {control, name, labelName, placeholder, type} = props;
    return (
        <>
            <FormField
                control={control}
                name={name}
                render={({field}) => (
                    <FormItem>
                        <FormLabel>{labelName}</FormLabel>
                        <FormControl>
                            <Input placeholder={placeholder} type={type ? type : "text"} {...field} />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
            />
        </>
    );
};