import { useId } from 'react';
import { FiSearch } from 'react-icons/fi';

interface Props {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

/** Accessible search field with a leading icon. */
export default function SearchInput({
    value,
    onChange,
    placeholder = 'Search username…',
    className = '',
}: Props) {
    const id = useId();
    return (
        <div className="relative">
            <label htmlFor={id} className="sr-only">
                {placeholder}
            </label>
            <FiSearch
                aria-hidden
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
                id={id}
                type="search"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`w-full pl-11 pr-4 outline-none transition-all ${className}`}
            />
        </div>
    );
}
