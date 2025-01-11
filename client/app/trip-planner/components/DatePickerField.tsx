import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DatePickerFieldProps {
  label: string;
  selected: Date | null;
  onChange: (date: Date | null) => void;
  minDate?: Date; // minDate can be a Date or undefined (no null)
}

export default function DatePickerField({
  label,
  selected,
  onChange,
  minDate,
}: DatePickerFieldProps) {
  return (
    <div className="w-full mb-4">
      <label className="block text-teal-700 font-semibold mb-2">{label}</label>
      <ReactDatePicker
        selected={selected}
        onChange={onChange}
        minDate={minDate || undefined} // Ensure minDate is either a Date or undefined
        className="w-full p-2 border rounded text-teal-700"
        placeholderText={`Select ${label.toLowerCase()}`}
      />
    </div>
  );
}
