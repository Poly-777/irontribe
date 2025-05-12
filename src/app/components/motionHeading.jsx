"use client"

import React from "react"
import { Box, Typography, Button, Container } from '@mui/material';
import { motion } from "framer-motion"

const MotionHeadings = ({ title, subtitle }) => {
	return (
		<div className="select-none flex flex-col justify-center items-center pt-24">
			<motion.div
				initial={{ y: -100, opacity: 0 }}
				animate={{ y: 0, opacity: 100 }}
				transition={{ duration: 0.2, delay: 0.5 }}
				className="md:absolute top-44 md:left-[10%] text-10xl xs:text-7xl md:text-8xl lg:text-9xl tracking-[0.3em] text-accent uppercase"
			>
				<Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
						{title}
					  </Typography>
					  <Typography variant="h5" sx={{ mb: 4 }}>
						{subtitle}

					  </Typography>
			</motion.div>
						<motion.h2
				initial={{ y: -100, opacity: 0 }}
				animate={{ y: 0, opacity: 100 }}
				transition={{ duration: 0.2, delay: 0.8 }}
				className="md:absolute top-[13rem] xs:top-[13.5rem] md:top-[14.5rem] md:left-[11%] lg:top-64 w-[260px] md:w-[350px] uppercase text-xl md:text-2xl text-white md:tracking-wide leading-9 text-center md:text-left"
			>
						{/* {subtitle} */}

			</motion.h2>
		</div>
	)
}

export default MotionHeadings
