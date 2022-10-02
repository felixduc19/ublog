import {
    Box,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
} from "@chakra-ui/react";
import { useField } from "formik";
import React from "react";

interface InputFieldProps {
    name: string;
    label: string;
    placeholder: string;
    type: string;
}

const InputField = (props: InputFieldProps) => {
    const { placeholder, label, type } = props;
    const [field, { error }] = useField(props);

    return (
        <FormControl isInvalid={!!error}>
            <FormLabel
                htmlFor={field.name}
                ms="4px"
                fontSize="sm"
                fontWeight="normal"
            >
                {label}
            </FormLabel>
            <Box mb="24px">
                <Input
                    {...field}
                    placeholder={placeholder}
                    type={type}
                    borderRadius="15px"
                    fontSize="sm"
                    size="lg"
                />
                {error && <FormErrorMessage>{error}</FormErrorMessage>}
            </Box>
        </FormControl>
    );
};

export default InputField;
