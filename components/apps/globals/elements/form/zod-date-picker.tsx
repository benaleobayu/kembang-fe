"use client"

import {format} from "date-fns"
import {CalendarIcon} from "lucide-react"

import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Calendar} from "@/components/ui/calendar"
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"
import {Input} from "@/components/ui/input";
import * as React from "react";

type Props = {
    control: any;
    name: string;
    labelName: string;
    description?: string;
    disabled?: boolean
};

export default function _ZodDatePicker({control, name, labelName, description, disabled}: Props) {
    return (
        <>
            <FormField
                className={"w-full"}
                control={control}
                name={name}
                render={({field}) => (
                    <FormItem className="">
                        <FormLabel>{labelName}</FormLabel>
                        {disabled ? (
                            <FormControl className={"w-full"}>
                                <Input
                                    disabled={disabled}
                                    {...field}
                                />
                            </FormControl>
                        ) : (
                            <Popover>
                                <PopoverTrigger className={"w-full"} asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ? (
                                                format(field.value, "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                            date > new Date("2045-01-01") || date < new Date("1900-01-01")
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        )}
                        {description && (
                            <FormDescription>
                                {description}
                            </FormDescription>
                        )}
                        <FormMessage/>
                    </FormItem>
                )}
            />
        </>
    );
};