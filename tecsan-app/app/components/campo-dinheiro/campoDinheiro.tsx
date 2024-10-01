"use client"
import dynamic from "next/dynamic";
const CurrencyInput = dynamic(() => import('input-currency-react').then(mod => mod.CurrencyInput), { ssr: false });

export const CampoDinheiro = ({ onChangeValue, value, className }: { onChangeValue: (value: string) => void, value: string, className?: string }) => {
    return (
        <CurrencyInput
            className={className}
            value={value}
            onChangeEvent={(input, valueWithMask, value) => {
                onChangeValue(value) }}
            options={{
                precision: 2,
                style: "currency",
                locale: "pt-BR",
                i18nCurrency: "BRL"
            }}
        ></CurrencyInput>
    )
}