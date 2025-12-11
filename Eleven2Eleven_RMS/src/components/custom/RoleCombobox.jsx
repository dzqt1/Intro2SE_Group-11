import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandList,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { getRoles } from "@/data_access/api"

// fallback static roles (id/name) used while fetching or if DB empty
const fallbackRoles = [
  { id: "1", name: "Admin" },
  { id: "2", name: "Manager" },
  { id: "3", name: "Waiter" },
  { id: "4", name: "Kitchen Staff" },
]

export function RoleCombobox({ value, onChange, className }) {
  const [open, setOpen] = React.useState(false)
  const [roles, setRoles] = React.useState(fallbackRoles)

  React.useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const list = await getRoles()
        if (!mounted) return
        if (Array.isArray(list) && list.length) {
          setRoles(list.map(r => ({ id: String(r.id), name: r.name || r.label || String(r.id) })))
        }
      } catch (err) {
        console.error('Failed to load roles', err)
      }
    })()
    return () => { mounted = false }
  }, [])

  const display = () => {
    if (value === undefined || value === null || value === "") return 'Select role...'
    const valStr = String(value)
    const foundById = roles.find(r => r.id === valStr)
    if (foundById) return foundById.name
    const foundByName = roles.find(r => String(r.name) === valStr)
    return foundByName ? foundByName.name : 'Select role...'
  }

  return (
    <Popover open={open} onOpenChange={setOpen} className="self-start">
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[220px] justify-between text-sm", className)}
        >
          {display()}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No role found.</CommandEmpty>
            <CommandGroup>
              {roles.map((role) => (
                <CommandItem
                  key={role.id}
                  value={role.id}
                  onSelect={(currentValue) => {
                    onChange?.(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {role.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      String(value) === role.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default RoleCombobox
