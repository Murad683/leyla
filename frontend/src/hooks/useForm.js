import { useState } from 'react';

const useForm = (initialValues = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
    setIsSuccess(false);
    setIsError(false);
  };

  return {
    values,
    errors,
    setErrors,
    handleChange,
    isSubmitting,
    setIsSubmitting,
    isSuccess,
    setIsSuccess,
    isError,
    setIsError,
    reset
  };
};

export default useForm;
