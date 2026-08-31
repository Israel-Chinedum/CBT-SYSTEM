import { Button } from "/src/components/Button";
import { Colors } from "/src/components/Color";
import { useNavigate, Link } from "react-router-dom";
import { LogOut } from "lucide-react";

export function Login() {
    const navigate = useNavigate();
    return (
        <div
            className="w-full min-h-screen flex justify-center items-center px-4 py-10"
            style={{ background: Colors.background }}
        >
            <div className="relative isolate w-full max-w-xl flex justify-center items-center">
                {/* Background shape — stretches to match form height, same pattern as Register */}
                <img
                    src="/src/assets/ree.png"
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-fill z-0 pointer-events-none select-none"
                />

                {/* Form sits on top, its size drives the wrapper's height */}
                <form
                    action=""
                    className="relative z-10 w-[88%] sm:w-[80%] bg-gray-100 my-8 sm:my-12 p-5 sm:p-8 rounded shadow-lg"
                >
                    <h3 className="text-2xl sm:text-4xl text-center font-bold mb-5 sm:mb-7">Login</h3>

                    <div className="form-group mb-3">
                        <label htmlFor="username" className="block mb-2 font-bold">Username</label>
                        <input
                            type="text"
                            placeholder="Enter username"
                            id="username"
                            className="username border block w-full rounded h-11 sm:h-12 px-3"
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="password" className="block mb-2 font-bold">Password</label>
                        <input
                            type="password"
                            placeholder="Enter password"
                            id="password"
                            className="password border block w-full rounded h-11 sm:h-12 px-3"
                        />
                    </div>
                    <div className="form-group mb-5">
                        <p>Don't have and account? {' '}
                            <Link
                                to="/register"
                                className="font-medium"
                                style={{ color: Colors.primary }}
                            >
                                Register
                            </Link>
                            {' /'}
                            <Link
                                to="/"
                                className="font-medium"
                                style={{ color: Colors.primary }}
                            >
                                Home
                            </Link>
                        </p>
                    </div>
                    <div className="form-group flex justify-center">
                        <Button name="Login" onClick={() => navigate("/cbtsidebar")}/>
                    </div>
                </form>
            </div>
        </div>
    );
}
