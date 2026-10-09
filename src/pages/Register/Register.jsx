import { Button } from "/src/components/Button";
import { Colors } from "/src/components/Color";
import { Link } from "react-router-dom";
import { useState } from "react";
import starShape from "/src/assets/ree.png";

export function Register() {

    // ==========================================
    // FORM DATA
    // ==========================================

    const [formData, setFormData] = useState({
        fullname: "",
        username: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
    });


    // ==========================================
    // FIELD ERRORS
    // ==========================================

    const [errors, setErrors] = useState({});


    // ==========================================
    // SERVER MESSAGE
    // ==========================================

    const [message, setMessage] = useState("");


    // ==========================================
    // LOADING STATE
    // ==========================================

    const [loading, setLoading] = useState(false);


    // ==========================================
    // HANDLE INPUT CHANGE
    // ==========================================

    const handleChange = (e) => {

        const { id, value } = e.target;

        setFormData((previousData) => ({
            ...previousData,
            [id]: value
        }));


        // Remove the error for the field
        // once the user starts correcting it

        setErrors((previousErrors) => ({
            ...previousErrors,
            [id]: ""
        }));


        // Remove general server message

        setMessage("");
    };


    // ==========================================
    // VALIDATE FORM
    // ==========================================

    const validateForm = () => {

        const newErrors = {};


        // ======================================
        // FULL NAME VALIDATION
        // ======================================

        const fullname = formData.fullname.trim();

        if (!fullname) {

            newErrors.fullname =
                "Full name is required.";

        } else if (fullname.length < 3) {

            newErrors.fullname =
                "Full name must be at least 3 characters.";

        } else if (!/^[a-zA-Z\s'-]+$/.test(fullname)) {

            newErrors.fullname =
                "Full name contains invalid characters.";
        }


        // ======================================
        // USERNAME VALIDATION
        // ======================================

        const username = formData.username.trim();

        if (!username) {

            newErrors.username =
                "Username is required.";

        } else if (username.length < 3) {

            newErrors.username =
                "Username must be at least 3 characters.";

        } else if (username.length > 30) {

            newErrors.username =
                "Username cannot exceed 30 characters.";

        } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {

            newErrors.username =
                "Username can only contain letters, numbers and underscore.";
        }


        // ======================================
        // EMAIL VALIDATION
        // ======================================

        const email = formData.email.trim();

        if (!email) {

            newErrors.email =
                "Email is required.";

        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ) {

            newErrors.email =
                "Please enter a valid email address.";
        }


        // ======================================
        // PHONE VALIDATION
        // ======================================

        const phone = formData.phone.trim();

        if (!phone) {

            newErrors.phone =
                "Phone number is required.";

        } else if (!/^\+?[0-9]{10,15}$/.test(phone)) {

            newErrors.phone =
                "Please enter a valid phone number.";
        }


        // ======================================
        // PASSWORD VALIDATION
        // ======================================

        const password = formData.password;

        if (!password) {

            newErrors.password =
                "Password is required.";

        } else if (password.length < 8) {

            newErrors.password =
                "Password must be at least 8 characters.";

        } else if (!/[A-Z]/.test(password)) {

            newErrors.password =
                "Password must contain at least one uppercase letter.";

        } else if (!/[a-z]/.test(password)) {

            newErrors.password =
                "Password must contain at least one lowercase letter.";

        } else if (!/[0-9]/.test(password)) {

            newErrors.password =
                "Password must contain at least one number.";
        }


        // ======================================
        // CONFIRM PASSWORD VALIDATION
        // ======================================

        if (!formData.confirmPassword) {

            newErrors.confirmPassword =
                "Please confirm your password.";

        } else if (
            formData.password !== formData.confirmPassword
        ) {

            newErrors.confirmPassword =
                "Passwords do not match.";
        }


        // Save errors

        setErrors(newErrors);


        // Return true if there are no errors

        return Object.keys(newErrors).length === 0;
    };


    // ==========================================
    // SUBMIT FORM
    // ==========================================

    const handleSubmit = async (e) => {

        // Prevent normal form submission

        e.preventDefault();


        // Clear previous message

        setMessage("");


        // ======================================
        // RUN FRONTEND VALIDATION
        // ======================================

        const isValid = validateForm();


        // Stop if validation failed

        if (!isValid) {
            return;
        }


        // Start loading

        setLoading(true);


        try {

            // ==================================
            // SEND REQUEST TO BACKEND
            // ==================================

            const response = await fetch(
                "https://cbt-system-server.onrender.com/user/create-user",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        fullname: formData.fullname.trim(),

                        username: formData.username.trim(),

                        email: formData.email.trim(),

                        phone: formData.phone.trim(),

                        password: formData.password

                    })
                }
            );


            // ==================================
            // GET SERVER RESPONSE
            // ==================================

            let data = {};

            try {

                data = await response.json();

            } catch {

                data = {};

            }


            console.log("Server response:", data);


            // ==================================
            // SUCCESS
            // ==================================

            if (response.ok) {

                setMessage(
                    data.message ||
                    "Registration successful!"
                );


                // Clear the form

                setFormData({
                    fullname: "",
                    username: "",
                    email: "",
                    phone: "",
                    password: "",
                    confirmPassword: ""
                });


                // Clear field errors

                setErrors({});


                // If you later want to redirect
                // after successful registration:
                //
                // navigate("/login");

            }


            // ==================================
            // SERVER ERROR
            // ==================================

            else {

                /*
                    If the backend detects:

                    - existing username
                    - existing email
                    - existing phone
                    - invalid data
                    - other registration errors

                    the backend's message will be
                    displayed here.
                */

                setMessage(
                    data.message ||
                    "Registration failed."
                );
            }


        } catch (error) {

            // ==================================
            // CONNECTION ERROR
            // ==================================

            console.error(
                "Registration error:",
                error
            );


            setMessage(
                "Unable to connect to the server. Please try again."
            );


        } finally {

            // Stop loading

            setLoading(false);

        }
    };


    return (

        <div
            className="w-full min-h-screen flex justify-center items-center px-4 py-10"
            style={{ background: Colors.background }}
        >

            <div
                className="relative isolate w-full max-w-xl flex justify-center items-center"
            >

                {/* BACKGROUND IMAGE */}

                <img
                    src={starShape}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-fill z-0 pointer-events-none select-none"
                />


                {/* FORM */}

                <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="relative z-10 w-[88%] sm:w-[80%] bg-gray-100 my-8 sm:my-12 p-5 sm:p-8 rounded shadow-lg"
                >

                    {/* TITLE */}

                    <h3 className="text-2xl sm:text-4xl text-center font-bold mb-5 sm:mb-7">
                        Register
                    </h3>


                    {/* SERVER MESSAGE */}

                    {message && (

                        <div className="mb-5 p-3 rounded bg-gray-200 text-center">
                            {message}
                        </div>

                    )}


                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">


                        {/* =====================================
                            FULL NAME
                        ====================================== */}

                        <div className="form-group mb-3 min-w-0">

                            <label
                                htmlFor="fullname"
                                className="block mb-2 font-bold"
                            >
                                Full Name
                            </label>

                            <input
                                type="text"
                                placeholder="Enter fullname"
                                id="fullname"
                                value={formData.fullname}
                                onChange={handleChange}
                                className={`border block rounded h-11 sm:h-12 w-full px-3 min-w-0 ${
                                    errors.fullname
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                            />

                            {errors.fullname && (

                                <p className="text-red-500 text-sm mt-1">
                                    {errors.fullname}
                                </p>

                            )}

                        </div>


                        {/* =====================================
                            USERNAME
                        ====================================== */}

                        <div className="form-group mb-3 min-w-0">

                            <label
                                htmlFor="username"
                                className="block mb-2 font-bold"
                            >
                                Username
                            </label>

                            <input
                                type="text"
                                placeholder="Enter username"
                                id="username"
                                value={formData.username}
                                onChange={handleChange}
                                className={`border block rounded h-11 sm:h-12 w-full px-3 min-w-0 ${
                                    errors.username
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                            />

                            {errors.username && (

                                <p className="text-red-500 text-sm mt-1">
                                    {errors.username}
                                </p>

                            )}

                        </div>


                        {/* =====================================
                            EMAIL
                        ====================================== */}

                        <div className="form-group mb-3 min-w-0">

                            <label
                                htmlFor="email"
                                className="block mb-2 font-bold"
                            >
                                Email
                            </label>

                            <input
                                type="email"
                                placeholder="Enter email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`border block rounded h-11 sm:h-12 w-full px-3 min-w-0 ${
                                    errors.email
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                            />

                            {errors.email && (

                                <p className="text-red-500 text-sm mt-1">
                                    {errors.email}
                                </p>

                            )}

                        </div>


                        {/* =====================================
                            PHONE
                        ====================================== */}

                        <div className="form-group mb-3 min-w-0">

                            <label
                                htmlFor="phone"
                                className="block mb-2 font-bold"
                            >
                                Phone Number
                            </label>

                            <input
                                type="text"
                                placeholder="Enter phone"
                                id="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`border block rounded h-11 sm:h-12 w-full px-3 min-w-0 ${
                                    errors.phone
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                            />

                            {errors.phone && (

                                <p className="text-red-500 text-sm mt-1">
                                    {errors.phone}
                                </p>

                            )}

                        </div>


                        {/* =====================================
                            PASSWORD
                        ====================================== */}

                        <div className="form-group mb-3 min-w-0">

                            <label
                                htmlFor="password"
                                className="block mb-2 font-bold"
                            >
                                Password
                            </label>

                            <input
                                type="password"
                                placeholder="Enter password"
                                id="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`border block w-full rounded h-11 sm:h-12 px-3 min-w-0 ${
                                    errors.password
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                            />

                            {errors.password && (

                                <p className="text-red-500 text-sm mt-1">
                                    {errors.password}
                                </p>

                            )}

                        </div>


                        {/* =====================================
                            CONFIRM PASSWORD
                        ====================================== */}

                        <div className="form-group mb-3 min-w-0">

                            <label
                                htmlFor="confirmPassword"
                                className="block mb-2 font-bold"
                            >
                                Confirm Password
                            </label>

                            <input
                                type="password"
                                placeholder="Re-enter password"
                                id="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`border block w-full rounded h-11 sm:h-12 px-3 min-w-0 ${
                                    errors.confirmPassword
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                            />

                            {errors.confirmPassword && (

                                <p className="text-red-500 text-sm mt-1">
                                    {errors.confirmPassword}
                                </p>

                            )}

                        </div>

                    </div>


                    {/* ==========================================
                        LOGIN / HOME LINKS
                    =========================================== */}

                    <div className="form-group mb-5">

                        <p>

                            Already have an account?{" "}

                            <Link
                                to="/login"
                                className="font-medium"
                                style={{
                                    color: Colors.primary
                                }}
                            >
                                Login
                            </Link>

                            {" / "}

                            <Link
                                to="/"
                                className="font-medium"
                                style={{
                                    color: Colors.primary
                                }}
                            >
                                Home
                            </Link>

                        </p>

                    </div>


                    {/* ==========================================
                        REGISTER BUTTON
                    =========================================== */}

                    <div className="form-group flex justify-center">

                        <Button
                            name={
                                loading
                                    ? "Registering..."
                                    : "Register"
                            }
                            disabled={loading}
                        />

                    </div>

                </form>

            </div>

        </div>
    );
}
