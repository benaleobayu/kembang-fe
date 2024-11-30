// @flow
import * as React from 'react';
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Checkbox} from "@/components/ui/checkbox";

type Props = {
    control: any;
    name: string;
    labelName: string;
    placeholder?: string;
    description?: string;
    datas: {
        value: string;
        label: string
    }[]
    disabled?: boolean;
};
export default function _ZodStringCheckbox(props: Props) {
    const {control, name, labelName, placeholder, description, datas, disabled} = props;
    return (
        <FormItem>
            <div className="mb-4">
                <FormLabel>{labelName}</FormLabel>
                <FormDescription>
                    {description}
                </FormDescription>
            </div>
            {datas.map((item) => (
                <FormField
                    key={item.value}
                    control={control}
                    name={name}
                    render={({field}) => {
                        return (
                            <FormItem
                                key={item.value}
                                className="flex flex-row items-start space-x-3 space-y-0"
                            >
                                <FormControl>
                                    <Checkbox
                                        disabled={disabled}
                                        checked={field.value?.includes(item.value)}
                                        onCheckedChange={(checked) => {
                                            return checked
                                                ? field.onChange([...field.value, item.value])
                                                : field.onChange(
                                                    field.value?.filter(
                                                        (value) => value !== item.value
                                                    )
                                                )
                                        }}
                                    />
                                </FormControl>
                                <FormLabel className="font-normal">
                                    {item.label}
                                </FormLabel>
                            </FormItem>
                        )
                    }}
                />
            ))}
            <FormMessage/>
        </FormItem>
    );
};