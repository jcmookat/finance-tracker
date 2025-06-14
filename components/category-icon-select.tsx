'use client';

import { BaseFormFieldProps } from '@/types';
import { ZodType } from 'zod';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from './ui/form';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { icons } from '@/lib/constants';

const CategoryIconSelect = <Tschema extends ZodType>({
	name,
	label,
	formControl,
}: BaseFormFieldProps<Tschema>) => {
	return (
		<FormField
			control={formControl}
			name={name}
			render={({ field }) => (
				<FormItem className='w-full'>
					{label && (
						<FormLabel htmlFor={field.name} className='mb-1'>
							{label}
						</FormLabel>
					)}
					<FormControl>
						<ToggleGroup
							type='single'
							size='lg'
							onValueChange={field.onChange}
							value={field.value}
							className='flex flex-wrap justify-center gap-2'>
							{Object.entries(icons)
								.sort(([nameA], [nameB]) => nameA.localeCompare(nameB))
								.map(([iconName, IconComponent], index) => (
									<ToggleGroupItem
										key={iconName}
										value={iconName}
										id={index === 0 ? field.name : undefined}
										className='gap 2 rounded-lg border-1 min-w-[50px] max-w-[50px]'
										aria-label={`${iconName} icon`}>
										<IconComponent className='m-2 h-5 w-5' />
									</ToggleGroupItem>
								))}
						</ToggleGroup>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};
export default CategoryIconSelect;
