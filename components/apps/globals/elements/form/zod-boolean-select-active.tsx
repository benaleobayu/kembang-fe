// @flow
import * as React from 'react';
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"
import {Input} from "@/components/ui/input";

type Props = {
    control: any;
    name: string;
    labelName: string;
    placeholder?: string;
    disabled?: string;
};
export default function _ZodBooleanSelectActive(props: Props) {
    const {control, name, labelName, placeholder, description, disabled} = props;
    return (
        <FormField
            control={control}
            name={name}
            render={({field}) => (
                <FormItem>
                    {disabled ? (
                        <FormItem>
                            <FormLabel>{labelName}</FormLabel>
                            <FormControl>
                                <Input placeholder={placeholder} disabled={!!disabled} {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    ) : (
                        <>
                            <FormLabel>{labelName}</FormLabel>
                            <Select
                                onValueChange={(value) => field.onChange(value === "true")}
                                defaultValue={field.value ? "true" : "false"}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select active status" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="true">Active</SelectItem>
                                    <SelectItem value="false">Deactivate</SelectItem>
                                </SelectContent>
                            </Select>
                        </>
                    )}
                    <FormDescription>
                        {description}
                    </FormDescription>
                    <FormMessage/>
                </FormItem>
            )}
        />
    );
};