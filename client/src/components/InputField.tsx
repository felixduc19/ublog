import {
    Box,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Textarea,
} from "@chakra-ui/react";
import { useField } from "formik";
import React from "react";

interface InputFieldProps {
    name: string;
    label: string;
    placeholder: string;
    type: string;
    textarea?: boolean;
}

const InputField = (props: InputFieldProps) => {
    const { placeholder, label, type, textarea } = props;
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
                {textarea ? (
                    <Textarea
                        bg={"white"}
                        {...field}
                        placeholder={placeholder}
                        borderRadius="15px"
                        size={"lg"}
                        fontSize="sm"
                    />
                ) : (
                    <Input
                        {...field}
                        placeholder={placeholder}
                        type={type}
                        borderRadius="15px"
                        fontSize="sm"
                        size="lg"
                        bg={"white"}
                    />
                )}

                {error && <FormErrorMessage>{error}</FormErrorMessage>}
            </Box>
        </FormControl>
    );
};

export default InputField;
