'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';

const PARTICLE_EMOJIS = ['✨', '💕', '⭐', '🌟'];
const PARTICLE_COUNT = 10;

// A brief celebratory burst, meant to be conditionally mounted for ~1s
// right when it should play (e.g. `{showSparkle && <SparkleBurst />}`).
export default function SparkleBurst() {
	const particles = useMemo(
		() =>
			Array.from({ length: PARTICLE_COUNT }, (_, i) => {
				const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
				const distance = 80 + Math.random() * 60;
				return {
					id: i,
					emoji: PARTICLE_EMOJIS[i % PARTICLE_EMOJIS.length],
					x: Math.cos(angle) * distance,
					y: Math.sin(angle) * distance,
					rotate: Math.random() * 360 - 180,
				};
			}),
		[],
	);

	return (
		<div className='pointer-events-none fixed inset-0 z-50 flex items-center justify-center'>
			{particles.map((p) => (
				<motion.span
					key={p.id}
					className='absolute text-2xl'
					initial={{ opacity: 1, scale: 0, x: 0, y: 0, rotate: 0 }}
					animate={{ opacity: 0, scale: 1, x: p.x, y: p.y, rotate: p.rotate }}
					transition={{ duration: 0.8, ease: 'easeOut' }}>
					{p.emoji}
				</motion.span>
			))}
		</div>
	);
}
