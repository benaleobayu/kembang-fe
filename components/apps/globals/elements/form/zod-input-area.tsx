// @flow
import * as React from 'react';
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Textarea} from "@/components/ui/textarea";

type Props = {
    control: any;
    name: string;
    labelName: string;
    placeholder?: string;
    disabled?: string;
};

export default function _ZodInputArea({control, name, labelName, placeholder, disabled}: Props) {
    return (
        <FormField
            control={control}
            name={name}
            render={({field}) => (
                <FormItem>
                    <FormLabel>{labelName}</FormLabel>
                    <FormControl>
                        <Textarea
                            disabled={disabled}
                            placeholder={placeholder}
                            {...field}
                        />
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )}
        />
    );
};