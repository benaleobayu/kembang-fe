// @flow
import * as React from 'react';
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"

type Props = {
    control: any;
    name: string;
    labelName: string;
    placeholder?: string;
};
export default function _ZodBooleanSelectActive(props: Props) {
    const {control, name, labelName, placeholder, description} = props;
    return (
        <FormField
            control={control}
            name={name}
            render={({field}) => (
                <FormItem>
                    <FormLabel>{labelName}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value ? "true" : "false"}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a verified email to display"/>
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="true">Active</SelectItem>
                            <SelectItem value="false">Deactivate</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormDescription>
                        {description}
                    </FormDescription>
                    <FormMessage/>
                </FormItem>
            )}
        />
    );
};