"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, ChevronDown, ChevronUp, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Switch } from "@/components/ui/switch";
import DefineDetailsFunction from "./DefineDetails";
function FormDialogue({
  formData,
  closeModal,
}: {
  formData: any;
  closeModal: any;
}) {
  const [formValues, setFormValues] = useState<any>({});
  const [isHelloExpanded, setIsHelloExpanded] = useState(true);
  const [isDD1Expanded, setIsDD1Expanded] = useState(true);
  const [isDD2Expanded, setIsDD2Expanded] = useState(true);

  useEffect(() => {
    const initialValues: any = {};
    formData.screendefinition_set.forEach((field: any) => {
      initialValues[field.field_key] = field.default_value || "";
    });
    setFormValues(initialValues);
  }, [formData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted:", formValues);
  };

  const shouldShowField = (field: any) => {
    if (!field.is_conditional) return true;

    const conditionalOn = JSON.parse(field.conditional_on);
    if (!conditionalOn || conditionalOn.length === 0) return true;

    // Check if the dependent toggle is true
    return conditionalOn.every(
      (dependentField: string) => formValues[dependentField] === true
    );
  };

  return (
    <ScrollArea className="w-[1100px] h-[750px] border-1 border-gray-300 rounded-md py-2 flex items-center justify-center bg-white">
      {/* Form title  */}

      <div className="flex items-center justify-between text-xl font-bold px-8">
        <h1>Aren 1</h1>
        <X onClick={closeModal} className="cursor-pointer" />
      </div>
      <div className="h-[0.5px] w-full bg-gray-500 mt-3"></div>

      {/* Screen Defination set */}
      <div className="w-full px-5">
        <form onSubmit={handleSubmit} className="flex gap-2 py-4 flex-wrap">
          {formData.screendefinition_set.map((field: any) => (
            <div key={field.id}>
              {shouldShowField(field) && (
                <>
                  {/* This is the normal input */}
                  {field.field_type_val === "text" &&
                    field.field_label !== "email" && (
                      <Input
                        type="text"
                        name={field.field_key}
                        placeholder={field.field_label}
                        value={formValues[field.field_key]}
                        onChange={handleChange}
                        className="w-[230px] h-[40px]"
                        required={field.is_required}
                        disabled={field.is_disabled}
                      />
                    )}

                  {/* This is the dropdown */}
                  {field.field_type_val === "dropdown" && (
                    <Select
                      name={field.field_key}
                      value={formValues[field.field_key] || ""}
                      onValueChange={(value) =>
                        setFormValues((prev: any) => ({
                          ...prev,
                          [field.field_key]: value,
                        }))
                      }
                      disabled={field.is_disabled}
                    >
                      <SelectTrigger className="w-[250px] h-[40px]">
                        <SelectValue placeholder={field.field_label} />
                      </SelectTrigger>

                      <SelectContent>
                        {field.dropdown_raw_query?.map((option: any) => (
                          <SelectItem key={option.id} value={option.key}>
                            {option.key}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {/* This is the date input */}
                  {field.field_type_val === "date" && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal bg-white border border-gray-300",
                            !formValues[field.field_key] &&
                              "text-muted-foreground"
                          )}
                        >
                          {formValues[field.field_key] ? (
                            format(
                              new Date(formValues[field.field_key]),
                              "dd/MM/yyyy"
                            )
                          ) : (
                            <span>{field.field_label || "Pick a date"}</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            formValues[field.field_key]
                              ? new Date(formValues[field.field_key])
                              : undefined
                          }
                          onSelect={(date) => {
                            if (date) {
                              const formattedDate = format(date, "yyyy-MM-dd");
                              setFormValues((prev: any) => ({
                                ...prev,
                                [field.field_key]: formattedDate,
                              }));
                            }
                          }}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  )}

                  {/* This is the toggle */}
                  {field.field_type_val === "toggle" && (
                    <div className="flex items-center gap-2 mt-2">
                      <Switch
                        id={field.field_key}
                        checked={formValues[field.field_key] || false}
                        onCheckedChange={(checked) =>
                          setFormValues((prev: any) => ({
                            ...prev,
                            [field.field_key]: checked,
                          }))
                        }
                      />
                      <label htmlFor={field.field_key} className="text-sm">
                        {field.field_label}
                      </label>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </form>

        {/* THis is the hello section */}
        <div className="mt-5">
          <button
            onClick={() => setIsHelloExpanded(!isHelloExpanded)}
            className="flex items-center px-2 cursor-pointer"
          >
            <div>{isHelloExpanded ? <ChevronDown /> : <ChevronUp />}</div>{" "}
            <h1 className="text-md font-bold">Hello</h1>
          </button>
          <div className="h-[0.5px] w-full bg-gray-500 mt-2"></div>
          {isHelloExpanded && (
            <div className="mt-2">
              {formData.screendefinition_set.map(
                (field: any) =>
                  field.field_label === "email" && (
                    <Input
                      key={field.id}
                      type="text"
                      name={field.field_key}
                      placeholder={field.field_label}
                      value={formValues[field.field_key]}
                      onChange={handleChange}
                      className="w-[230px] h-[40px]"
                      required={field.is_required}
                      disabled={field.is_disabled}
                    />
                  )
              )}
            </div>
          )}
        </div>

        {/* This is is the define details table 1st */}
        <div className="mt-5 w-full">
          <button
            onClick={() => setIsDD1Expanded(!isDD1Expanded)}
            className="flex items-center px-2 cursor-pointer"
          >
            <div>{isDD1Expanded ? <ChevronDown /> : <ChevronUp />}</div>{" "}
            <h1 className="text-md font-bold">Define Details</h1>
          </button>
          <div className="h-[0.5px] w-full bg-gray-500 mt-2 mb-3"></div>
          {isDD1Expanded && (
            <DefineDetailsFunction formData={formData.multiple_details[0]} />
          )}
        </div>

        {/* DefineDetails table no 2 */}
        <div className="mt-5 w-full ">
          <button
            onClick={() => setIsDD2Expanded(!isDD2Expanded)}
            className="flex items-center px-2 cursor-pointer"
          >
            <div>{isDD1Expanded ? <ChevronDown /> : <ChevronUp />}</div>{" "}
            <h1 className="text-md font-bold">Define Details</h1>
          </button>
          <div className="h-[0.5px] w-full bg-gray-500 mt-2 mb-3"></div>
          {isDD2Expanded && (
            <DefineDetailsFunction formData={formData.multiple_details[1]} />
          )}
        </div>
      </div>

      <div className="w-full py-2 px-5 absolute bottom-0 border-t bg-white rounded-b">
        <Button
          onClick={closeModal}
          className="bg-blue-500 text-white cursor-pointer"
        >
          Submit
        </Button>
      </div>
    </ScrollArea>
  );
}

export default FormDialogue;
