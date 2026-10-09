import { Button } from "/src/components/Button";
import { Colors } from "/src/components/Color";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "/src/context/AuthContext";

export function Login() {

    const navigate = useNavigate();
    const { login } = useAuth();


    // ==========================================
    // FORM DATA
    // ==========================================

    const [formData, setFormData] = useState({
        email: "",
        password: ""
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
        // PASSWORD VALIDATION
        // ======================================

        const password = formData.password;

        if (!password) {

            newErrors.password =
                "Password is required.";

        } else if (password.length < 8) {

            newErrors.password =
                "Password must be at least 8 characters.";

        }


        // ======================================
        // SAVE ERRORS
        // ======================================

        setErrors(newErrors);


        // ======================================
        // RETURN VALIDATION RESULT
        // ======================================

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


        // ======================================
        // START LOADING
        // ======================================

        setLoading(true);


        try {

            // ==================================
            // SEND LOGIN REQUEST TO BACKEND
            // ==================================

            const response = await fetch(
                "https://cbt-system-server.onrender.com/auth/signin",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        email: formData.email.trim(),

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


            console.log("Login server response:", data);


            // ==================================
            // LOGIN SUCCESSFUL
            // ==================================

            if (response.ok) {

                setMessage(
                    data.message ||
                    "Login successful!"
                );


                // ==================================
                // REDIRECT AFTER SUCCESSFUL LOGIN
                // ==================================

                login(data.user, data.token);

                navigate("/dashboard", { replace: true });

            }


            // ==================================
            // LOGIN FAILED
            // ==================================

            else {

                setMessage(
                    data.message ||
                    "Invalid email or password."
                );

            }


        } catch (error) {

            // ==================================
            // CONNECTION ERROR
            // ==================================

            console.error(
                "Login error:",
                error
            );


            setMessage(
                "Unable to connect to the server. Please try again."
            );


        } finally {

            // ==================================
            // STOP LOADING
            // ==================================

            setLoading(false);

        }
    };


    // ==========================================
    // PAGE
    // ==========================================

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
                    src="/src/assets/ree.png"
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
                        Login
                    </h3>


                    {/* =====================================
                        SERVER MESSAGE
                    ====================================== */}

                    {message && (

                        <div
                            className={`mb-5 p-3 rounded text-center ${
                                message.toLowerCase().includes("successful")
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                            }`}
                        >
                            {message}
                        </div>

                    )}


                    {/* =====================================
                        EMAIL
                    ====================================== */}

                    <div className="form-group mb-4">

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
                            className={`border block w-full rounded h-11 sm:h-12 px-3 ${
                                errors.email
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                        />


                        {/* EMAIL ERROR */}

                        {errors.email && (

                            <p className="text-red-500 text-sm mt-1">
                                {errors.email}
                            </p>

                        )}

                    </div>


                    {/* =====================================
                        PASSWORD
                    ====================================== */}

                    <div className="form-group mb-4">

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
                            className={`border block w-full rounded h-11 sm:h-12 px-3 ${
                                errors.password
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                        />


                        {/* PASSWORD ERROR */}

                        {errors.password && (

                            <p className="text-red-500 text-sm mt-1">
                                {errors.password}
                            </p>

                        )}

                    </div>


                    {/* ==========================================
                        REGISTER / HOME LINKS
                    =========================================== */}

                    <div className="form-group mb-5">

                        <p>

                            Don't have an account?{" "}

                            <Link
                                to="/register"
                                className="font-medium"
                                style={{
                                    color: Colors.primary
                                }}
                            >
                                Register
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
                        LOGIN BUTTON
                    =========================================== */}

                    <div className="form-group flex justify-center">

                        <Button
                            name={
                                loading
                                    ? "Logging in..."
                                    : "Login"
                            }
                            disabled={loading}
                        />

                    </div>

                </form>

            </div>

        </div>
    );
}
