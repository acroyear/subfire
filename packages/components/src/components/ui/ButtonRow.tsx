import { Box, SxProps } from "@mui/material"
import { FC } from "react"

export interface ButtonRowProps {
    rowClassName?: string,
    rowStyle?: SxProps,
    alignLeft?: boolean
}

export const ButtonRow: FC<ButtonRowProps> = (p) => {
    const { rowClassName, rowStyle = {}, alignLeft } = p;
    let sx: SxProps = {
        display: 'flex',
        justifyContent: 'space-evenly',
        flex: '0 0 auto'
    }
    if (alignLeft) {
        sx.justifyContent = 'start'
    }
    sx = { ...sx, ...rowStyle };
    return <Box sx={sx} className={rowClassName}>{p.children}</Box>
}