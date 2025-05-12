'use client';

import { useState } from 'react';
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
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { BaseFormFieldProps } from '@/types';
import { ZodType } from 'zod';

const BaseFormField = <TSchema extends ZodType>({
	name,
	label,
	placeholder,
	description,
	inputType,
	disabled,
	dataArr,
	disabledLabel = 'Disabled',
	enabledLabel = 'Enabled',
	formControl,
}: BaseFormFieldProps<TSchema>) => {
	const [isCalendarOpen, setIsCalendarOpen] = useState(false);
	return (
		<FormField
			control={formControl}
			name={name}
			render={({ field }) => (
				<FormItem className='w-full'>
					{label && (
						<FormLabel
							className={`${inputType === 'radio' ? 'mb-4 block' : ''}`}
							htmlFor={field.name}>
							{label}
						</FormLabel>
					)}
					<FormControl>
						{/* Checkbox (Switch) */}
						{inputType === 'checkbox' ? (
							<div className='flex items-center gap-2'>
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
								className='flex flex-col space-y-2'>
								{dataArr?.map((item) => (
									<div key={item.value} className='flex items-center space-x-2'>
										<RadioGroupItem
											key={item.value}
											value={item.value}
											checked={field.value === item.value}
										/>
										<FormLabel className='font-normal'>{item.label}</FormLabel>
									</div>
								))}
							</RadioGroup>
						) : inputType === 'toggle' ? (
							<ToggleGroup
								type='single'
								size='default'
								onValueChange={field.onChange}
								value={field.value}
								className='flex gap-3'>
								{dataArr?.map((item) => {
									const Icon = item.icon;
									return (
										<ToggleGroupItem
											key={item.value}
											value={item.value}
											className={cn(
												'px-6 py-3 text-sm font-semibold rounded-md border transition-colors',
												field.value === item.value
													? 'bg-primary text-secondary-foreground border-gray-400'
													: 'bg-muted text-muted-foreground/50 hover:bg-accent hover:text-accent-foreground',
											)}>
											{Icon && <Icon className='h-4 w-4' />}
											{item.label}
										</ToggleGroupItem>
									);
								})}
							</ToggleGroup>
						) : inputType === 'select' ? (
							// Select Dropdown
							<Select
								onValueChange={field.onChange}
								value={field.value?.toString()}>
								<SelectTrigger className='w-full' id={field.name}>
									<SelectValue placeholder={placeholder} />
								</SelectTrigger>
								<SelectContent className='w-full'>
									{dataArr?.map((item) => {
										const Icon = item.icon;
										return (
											<SelectItem key={item.value} value={item.value}>
												<div className='flex items-center gap-2'>
													{Icon && <Icon className='h-4 w-4' />}
													{item.label}
												</div>
											</SelectItem>
										);
									})}
								</SelectContent>
							</Select>
						) : inputType === 'textarea' ? (
							// Multiline Textarea
							<Textarea
								id={field.name}
								placeholder={placeholder}
								disabled={disabled}
								value={field.value ?? ''}
								onChange={field.onChange}
								className='resize-none'
							/>
						) : inputType === 'datepicker' ? (
							<Popover
								open={isCalendarOpen}
								onOpenChange={setIsCalendarOpen}
								modal>
								<PopoverTrigger asChild>
									<Button
										id={field.name}
										variant='outline'
										className={cn(
											'w-[280px] justify-start text-left font-normal',
											!field.value && 'text-muted-foreground',
										)}>
										<CalendarIcon className='mr-2 h-4 w-4' />
										{field.value ? format(field.value, 'PPP') : 'Pick a date'}
									</Button>
								</PopoverTrigger>
								<PopoverContent className='w-auto p-0'>
									<Calendar
										mode='single'
										selected={field.value}
										onSelect={(val) => {
											if (val) {
												field.onChange(val);
												setIsCalendarOpen(false);
											}
										}}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
						) : (
							// Default Input Field
							<Input
								id={field.name}
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
