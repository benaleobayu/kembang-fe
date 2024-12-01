import * as React from 'react';
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

type Props = {
    control: any;
    name: string;
    labelName: string;
    placeholder?: string;
    description?: string;
    disabled?: boolean;
    ifTrue: string;
    ifFalse: string
};

export default function _ZodBooleanSelect(props: Props) {
    const { control, name, labelName, placeholder, description, disabled, ifTrue, ifFalse } = props;

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    {disabled ? (
                        // If disabled, show an Input field
                        <FormItem>
                            <FormLabel>{labelName}</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder={placeholder}
                                    disabled={true}  // Disable input if disabled is true
                                    value={field.value ? ifTrue : ifFalse} // Display "Active" or "Deactivate"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    ) : (
                        // If not disabled, show a Select dropdown
                        <>
                            <FormLabel>{labelName}</FormLabel>
                            <Select
                                onValueChange={(value) => field.onChange(value === "true")} // Convert string to boolean
                                value={field.value ? "true" : "false"} // Convert boolean to string for display
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder={placeholder} />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="true">{ifTrue}</SelectItem>
                                    <SelectItem value="false">{ifFalse}</SelectItem>
                                </SelectContent>
                            </Select>
                        </>
                    )}
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
