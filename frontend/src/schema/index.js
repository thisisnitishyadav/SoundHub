import * as  Yup from 'yup';

export const SignUpSchema =Yup.object().shape({
    name:Yup.string().min(2).max(25).required("Please enter name"),
    email: Yup.string().email('Invalid email').required('Please enter your email'),
    password: Yup.string().min(6).required("Please enter your password"),
    // confirmpassword:Yup.string().required().oneOf([Yup.ref('password'),null],'Password must match'),
   

    
})