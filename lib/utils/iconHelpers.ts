import * as LucideIcons from 'lucide-react';

export type LucideIconComponent = React.ForwardRefExoticComponent<
	Omit<LucideIcons.LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
>;

// Resolve a stored icon name (e.g. "ShoppingBag") to its Lucide component,
// falling back to a default when the name is missing or no longer valid.
export function resolveIcon(
	iconName: string | null | undefined,
	itemName: string,
	fallback: LucideIconComponent = LucideIcons.ShoppingBag,
): LucideIconComponent {
	if (!iconName) return fallback;

	const potentialIcon = LucideIcons[iconName as keyof typeof LucideIcons];

	if (!potentialIcon) {
		console.warn(
			`Warning: Icon '${iconName}' not found in LucideIcons or is not a valid component. Using default for '${itemName}'.`,
		);
		return fallback;
	}

	return potentialIcon as LucideIconComponent;
}
