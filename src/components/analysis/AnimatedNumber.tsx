import { useEffect } from 'react';
import {
    motion,
    useMotionValue,
    useReducedMotion,
    useSpring,
    useTransform,
} from 'framer-motion';
import { formatNumber } from '@/lib/format';

interface Props {
    value: number;
}

/**
 * Count-up number animation. Falls back to the static value when the user
 * prefers reduced motion.
 */
export default function AnimatedNumber({ value }: Props) {
    const reduceMotion = useReducedMotion();
    const motionValue = useMotionValue(0);
    const spring = useSpring(motionValue, { stiffness: 70, damping: 18, mass: 1 });
    const display = useTransform(spring, (latest) => formatNumber(Math.round(latest)));

    useEffect(() => {
        motionValue.set(value);
    }, [value, motionValue]);

    if (reduceMotion) {
        return <span className="tabular-nums">{formatNumber(value)}</span>;
    }

    return <motion.span className="tabular-nums">{display}</motion.span>;
}
