'use client';

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import {
	Check,
	PlusCircle,
	ChevronsUpDown,
	LucideIcon,
	ShoppingCart,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { BaseFormFieldProps } from '@/types';
import { ZodType } from 'zod';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from './ui/form';

type Category = {
	label: string;
	value: string;
	icon: LucideIcon;
};

export const ComboBox = <TSchema extends ZodType>({
	name,
	label,
	placeholder,
	dataArr,
	formControl,
}: BaseFormFieldProps<TSchema>) => {
	const [open, setOpen] = useState<boolean>(false);
	const [input, setInput] = useState<string>('');
	const [selected, setSelected] = useState<string>('');
	const [selectedIcon, setSelectedIcon] = useState<LucideIcon | null>(null);

	const handleSelect = (category: Category) => {
		setSelected(category.value);
		setSelectedIcon(category.icon);
		// onSelectCategory(category);
		setOpen(false);
	};

	const handleAdd = () => {
		// if (!input.trim()) return;
		// const newCategory = { id: `temp-${input}`, name: input }; // Temp until saved
		// onAddCategory(input);
		// handleSelect(newCategory);
	};

	useEffect(() => {
		console.log(selected);
	}, [selected]);

	const categories = dataArr;

	const isNew = input && !categories?.find((c) => c.value === input);

	return (
		<FormField
			control={formControl}
			name={name}
			render={({ field }) => (
				<FormItem className='w-full'>
					{label && <FormLabel htmlFor={field.name}>{label}</FormLabel>}
					<FormControl>
						<Popover open={open} onOpenChange={setOpen} modal>
							<PopoverTrigger asChild>
								<Button
									id={field.name}
									value={selected}
									variant='outline'
									role='combobox'
									aria-expanded={open}
									className='w-full justify-between'>
									{selected ? selected : `${placeholder}`}
									<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
								</Button>
							</PopoverTrigger>
							<PopoverContent className='w-[300px] p-0'>
								<Command>
									<CommandInput
										placeholder={placeholder}
										value={input}
										onValueChange={setInput}
									/>
									<CommandEmpty>
										No category found.
										{isNew && (
											<Button
												variant='ghost'
												className='mt-2 w-full justify-start text-left'
												onClick={handleAdd}>
												<PlusCircle className='mr-2 h-4 w-4' />
												Create &quot;{input}&quot;
											</Button>
										)}
									</CommandEmpty>
									<CommandGroup heading='Categories'>
										{categories?.map((category) => {
											const Icon = category.icon;
											return (
												<CommandItem
													key={category.value}
													value={category.value}
													onSelect={(val) => {
														field.onChange(val);
														handleSelect(category);
													}}>
													{Icon && <Icon className='h-4 w-4' />}
													{category.label}
													<Check
														className={cn(
															'mr-2 h-4 w-4',
															selected === category.value
																? 'opacity-100'
																: 'opacity-0',
														)}
													/>
												</CommandItem>
											);
										})}
									</CommandGroup>
								</Command>
							</PopoverContent>
						</Popover>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};
