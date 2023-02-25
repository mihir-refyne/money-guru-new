import { CircleNotch, IconProps } from 'phosphor-react'
import React from 'react'

export default function CircularSpinner(props: IconProps) {
    return (
        <CircleNotch {...props}>
            <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                dur="2s"
                from="0 0 0"
                to="360 0 0"
                repeatCount="indefinite"
            ></animateTransform>
        </CircleNotch>
    )
}
