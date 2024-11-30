import * as React from 'react';
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Checkbox} from "@/components/ui/checkbox";

type Props = {
    control: any;
    name: string;
    labelName: string;
    placeholder?: string;
    disabled?: boolean;
};

export default function _ZodBoolean(props: Props) {
    const { control, name, labelName, placeholder, disabled } = props;

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="space-y-0 flex items-center">
                    <FormLabel className="me-2">{labelName}</FormLabel>
                    <FormControl className="space-y-0">
                        <Checkbox
                            disabled={disabled}
                            checked={field.value}  // Bind value to checkbox (ensure it's a boolean)
                            onCheckedChange={(checked) => field.onChange(checked)}  // Toggle the value
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
