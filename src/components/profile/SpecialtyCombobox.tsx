import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MEDICAL_SPECIALTIES } from "@/lib/medical-specialties";
import { cn } from "@/lib/utils";

interface SpecialtyComboboxProps {
  id: string;
  value: string;
  onValueChange: (next: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function SpecialtyCombobox({
  id,
  value,
  onValueChange,
  placeholder = "Selecione uma especialidade",
  disabled,
}: SpecialtyComboboxProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "h-11 w-full justify-between px-3 py-2 text-left text-sm font-normal sm:h-9",
            !value ? "text-muted-foreground" : "text-foreground",
          )}
        >
          <span className="truncate">{value || placeholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" aria-hidden />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command>
          <CommandInput placeholder="Buscar especialidade..." />
          <CommandList>
            <CommandEmpty>Nenhuma especialidade encontrada.</CommandEmpty>
            {MEDICAL_SPECIALTIES.map((specialty) => (
              <CommandItem
                key={specialty}
                value={specialty}
                onSelect={() => {
                  onValueChange(specialty);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn("mr-2 h-4 w-4", value === specialty ? "opacity-100" : "opacity-0")}
                  aria-hidden
                />
                <span className="truncate">{specialty}</span>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
