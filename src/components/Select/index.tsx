import { Select } from "radix-ui";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import classes from "./style.module.css";

interface SelectProps {
  items: { value: string; label: string }[];
  value?: string;
  onSelect: (value: string) => void;
}

export default function MySelect({
  items,
  value,
  onSelect,
}: Readonly<SelectProps>) {
  return (
    <Select.Root
      value={value}
      defaultValue={items[0].value}
      onValueChange={onSelect}
    >
      <Select.Trigger className={classes.Trigger}>
        <Select.Value className={classes.Value} />
        <Select.Icon className={classes.Icon}>
          <FiChevronDown />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content position="popper" className={classes.Content}>
          <Select.ScrollUpButton className={classes.ScrollButton}>
            <FiChevronUp />
          </Select.ScrollUpButton>
          <Select.Viewport className={classes.Viewport}>
            {items.map(({ value, label }) => (
              <Select.Item key={value} value={value} className={classes.Item}>
                <Select.ItemText className={classes.ItemText}>
                  {label}
                </Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
          <Select.ScrollDownButton className={classes.ScrollButton}>
            <FiChevronDown />
          </Select.ScrollDownButton>
          <Select.Arrow className={classes.Arrow} />
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
