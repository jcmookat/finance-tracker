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
import * as LucideIcons from 'lucide-react';

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
					{label && <FormLabel htmlFor={field.name}>{label}</FormLabel>}
					<FormControl>
						<ToggleGroup
							type='single'
							onValueChange={field.onChange}
							value={field.value}>
							<ToggleGroupItem value='ReceiptJapaneseYen' id={field.name}>
								<LucideIcons.ReceiptJapaneseYen className='w-4 h-4' />
							</ToggleGroupItem>
							<ToggleGroupItem value='HeartPulse' size='lg'>
								<LucideIcons.HeartPulse />
							</ToggleGroupItem>
							<ToggleGroupItem value='ShoppingBasket' size='lg'>
								<LucideIcons.ShoppingBasket />
							</ToggleGroupItem>
						</ToggleGroup>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};
export default CategoryIconSelect;
