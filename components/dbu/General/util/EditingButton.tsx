import * as React from "react";

export type ButtonVariant =
	| "section" // We use this for adding Sections.
	| "remove" // We use this for removing abilities from traits.
	| "add" // We use this for adding abilities to traits, or adding traits below sections.
	| "delete" // We use this for removing entire traits or sections.
	| "sort"; // We use this for sorting items within a trait.

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant: ButtonVariant;
	children?: React.ReactNode;
	icon?: React.ComponentType<{ size?: number }>;
}

const baseStyle =
	"flex items-center gap-1.5 text-sm rounded-md transition-colors";

const variantStyles: Record<ButtonVariant, string> = {
	section:
		"px-3 py-1.5 border border-dbu-header/50 text-dbu-header bg-dbu-header/10 hover:bg-dbu-header/20",
	remove: "px-3 py-1.5 border border-red-500/50 text-red-400 bg-red-900/20 hover:bg-red-900/40",
	add: "px-3 py-1.5 border border-white/30 text-white bg-white/10 hover:bg-white/20",
	delete: "px-3 py-1.5 rounded-md text-sm border border-red-500/50 text-red-400 bg-red-900/20 hover:bg-red-900/40",
	// sort is a wider button
	sort: "px-6 py-1.5 border border-dbu-header/50 text-dbu-header bg-dbu-header/10 hover:bg-dbu-header/20",
};

export const EditingButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ variant, icon: Icon, children, className, ...props }, ref) => {
		return (
			<button
				ref={ref}
				className={`${baseStyle} ${variantStyles[variant]} ${className || ""}`}
				{...props} // Spreads onClick, title, type, disabled, etc. automatically
			>
				{Icon && <Icon size={16} />}
				{children}
			</button>
		);
	},
);

EditingButton.displayName = "Editing_Button";
