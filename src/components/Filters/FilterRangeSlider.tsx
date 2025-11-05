import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface FilterRangeSliderProps {
  label: string;
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  step?: number;
}

export const FilterRangeSlider = ({
  label,
  min,
  max,
  value,
  onChange,
  step = 1,
}: FilterRangeSliderProps) => {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="pt-2">
        <Slider
          min={min}
          max={max}
          step={step}
          value={value}
          onValueChange={(val) => onChange(val as [number, number])}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>{value[0]}</span>
          <span>{value[1]}</span>
        </div>
      </div>
    </div>
  );
};
