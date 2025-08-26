import { useMemo, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays, Clock, X } from "lucide-react";

type DateTimePickerProps = {
  value?: string;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
};

// Converts "YYYY-MM-DDTHH:MM" to Date (local)
function parseLocalDateTime(local: string | undefined): Date | undefined {
  if (!local) return undefined;
  // Ensure pattern is valid
  const m = local.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
  if (!m) return undefined;
  const [_, y, mo, d, h, mi] = m;
  const date = new Date(Number(y), Number(mo) - 1, Number(d), Number(h), Number(mi), 0, 0);
  return isNaN(date.getTime()) ? undefined : date;
}

// Formats Date (local) to "YYYY-MM-DDTHH:MM"
function formatLocalDateTime(date: Date | undefined): string | undefined {
  if (!date) return undefined;
  const pad = (n: number) => String(n).padStart(2, "0");
  const y = date.getFullYear();
  const mo = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const h = pad(date.getHours());
  const mi = pad(date.getMinutes());
  return `${y}-${mo}-${d}T${h}:${mi}`;
}

export default function DateTimePicker({ value, onChange, placeholder = "Pick date & time", disabled }: DateTimePickerProps) {
  const [open, setOpen] = useState(false);
  const dateFromValue = useMemo(() => parseLocalDateTime(value), [value]);
  const [timeText, setTimeText] = useState(() => {
    const d = parseLocalDateTime(value);
    return d ? `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}` : "";
  });

  const displayText = useMemo(() => {
    const d = parseLocalDateTime(value);
    if (!d) return placeholder;
    return d.toLocaleString([], { year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" });
  }, [value, placeholder]);

  const handleSelectDate = (selected: Date | undefined) => {
    const base = selected ?? dateFromValue ?? new Date();
    // If timeText present, merge hours/minutes
    if (timeText && /^(\d{2}):(\d{2})$/.test(timeText)) {
      const [hh, mm] = timeText.split(":").map((s) => Number(s));
      base.setHours(hh, mm, 0, 0);
    }
    onChange(formatLocalDateTime(selected ? base : undefined));
  };

  const handleTimeChange = (t: string) => {
    setTimeText(t);
    if (!/^(\d{2}):(\d{2})$/.test(t)) return;
    const base = dateFromValue ?? new Date();
    const [hh, mm] = t.split(":").map((s) => Number(s));
    base.setHours(hh, mm, 0, 0);
    onChange(formatLocalDateTime(base));
  };

  const clear = () => {
    onChange(undefined);
    setTimeText("");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-between text-left font-normal"
          disabled={disabled}
        >
          <span className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            <span className={value ? "text-foreground" : "text-muted-foreground"}>{displayText}</span>
          </span>
          {value ? (
            <X className="h-4 w-4 opacity-60 hover:opacity-100" onClick={(e) => { e.stopPropagation(); clear(); }} />
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-3" align="start">
        <div className="space-y-3">
          <Calendar
            selected={dateFromValue}
            onSelect={(d) => handleSelectDate(d as Date | undefined)}
            mode="single"
            initialFocus
          />
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <Input
              type="time"
              step={60}
              value={timeText}
              onChange={(e) => handleTimeChange(e.target.value)}
              className="flex-1"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={clear}>Clear</Button>
            <Button type="button" onClick={() => setOpen(false)}>Done</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}


