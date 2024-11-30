"use client"
import * as React from 'react';
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {Check, ChevronsUpDown} from "lucide-react";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {Input} from "@/components/ui/input";

type Props = {
    control: any;
    name: string;
    labelName: string;
    placeholder?: string;
    description?: string;
    datas: { label: string, value: number | string }[];
    form: any;
    disabled?: boolean
};
export default function _ZodSelect(props: Props) {
    const {control, name, labelName, placeholder, description, datas, form, disabled} = props;

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => {
                const label = datas.find(data => data.value === field.value)?.label || '';
                return (
                    <FormItem className="flex flex-col">
                        {disabled ? (
                            <FormItem>
                                <FormLabel>{labelName}</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder={placeholder}
                                        disabled={!!disabled}
                                        value={label}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        ) : (
                            <>
                                <FormLabel>{labelName}</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    "w-full justify-between",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value
                                                    ? datas.find(
                                                        (data) => data.value === field.value
                                                    )?.label
                                                    : `Select ${labelName}`}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandInput placeholder={placeholder ? placeholder : `Select ${labelName}`} />
                                            <CommandList className="max-h-[200px]">
                                                <CommandEmpty>No data {labelName} found.</CommandEmpty>
                                                <CommandGroup className={"w-full"}>
                                                    {datas.map((data) => (
                                                        <CommandItem
                                                            value={data.label}
                                                            key={data.value}
                                                            onSelect={() => {
                                                                form.setValue(name, data.value);
                                                            }}
                                                        >
                                                            {data.label}
                                                            <Check
                                                                className={cn(
                                                                    "ml-auto",
                                                                    data.value === field.value
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </>
                        )}
                        <FormDescription>
                            {description}
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )
            }}
        />
    );
};