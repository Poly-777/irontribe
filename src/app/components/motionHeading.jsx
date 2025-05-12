"use client"

import React from "react"
import { motion } from "framer-motion"

const MotionHeadings = () => {
	return (
		<div className="select-none flex flex-col justify-center items-center pt-24">
			<motion.h1
				initial={{ y: -100, opacity: 0 }}
				animate={{ y: 0, opacity: 100 }}
				transition={{ duration: 0.2, delay: 0.5 }}
				className="md:absolute top-44 md:left-[10%] text-6xl xs:text-7xl md:text-8xl lg:text-9xl tracking-[0.3em] text-accent uppercase"
			>
				Power
			</motion.h1>
			<motion.h2
				initial={{ y: -100, opacity: 0 }}
				animate={{ y: 0, opacity: 100 }}
				transition={{ duration: 0.2, delay: 0.8 }}
				className="md:absolute top-[13rem] xs:top-[13.5rem] md:top-[14.5rem] md:left-[11%] lg:top-64 w-[260px] md:w-[350px] uppercase text-xl md:text-2xl text-white md:tracking-wide leading-9 text-center md:text-left"
			>
				Break free from the routine. Train like world champions and achieve your
				peak fitness level.
			</motion.h2>
			<motion.h3
				initial={{ y: 500, opacity: 0, rotate: 90 }}
				animate={{ y: 0, opacity: 100, rotate: 90 }}
				transition={{ delay: 1.2 }}
				className="hidden lg:block absolute top-[10%] right-[-5%] uppercase text-white text-5xl transform rotate-90 origin-left w-[300px]"
			>
				What we have to offer
			</motion.h3>
		</div>
	)
}

export default MotionHeadings
