"use client";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

function DefineDetailsFunction({ formData }: { formData: any }) {
  const [rows, setRows] = useState([{ id: Date.now(), data: {} }]);

  useEffect(() => {
    console.log("Current rows data:", rows);
  }, [rows]);

  const addRow = () => {
    setRows([...rows, { id: Date.now(), data: {} }]);
  };

  const removeRow = (id: number) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleInputChange = (rowId: number, fieldKey: string, value: any) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === rowId
          ? { ...row, data: { ...row.data, [fieldKey]: value } }
          : row
      )
    );
  };

  return (
    <div className="border-1 border-gray-300 rounded-md overflow-auto max-w-[1040px]">
      {" "}
      {/* Ensure maxWidth is set */}
      <Table
        removeWrapper
        aria-label="Dynamic form table"
        className="w-full"
        classNames={{
          th: "border-b border-r border-divider",
          td: "border-b border-r border-divider",
          tr: "border-b border-divider last:border-b-0",
        }}
      >
        <TableHeader>
          <TableColumn className="text-left bg-gray-100">Action</TableColumn>
          {formData.data.map((item: any) => (
            <TableColumn key={item.id} className="text-left bg-gray-100">
              {item.field_label}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {rows.map((row: any, index: number) => (
            <TableRow key={row.id}>
              <TableCell>
                {index === 0 ? (
                  <Button
                    onClick={addRow}
                    className="bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                  >
                    <Plus />
                  </Button>
                ) : (
                  <Button
                    onClick={() => removeRow(row.id)}
                    className="bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                  >
                    <Minus />
                  </Button>
                )}
              </TableCell>
              {formData.data.map((field: any) => (
                <TableCell key={field.id}>
                  {renderInput(field, row.id, handleInputChange)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function renderInput(
  item: any,
  rowId: number,
  handleInputChange: (rowId: number, fieldKey: string, value: any) => void
) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    handleInputChange(rowId, item.field_key, e.target.value);
  };

  const handleSelectChange = (value: string) => {
    handleInputChange(rowId, item.field_key, value);
  };

  switch (item.field_type_id) {
    case "text":
      return (
        <Input
          type="text"
          name={item.field_key}
          placeholder={item.field_label}
          className="w-[200px] h-[40px]"
          required={item.is_required}
          disabled={item.is_disabled}
          onChange={handleChange}
        />
      );
    case "integer":
      return (
        <Input
          type="number"
          name={item.field_key}
          placeholder={item.field_label}
          className="w-[200px] h-[40px]"
          required={item.is_required}
          disabled={item.is_disabled}
          onChange={handleChange}
        />
      );
    case "date":
      return (
        <Input
          type="date"
          placeholder={item.field_placeholder}
          onChange={handleChange}
        />
      );
    case "dropdown":
      return (
        <Select
          name={item.field_key}
          disabled={item.is_disabled}
          onValueChange={handleSelectChange}
        >
          <SelectTrigger className="w-[200px] h-[40px]">
            <SelectValue placeholder={item.field_label} />
          </SelectTrigger>
          <SelectContent>
            {item.dropdown_raw_query?.map((option: any) => (
              <SelectItem key={option.id} value={option.key}>
                {option.key}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    default:
      return (
        <input
          type="text"
          placeholder={item.field_placeholder}
          onChange={handleChange}
        />
      );
  }
}

export default DefineDetailsFunction;
