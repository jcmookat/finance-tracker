'use client';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { BaseFormFieldProps } from '@/types';
import { StarIcon } from 'lucide-react';
import { ZodType } from 'zod';

const BaseFormField = <TSchema extends ZodType>({
  name,
  label,
  placeholder,
  description,
  inputType,
  disabled,
  dataArr,
  selectIcon,
  disabledLabel = 'Disabled',
  enabledLabel = 'Enabled',
  formControl,
}: BaseFormFieldProps<TSchema>) => {
  return (
    <FormField
      control={formControl}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel className={`${inputType === 'radio' ? 'mb-4 block' : ''}`}>
            {label}
          </FormLabel>
          <FormControl>
            {/* Checkbox (Switch) */}
            {inputType === 'checkbox' ? (
              <div className="flex items-center gap-2">
                <Switch
                  checked={
                    typeof field.value === 'boolean' ? field.value : false
                  }
                  onCheckedChange={field.onChange}
                  disabled={disabled}
                />
                <span>{field.value ? enabledLabel : disabledLabel}</span>
              </div>
            ) : inputType === 'radio' ? (
              // Radio Group
              <RadioGroup
                onValueChange={field.onChange}
                className="flex flex-col space-y-2"
              >
                {dataArr?.map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <RadioGroupItem
                      key={item}
                      value={item}
                      checked={field.value === item}
                    />
                    <FormLabel className="font-normal">{item}</FormLabel>
                  </div>
                ))}
              </RadioGroup>
            ) : inputType === 'select' ? (
              // Select Dropdown
              <Select
                onValueChange={field.onChange}
                value={field.value?.toString()}
              >
                <SelectTrigger>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {dataArr?.map((item) => (
                    <SelectItem key={item} value={item}>
                      {selectIcon ? (
                        <>
                          {item} <StarIcon className="inline h-4 w-4" />
                        </>
                      ) : (
                        item
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : inputType === 'textarea' ? (
              // Multiline Textarea
              <Textarea
                placeholder={placeholder}
                disabled={disabled}
                value={field.value ?? ''}
                onChange={field.onChange}
                className="resize-none"
              />
            ) : (
              // Default Input Field
              <Input
                placeholder={placeholder}
                type={inputType || 'text'}
                disabled={disabled}
                value={field.value ?? ''}
                onChange={(e) =>
                  inputType === 'number'
                    ? field.onChange(
                        e.target.value === '' ? null : Number(e.target.value),
                      )
                    : field.onChange(e.target.value)
                }
              />
            )}
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default BaseFormField;
